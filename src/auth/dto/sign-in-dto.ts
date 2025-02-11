import { IsString, MinLength } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class SignInDto implements Omit<CreateUserDto, "email"> {
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  readonly password!: string;

  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters" })
  readonly username!: string;
}
