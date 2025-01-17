import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { User } from "src/drizzle/schema/users";

export class CreateUserDto
  implements Pick<User, "email" | "password" | "username">
{
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  readonly email!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  readonly password!: string;

  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters" })
  readonly username!: string;
}
