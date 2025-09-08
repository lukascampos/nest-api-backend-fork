import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Roles } from '@prisma/client';
import { UsersRepository } from '@/repositories/users.repository';
import { PrismaService } from '@/_config/database/prisma/prisma.service';
import { Either, left, right } from '@/_utils/either';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

export interface AuthenticateInput {
  email: string;
  password: string;
  ipHost: string;
  userAgent: string;
}

export interface AuthenticateOutput {
  user: {
    id: string;
    name: string;
    socialName?: string;
    email: string;
    roles: Roles[];
  };
  session: {
    id: string;
    accessToken: string;
    expiresAt: Date;
  };
}

type Output = Either<InvalidCredentialsError, AuthenticateOutput>;

@Injectable()
export class AuthenticateUseCase {
  private readonly logger = new Logger(AuthenticateUseCase.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: AuthenticateInput): Promise<Output> {
    const {
      email, password, ipHost, userAgent,
    } = input;

    try {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
        this.logger.warn(`Login attempt with non-existent email: ${email}`);
        return left(new InvalidCredentialsError());
      }

      if (user.isDisabled) {
        this.logger.warn(`Login attempt with disabled user: ${email}`);
        return left(new InvalidCredentialsError());
      }

      const passwordMatches = await compare(password, user.password);

      if (!passwordMatches) {
        this.logger.warn(`Invalid password attempt for user: ${email}`);
        return left(new InvalidCredentialsError());
      }

      await this.cleanupExpiredSessions(user.id);

      const result = await this.prisma.$transaction(async (tx) => {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

        const session = await tx.session.create({
          data: {
            userId: user.id,
            expiresAt,
            ipHost,
            userAgent,
            lastUsedAt: new Date(),
          },
        });

        return { user, session };
      });

      const tokenPayload = {
        sub: result.user.id,
        jti: result.session.id,
        email: result.user.email,
        name: result.user.name,
        roles: result.user.roles,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(result.session.expiresAt.getTime() / 1000),
      };

      const accessToken = await this.jwtService.signAsync(tokenPayload);

      this.logger.log(`User authenticated successfully: ${result.user.id}`);

      return right({
        user: {
          id: result.user.id,
          name: result.user.name,
          socialName: result.user.socialName ?? undefined,
          email: result.user.email,
          roles: result.user.roles,
        },
        session: {
          id: result.session.id,
          accessToken,
          expiresAt: result.session.expiresAt,
        },
      });
    } catch (error) {
      this.logger.error(`Authentication error for ${email}:`, error);
      return left(new InvalidCredentialsError());
    }
  }

  private async cleanupExpiredSessions(userId: string): Promise<void> {
    try {
      await this.prisma.session.updateMany({
        where: {
          userId,
          expiresAt: {
            lt: new Date(),
          },
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions:', error);
    }
  }
}
