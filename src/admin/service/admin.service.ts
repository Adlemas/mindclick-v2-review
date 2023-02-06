import { Inject, Injectable } from '@nestjs/common';
import { Schema } from 'mongoose';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { from, Observable, switchMap } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';
import { PaginatedResponse } from 'src/interface/paginated-response.interface';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';

@Injectable()
export class AdminService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

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

  updateUser() {
    // TODO: Implement
    return 'updateUser';
  }

  deleteUser() {
    // TODO: Implement
    return 'deleteUser';
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
