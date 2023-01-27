import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UserRepository } from 'src/users/repository/user.repository';
import { TaskRepository } from 'src/tasks/repository/task.repository';
import { from, Observable, switchMap } from 'rxjs';
import { LocaleService } from 'src/locale/locale.service';
import { User } from 'src/schemas/user.schema';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { Schema } from 'mongoose';
import { Role } from 'src/enum/role.enum';
import { GetTasksQueryDto } from 'src/tasks/dto/get-tasks-query.dto';

@Injectable()
export class TasksService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(TaskRepository)
  private readonly taskRepository: TaskRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  createTask(user: Observable<User>, dto: CreateTaskDto) {
    const { assignedTo } = dto;
    return from(this.userRepository.getUserTeacher(assignedTo)).pipe(
      switchMap((teacher) => {
        if (!teacher) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        return user.pipe(
          switchMap((createdBy) => {
            if (teacher._id.toString() !== createdBy._id.toString()) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(
              this.taskRepository.create({
                ...dto,
                createdBy: createdBy._id,
              }),
            );
          }),
        );
      }),
    );
  }

  updateTask(
    user: Observable<User>,
    taskId: Schema.Types.ObjectId,
    dto: UpdateTaskDto,
  ) {
    return user.pipe(
      switchMap((createdBy) => {
        return this.taskRepository
          .findOne({
            _id: taskId,
            createdBy: createdBy._id,
          })
          .pipe(
            switchMap((task) => {
              if (!task) {
                throw new ForbiddenException(
                  this.localeService.translate('errors.forbidden'),
                );
              }
              return this.taskRepository.update(taskId, dto);
            }),
          );
      }),
    );
  }

  deleteTask(user: Observable<User>, taskId: Schema.Types.ObjectId) {
    return user.pipe(
      switchMap((createdBy) => {
        return this.taskRepository
          .findOne({
            _id: taskId,
            createdBy: createdBy._id,
          })
          .pipe(
            switchMap((task) => {
              if (!task) {
                throw new ForbiddenException(
                  this.localeService.translate('errors.forbidden'),
                );
              }
              return this.taskRepository.remove(taskId);
            }),
          );
      }),
    );
  }

  getTasks(user: Observable<User>, dto: GetTasksQueryDto) {
    return user.pipe(
      switchMap((user) => {
        return this.taskRepository.getWithPagination(
          {
            page: dto.page,
            size: dto.size,
          },
          {
            ...(user.role === Role.TEACHER
              ? { createdBy: user._id }
              : { assignedTo: user._id }),
            ...(dto.completed !== undefined
              ? { completed: dto.completed }
              : {}),
            ...(dto.simulator ? { simulator: dto.simulator } : {}),
            ...(dto.assignedTo ? { assignedTo: dto.assignedTo } : {}),
          },
          {
            createdAt: dto.order,
          },
        );
      }),
    );
  }
}
