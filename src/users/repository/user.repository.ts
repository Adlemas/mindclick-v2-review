import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Schema } from 'mongoose';
import { from, Observable, of, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GroupRepository } from 'src/groups/repository/group.repository';
import { LocaleService } from 'src/locale/locale.service';
import * as bcrypt from 'bcrypt';
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
  ): Observable<Omit<User, 'password'>> {
    return from(this.userModel.findOne({ email: createUserDto.email })).pipe(
      switchMap((userExists) => {
        if (userExists) {
          throw new ForbiddenException(
            this.localeService.translate('errors.email_exists'),
          );
        }
        return from(
          this.groupRepository.findUserGroup(userId, createUserDto.groupId),
        ).pipe(
          switchMap((group) => {
            if (!group) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(bcrypt.hash(createUserDto.password, 10)).pipe(
              switchMap((hashedPassword) => {
                return from(
                  this.userModel.create({
                    ...createUserDto,
                    password: hashedPassword,
                    role: Role.STUDENT,
                    group: group._id,
                  }),
                ).pipe(
                  switchMap((createdUser) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { password, ...user } = createdUser.toObject();
                    return of(user);
                  }),
                );
              }),
            );
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
