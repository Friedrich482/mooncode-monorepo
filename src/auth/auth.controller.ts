import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in-dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
    return req.user;
  }
}
