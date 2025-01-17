import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "./dto/sign-in-dto";
import { UsersService } from "src/users/users.service";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { password: pass, username } = signInDto;
    const user = await this.usersService.findByUsername(username);

    if (!user) throw new NotFoundException();

    if (user.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
