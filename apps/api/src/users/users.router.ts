import {
  CreateUserDto,
  DeleteUserDto,
  FindByIdDto,
  FindByUsernameDto,
  UpdateProfileDto,
  UpdateUserDto,
} from "./users.dto";
import { Injectable } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";
import { UsersService } from "./users.service";
@Injectable()
export class UsersRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersService: UsersService,
  ) {}
  apply() {
    return {
      usersRouter: this.trpcService.trpc.router({
        createUser: this.trpcService
          .publicProcedure()
          .input(CreateUserDto)
          .mutation(async ({ input }) => this.usersService.create(input)),

        getProfile: this.trpcService
          .protectedProcedure()
          .query(async ({ ctx }) => this.usersService.findOne(ctx.user)),

        updateProfile: this.trpcService
          .protectedProcedure()
          .input(UpdateProfileDto)
          .mutation(async ({ ctx, input }) =>
            this.usersService.update({ id: ctx.user, ...input }),
          ),

        getUserById: this.trpcService
          .protectedProcedure()
          .input(FindByIdDto)
          .query(async ({ input }) => this.usersService.findOne(input.id)),

        getUserByUsername: this.trpcService
          .protectedProcedure()
          .input(FindByUsernameDto)
          .query(async ({ input }) =>
            this.usersService.findByUsername(input.username),
          ),

        updateUser: this.trpcService
          .protectedProcedure()
          .input(UpdateUserDto)
          .query(async ({ input }) => this.usersService.update(input)),

        deleteUser: this.trpcService
          .protectedProcedure()
          .input(DeleteUserDto)
          .query(async ({ input }) => this.usersService.remove(input.id)),
      }),
    };
  }
}
