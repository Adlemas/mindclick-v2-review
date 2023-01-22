import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Schema } from 'mongoose';
import { from, Observable, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GroupRepository } from 'src/groups/repository/group.repository';
import { LocaleService } from 'src/locale/locale.service';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class UserRepository {
  @InjectModel(User.name)
  private readonly userModel: Model<User>;

  @Inject(GroupRepository)
  private readonly groupRepository: GroupRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  createUser(
    userId: Schema.Types.ObjectId,
    createUserDto: CreateUserDto,
  ): Observable<User> {
    return from(this.groupRepository.findGroupById(createUserDto.groupId)).pipe(
      switchMap((group) => {
        if (!group) {
          throw new NotFoundException(
            this.localeService.translate('errors.group_not_found'),
          );
        }
        if (group.owner.toString() !== userId.toString()) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        return from(
          this.userModel.create({
            ...createUserDto,
            role: Role.STUDENT,
            group: group._id,
          }),
        );
      }),
    );
  }

  findOne(filter: Partial<User>): Observable<UserDocument> {
    return from(this.userModel.findOne(filter).exec());
  }

  findById(userId: Schema.Types.ObjectId): Observable<User> {
    return from(this.userModel.findById(userId).exec());
  }

  updateById(
    userId: Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Observable<User> {
    return from(
      this.userModel
        .findByIdAndUpdate(userId, updateUserDto, {
          new: true,
        })
        .exec(),
    );
  }
}
