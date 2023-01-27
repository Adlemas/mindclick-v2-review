import { from, Observable } from 'rxjs';
import { CreateTaskDtoWithOwner } from 'src/tasks/dto/create-task.dto';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, SortOrder } from 'mongoose';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginatedResponse } from 'src/interface/paginated-response.interface';

@Injectable()
export class TaskRepository {
  @InjectModel(Task.name)
  private readonly taskModel: Model<Task>;

  @Inject(PaginationService)
  private readonly paginationService: PaginationService;

  create(dto: CreateTaskDtoWithOwner): Observable<TaskDocument> {
    return from(this.taskModel.create(dto));
  }

  getWithPagination(
    pagination: PaginationQueryDto,
    filter?: Partial<Task>,
    sort?: Partial<Record<keyof Task, SortOrder>>,
  ): Observable<PaginatedResponse<Array<Task>>> {
    return from(
      this.paginationService.paginate(this.taskModel, pagination, {
        filter,
        sort,
      }),
    );
  }

  findById(id: Schema.Types.ObjectId): Observable<Task> {
    return from(this.taskModel.findById(id).exec());
  }

  findOne(filter: Partial<Task>): Observable<Task> {
    return from(this.taskModel.findOne(filter).exec());
  }

  findBy(filter: Partial<Task>): Observable<Array<Task>> {
    return from(this.taskModel.find(filter).exec());
  }

  remove(id: Schema.Types.ObjectId): Observable<Task> {
    return from(this.taskModel.findByIdAndDelete(id).exec());
  }

  update(id: Schema.Types.ObjectId, dto: UpdateTaskDto): Observable<Task> {
    return from(
      this.taskModel.findByIdAndUpdate(id, dto, {
        new: true,
      }),
    );
  }
}
