import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { DASHBOARD_PORT } from "@repo/utils/constants";
import { NestFactory } from "@nestjs/core";
import { TrpcExceptionFilter } from "./trpc/trpc.exception-handler";
import { TrpcRouter } from "./trpc/trpc.router";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: Array.from(
      { length: 6 },
      (_, i) => `http://localhost:${DASHBOARD_PORT + i}`,
    ),
    credentials: true,
  });

  app.use(cookieParser());
  const trpc = app.get(TrpcRouter);
  app.useGlobalFilters(new TrpcExceptionFilter());
  trpc.applyMiddleware(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
