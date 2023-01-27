import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UserRepository } from 'src/users/repository/user.repository';
import { TaskRepository } from 'src/tasks/repository/task.repository';
import { from, switchMap } from 'rxjs';
import { LocaleService } from 'src/locale/locale.service';

@Injectable()
export class TasksService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(TaskRepository)
  private readonly taskRepository: TaskRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  createTask(dto: CreateTaskDto) {
    const { createdBy, assignedTo } = dto;
    return from(this.userRepository.getUserTeacher(assignedTo)).pipe(
      switchMap((teacher) => {
        if (!teacher) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        if (teacher._id.toString() !== createdBy.toString()) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        return from(this.taskRepository.create(dto));
      }),
    );
  }
}
