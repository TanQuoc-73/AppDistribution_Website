import { SetMetadata } from '@nestjs/common';

export type UserRole = 'admin' | 'user' | 'developer';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
