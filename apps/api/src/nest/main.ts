import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const openApiConfig = new DocumentBuilder()
    .setTitle("Foobow API")
    .setDescription("Production backend scaffold for the Foobow virtual good karma MVP.")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup("docs", app, document);

  const port = Number(process.env.PORT ?? 8787);
  await app.listen(port, "127.0.0.1");
  return app;
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll("\\", "/")}`) {
  await bootstrap();
}
