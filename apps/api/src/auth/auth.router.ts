import { RegisterUserDto, SignInUserDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { Injectable } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  apply() {
    return {
      authRouter: this.trpcService.trpc.router({
        signInUser: this.trpcService
          .publicProcedure()
          .input(SignInUserDto)
          .mutation(async ({ input }) => this.authService.signIn(input)),

        registerUser: this.trpcService
          .publicProcedure()
          .input(RegisterUserDto)
          .mutation(async ({ input }) => this.usersService.create(input)),
      }),
    };
  }
}
