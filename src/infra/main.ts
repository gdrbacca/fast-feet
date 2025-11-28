import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // sem EnvService, seria assim
  // const configService = app.get<ConfigService<Env, true>>(ConfigService)
  // const port = configService.get('PORT', {infer: true})
  
  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  await app.listen(port ?? 3000);
}
bootstrap();
