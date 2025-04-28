import {
  INCORRECT_PASSWORD_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from "@repo/utils/constants";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { SignInUserDtoType } from "@repo/utils/schemas";
import { TRPCError } from "@trpc/server";
import { TrpcContext } from "src/trpc/trpc.service";
import { UsersService } from "src/users/users.service";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInUserDtoType, response: Response) {
    const { password: pass, username } = signInDto;
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: USER_NOT_FOUND_MESSAGE,
      });
    }

    const isPasswordCorrect = await compare(pass, user.password);
    if (!isPasswordCorrect) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: INCORRECT_PASSWORD_MESSAGE,
      });
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    // Set the HTTP-only cookie
    response.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // For cross-origin
      maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days
    });

    return {
      access_token: token,
    };
  }

  async checkAuthStatus(ctx: TrpcContext) {
    // the protectedProcedure check has been passed so the user is authenticated
    return { isAuthenticated: true, user: ctx.user };
  }
}
