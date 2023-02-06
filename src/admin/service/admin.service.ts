import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Schema } from 'mongoose';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { from, Observable, switchMap } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';
import { PaginatedResponse } from 'src/interface/paginated-response.interface';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { UpdateAdminDto } from 'src/admin/dto/update-admin.dto';
import { LocaleService } from 'src/locale/locale.service';

@Injectable()
export class AdminService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  createUser(user: Observable<User>, dto: CreateAdminDto) {
    return from(user).pipe(
      switchMap((user) => {
        return from(
          this.usersService.createTeacher({
            ...dto,
            createdBy: user._id,
          }),
        );
      }),
    );
  }

  updateUser(
    user: Observable<User>,
    userId: Schema.Types.ObjectId,
    dto: UpdateAdminDto,
  ) {
    return this.getUser(user, userId).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException(
            this.localeService.translate('errors.not_found'),
          );
        }

        return from(this.usersService.updateTeacher(user._id, dto));
      }),
    );
  }

  deleteUser(user: Observable<User>, userId: Schema.Types.ObjectId) {
    return this.getUser(user, userId).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException(
            this.localeService.translate('errors.not_found'),
          );
        }

        return from(this.usersService.deleteTeacher(user._id));
      }),
    );
  }

  getUsers(
    user: Observable<User>,
    pagination: PaginationQueryDto,
  ): Observable<PaginatedResponse<Array<User>>> {
    return from(user).pipe(
      switchMap((user) => {
        return from(
          this.usersService.find(
            {
              createdBy: user._id,
            },
            pagination,
          ),
        );
      }),
    );
  }

  getUser(user: Observable<User>, userId: Schema.Types.ObjectId) {
    return from(user).pipe(
      switchMap((user) => {
        return from(
          this.usersService.findOne({
            createdBy: user._id,
            _id: userId,
          }),
        );
      }),
    );
  }
}
