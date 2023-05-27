import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  public async createOne(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  public async findMany(data: Partial<User>): Promise<Array<User>> {
    return await this.prisma.user.findMany({
      where: data
    });
  }
}
