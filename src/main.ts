import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  app.setGlobalPrefix(process.env.API_PREFIX);
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL]
    })
  );

  await app.listen(port);
}

void bootstrap();
