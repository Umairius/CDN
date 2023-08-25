import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tusServer = app.get('TUS_SERVER');
  tusServer.listen(1080, () =>
    console.log('Tus server listening on port 1080'),
  );

  await app.listen(3000);
}
bootstrap();
