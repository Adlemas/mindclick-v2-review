import { Module } from '@nestjs/common';
import { AdminService } from './service/admin.service';
import { AdminController } from './controller/admin.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
