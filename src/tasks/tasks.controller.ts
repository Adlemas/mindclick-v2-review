import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  @Inject(TasksService)
  private readonly tasksService: TasksService;

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }
}
