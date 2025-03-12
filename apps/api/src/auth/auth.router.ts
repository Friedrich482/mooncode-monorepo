import { AuthService } from "./auth.service";
import { Injectable } from "@nestjs/common";
import { SignInDto } from "./auth.dto";
import { TrpcService } from "src/trpc/trpc.service";

@Injectable()
export class AuthRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly authService: AuthService,
  ) {}

  apply() {
    return {
      authRouter: this.trpcService.trpc.router({
        signIn: this.trpcService
          .publicProcedure()
          .input(SignInDto)
          .mutation(async ({ input }) => this.authService.signIn(input)),
      }),
    };
  }
}
