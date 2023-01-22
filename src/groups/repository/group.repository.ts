import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/schemas/group.schema';
import { Model, Schema } from 'mongoose';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { from, Observable } from 'rxjs';

export class GroupRepository {
  @InjectModel(Group.name)
  private readonly groupModel: Model<Group>;

  createGroup(
    createGroupDto: CreateGroupDto,
    userId: Schema.Types.ObjectId,
  ): Observable<Group> {
    const group = new this.groupModel(createGroupDto);
    group.owner = userId;
    return from(group.save());
  }
}
