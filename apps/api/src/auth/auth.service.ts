import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignInUserDtoType } from "@repo/utils/schemas";
import { TRPCError } from "@trpc/server";
import { UsersService } from "src/users/users.service";
import { compare } from "bcrypt";
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInUserDtoType) {
    const { password: pass, username } = signInDto;
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const isPasswordCorrect = await compare(pass, user.password);
    if (!isPasswordCorrect) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Incorrect password",
      });
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
