import { Role } from 'src/enum/role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Array<Role>) => SetMetadata('roles', roles);
