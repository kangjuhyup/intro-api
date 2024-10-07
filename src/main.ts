import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  if (process.env.NODE_ENV === 'local') {
    app.enableCors({
      origin: 'http://localhost:5173', // React 앱 도메인
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용하는 HTTP 메서드
      allowedHeaders: 'Content-Type, Accept, Authorization', // 허용하는 요청 헤더
      credentials: true, // 쿠키 등 인증 관련 헤더 허용
    });
  } else {
    app.enableCors({
      origin: 'https://introduce.jhkang.xyz', // React 앱 도메인
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용하는 HTTP 메서드
      allowedHeaders: 'Content-Type, Accept, Authorization', // 허용하는 요청 헤더
      credentials: true, // 쿠키 등 인증 관련 헤더 허용
    });
  }
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
