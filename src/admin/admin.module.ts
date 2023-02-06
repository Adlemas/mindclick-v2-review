import { Module } from '@nestjs/common';
import { AdminService } from './service/admin.service';

@Module({
  providers: [AdminService],
})
export class AdminModule {}
