import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/registerDto";
import { SignInDto } from "./dto/sign-in-dto";
import { UsersService } from "src/users/users.service";

type getProfileRequest = Request & {
  user: {
    sub: number;
    username: string;
  };
};
@Injectable()
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: getProfileRequest) {
    return this.usersService.findOne(req.user.sub);
  }
}
