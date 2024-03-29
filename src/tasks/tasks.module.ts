import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from 'src/users/users.module';
import { TaskRepository } from 'src/tasks/repository/task.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { MonetizationModule } from 'src/monetization/monetization.module';

@Module({
  imports: [
    UsersModule,
    MonetizationModule,
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  providers: [TasksService, TaskRepository],
  controllers: [TasksController],
})
export class TasksModule {}
