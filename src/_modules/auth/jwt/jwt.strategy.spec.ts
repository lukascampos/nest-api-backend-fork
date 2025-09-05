import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

import { Roles } from '@prisma/client';

// Mocks
const mockPrismaService = {
  session: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

const mockEnvService = {
  get: vi.fn().mockReturnValue('dGVzdC1wdWJsaWMta2V5'), 
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    jwtStrategy = new JwtStrategy(mockEnvService as any, mockPrismaService as any);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('validate', () => {
    const validPayload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      jti: '123e4567-e89b-12d3-a456-426614174001',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['USER'] as Roles[],
      isDisabled: false,
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + 3600,
    };

    const validSession = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      isRevoked: false,
      expiresAt: new Date(Date.now() + 3600000),
      userId: '123e4567-e89b-12d3-a456-426614174000',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        isDisabled: false,
        roles: [Roles.USER],
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    it('should validate successfully with valid payload and session', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(validSession);

      const result = await jwtStrategy.validate(validPayload);

      expect(result).toEqual({
        userId: validSession.user.id,
        sessionId: validSession.id,
        email: validSession.user.email,
        name: validSession.user.name,
        roles: validSession.user.roles,
      });
    });

    it('should throw UnauthorizedException if session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(jwtStrategy.validate(validPayload)).rejects.toThrow(
        new UnauthorizedException('Sessão não encontrada')
      );
    });

    it('should throw UnauthorizedException if session is revoked', async () => {
      const revokedSession = { ...validSession, isRevoked: true };
      mockPrismaService.session.findUnique.mockResolvedValue(revokedSession);

      await expect(jwtStrategy.validate(validPayload)).rejects.toThrow(
        new UnauthorizedException('Sessão foi revogada, faça login novamente')
      );
    });

    it('should throw UnauthorizedException if session has expired', async () => {
      const expiredSession = { 
        ...validSession, 
        expiresAt: new Date(Date.now() - 1000) 
      };
      mockPrismaService.session.findUnique.mockResolvedValue(expiredSession);

      await expect(jwtStrategy.validate(validPayload)).rejects.toThrow(
        new UnauthorizedException('Sessão expirou, faça login novamente')
      );
    });

    it('should throw UnauthorizedException if user is disabled', async () => {
      const disabledUserSession = {
        ...validSession,
        user: { ...validSession.user, isDisabled: true }
      };
      mockPrismaService.session.findUnique.mockResolvedValue(disabledUserSession);

      await expect(jwtStrategy.validate(validPayload)).rejects.toThrow(
        new UnauthorizedException('Seu usuário foi desabilitado, contate o suporte')
      );
    });

    it('should throw UnauthorizedException if session user mismatch', async () => {
      const mismatchPayload = { 
        ...validPayload, 
        sub: '123e4567-e89b-12d3-a456-426614174999' 
      };
      mockPrismaService.session.findUnique.mockResolvedValue(validSession);

      await expect(jwtStrategy.validate(mismatchPayload)).rejects.toThrow(
        new UnauthorizedException('Sessão inválida, faça login novamente')
      );
    });

    it('should use cache on second call', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(validSession);

      // Primeira chamada
      await jwtStrategy.validate(validPayload);
      // Segunda chamada
      await jwtStrategy.validate(validPayload);

      // Deve ter chamado o banco apenas uma vez (primeira vez)
      expect(mockPrismaService.session.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache when session becomes invalid', async () => {
      const revokedSession = { ...validSession, isRevoked: true };
      mockPrismaService.session.findUnique.mockResolvedValue(revokedSession);

      await expect(jwtStrategy.validate(validPayload)).rejects.toThrow();

      // Cache deve ter sido invalidado
      mockPrismaService.session.findUnique.mockResolvedValue(validSession);
      await jwtStrategy.validate(validPayload);

      expect(mockPrismaService.session.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('cache management', () => {
    it('should invalidate specific session cache', () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174001';
      
      // Não deve lançar erro
      expect(() => jwtStrategy.invalidateSessionCache(sessionId)).not.toThrow();
    });
  });
});