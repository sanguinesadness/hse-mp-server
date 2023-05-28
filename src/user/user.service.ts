import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { ozonProductService } from 'ozon/ozon-product-service';
import { TUserCredentials } from 'types';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  public async checkCredentials(credentials: TUserCredentials): Promise<void> {
    return ozonProductService.productList(credentials, {});
  }

  public async createOne(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  public async find(data: Partial<User>): Promise<User> {
    return await this.prisma.user.findFirst({
      where: data
    });
  }

  public async findBy(
    field: keyof User,
    value: string | number
  ): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        [field]: value
      }
    });
  }

  public async tryLogin(credentials: TUserCredentials): Promise<User> {
    return this.checkCredentials(credentials).then(async () => {
      const existingUser = await this.find(credentials);
      if (!existingUser) {
        return await this.createOne(credentials);
      }
      return existingUser;
    });
  }
}
