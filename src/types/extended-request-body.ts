import { User } from '@prisma/client';

export type TExtendedRequestBody = {
  user: User;
};
