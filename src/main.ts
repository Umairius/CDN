import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('combined'));

  await app.listen(3000);

  const tusServer = app.get('TUS_SERVER');
  // pass the port number over here as an argument
  tusServer.listen(1080, () =>
    console.log('Tus server listening on port 1080'),

  );

}
bootstrap();
