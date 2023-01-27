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
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

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
  getTasks(@Req() req, @Query() pagination: PaginationQueryDto) {
    return this.tasksService.getTasks(req.user, {
      page: pagination.page,
      size: pagination.size,
    });
  }
}
