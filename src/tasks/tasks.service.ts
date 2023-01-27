import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UserRepository } from 'src/users/repository/user.repository';
import { TaskRepository } from 'src/tasks/repository/task.repository';
import { from, Observable, switchMap } from 'rxjs';
import { LocaleService } from 'src/locale/locale.service';
import { User } from 'src/schemas/user.schema';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { Schema } from 'mongoose';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { Role } from 'src/enum/role.enum';

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

  getTasks(user: Observable<User>, pagination: PaginationQueryDto) {
    return user.pipe(
      switchMap((user) => {
        return this.taskRepository.getWithPagination(pagination, {
          ...(user.role === Role.TEACHER
            ? { createdBy: user._id }
            : { assignedTo: user._id }),
        });
      }),
    );
  }
}
