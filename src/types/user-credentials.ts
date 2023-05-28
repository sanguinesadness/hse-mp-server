import { User } from '@prisma/client';

export type TUserCredentials = Pick<User, 'clientId' | 'apiKey'>;
