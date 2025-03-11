import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/registerDto";
import { SignInDto } from "./dto/sign-in-dto";
import { UsersService } from "src/users/users.service";

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
}
