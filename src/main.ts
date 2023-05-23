import { NestFactory } from '@nestjs/core';
import * as Prometheus from 'prom-client';
import { AppModule } from './app.module';
import { Response, Request } from 'express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.use('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', Prometheus.register.contentType);
    const metrics = await Prometheus.register.metrics();
    res.end(metrics);
  });

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();
