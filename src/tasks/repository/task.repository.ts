import { from, Observable } from 'rxjs';
import { CreateTaskDtoWithOwner } from 'src/tasks/dto/create-task.dto';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository {
  @InjectModel(Task.name)
  private readonly taskModel: Model<Task>;

  create(dto: CreateTaskDtoWithOwner): Observable<TaskDocument> {
    return from(this.taskModel.create(dto));
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
