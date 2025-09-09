import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './_config/env/env';
import { EnvModule } from './_config/env/env.module';
import { AuthModule } from './_modules/auth/auth.module';
import { HttpModule } from './http/http.module';
import { AttachmentsModule } from './_modules/attachments/attachments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AttachmentsModule,
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
