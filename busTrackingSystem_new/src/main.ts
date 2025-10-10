import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import * as cluster from 'cluster';
import * as os from 'os';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Bus Tracking API')
    .setDescription('API documentation for the Bus Tracking System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
 const uploadsPath = join(process.cwd(), 'uploads');

if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
    console.log('Created uploads folder at runtime:', uploadsPath);
  }
 console.log('Static upload path:', uploadsPath);
  console.log('Uploads exists?', existsSync(uploadsPath));

 app.use('/uploads', express.static(uploadsPath));
 
console.log('Uploads path (runtime):', join(__dirname, '..', 'uploads'));
console.log('Uploads exists?', existsSync(join(__dirname, '..', 'uploads')));
  
SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.PORT ?? 3000;
  // const HOST = process.env.HOST ?? '192.168.1.44';
 
  await app.listen(PORT);

  console.log(`🚀 Server is running at http://HOST:${PORT}`);
  // console.log(`📘 Swagger Docs available at http://${HOST}:${PORT}/api-docs`);
}

const clusterEnabled = String(process.env.CLUSTER_ENABLED || 'false').toLowerCase() === 'true';

if (clusterEnabled && (cluster as any).isPrimary) {
  const cpuCount =Math.min(os.cpus().length,2);
  console.log(`🏗️  Starting master process PID ${(process as any).pid} with ${cpuCount} workers...`);

  for (let i = 0; i < cpuCount; i += 1) {
    (cluster as any).fork();
  }

  (cluster as any).on('exit', (worker: any, code: number, signal: string) => {
    console.warn(`⚠️  Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Spawning a new one...`);
    (cluster as any).fork();
  });
} else {

  bootstrap().catch((err) => {
    console.error('❌ Application failed to start', err);
  });
}
