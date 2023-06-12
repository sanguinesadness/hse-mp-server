import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { UserAuthMiddleware } from 'common/middlewares';
import { ProductController } from 'ozon/product/product.controller';
import { ProductModule } from 'ozon/product/product.module';
import { ProductService } from 'ozon/product/product.service';
import { UserController } from 'user/user.controller';
import { UserModule } from 'user/user.module';
import { UserService } from 'user/user.service';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, ProductModule],
  controllers: [AppController, UserController, ProductController],
  providers: [AppService, UserService, ProductService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .exclude({
        path: `${process.env.API_PREFIX}/user/login`,
        method: RequestMethod.ALL
      })
      .forRoutes('*');
  }
}
