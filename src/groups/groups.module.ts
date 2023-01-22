import { forwardRef, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupRepository } from 'src/groups/repository/group.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/schemas/group.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [GroupsService, GroupRepository],
  controllers: [GroupsController],
  exports: [GroupsService, GroupRepository],
})
export class GroupsModule {}
