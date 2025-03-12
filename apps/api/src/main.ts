import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { TrpcExceptionFilter } from "./trpc/trpc.exception-handler";
import { TrpcRouter } from "./trpc/trpc.router";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const trpc = app.get(TrpcRouter);
  app.useGlobalFilters(new TrpcExceptionFilter());
  trpc.applyMiddleware(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
