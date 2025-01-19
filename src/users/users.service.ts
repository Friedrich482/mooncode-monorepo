import * as bcrypt from "bcrypt";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UpdateUserDto } from "./dto/update-user.dto";
import { eq } from "drizzle-orm";
import { users } from "src/drizzle/schema/users";

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;

    // check if a user with the username already exists
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser) {
      throw new ConflictException("This username is already used");
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const [userCreated] = await this.db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        profilePicture: "picture",
      })
      .returning({
        email: users.email,
        username: users.username,
        profilePicture: users.profilePicture,
      });
    return userCreated;
  }
  async findOne(id: number) {
    const [user] = await this.db
      .select({
        email: users.email,
        username: users.username,
        id: users.id,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
  async findByUsername(username: string) {
    const [user] = await this.db
      .select({
        email: users.email,
        username: users.username,
        id: users.id,
        profilePicture: users.profilePicture,
        password: users.password,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
