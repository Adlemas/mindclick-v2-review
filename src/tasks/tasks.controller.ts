import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import {
  UpdateTaskDto,
  UpdateTaskParamDto,
} from 'src/tasks/dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  @Inject(TasksService)
  private readonly tasksService: TasksService;

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  createTask(@Body() dto: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(req.user, {
      expiresAt: dto.expiresAt,
      count: dto.count,
      assignedTo: dto.assignedTo,
      settings: dto.settings,
      simulator: dto.simulator,
    });
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put(':id')
  updateTask(
    @Param() { id }: UpdateTaskParamDto,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.updateTask(req.user, id, {
      expiresAt: dto.expiresAt,
      count: dto.count,
    });
  }
}
