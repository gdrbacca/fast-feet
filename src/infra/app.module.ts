import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { AuthModule } from './auth/auth.module';
import { HTTPModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HTTPModule
  ]
})
export class AppModule {}


//  readme e github
