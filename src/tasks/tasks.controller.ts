import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
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
import { RemoveTaskParamDto } from 'src/tasks/dto/remove-task.dto';
import { GetTasksQueryDto } from 'src/tasks/dto/get-tasks-query.dto';

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

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':id')
  deleteTask(@Param() { id }: RemoveTaskParamDto, @Req() req) {
    return this.tasksService.deleteTask(req.user, id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  getTasks(@Req() req, @Query() dto: GetTasksQueryDto) {
    return this.tasksService.getTasks(req.user, {
      page: dto.page,
      size: dto.size,
      completed: dto.completed,
      assignedTo: dto.assignedTo,
      simulator: dto.simulator,
      order: dto.order,
    });
  }
}
