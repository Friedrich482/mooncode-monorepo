import * as bcrypt from "bcrypt";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDtoType, UpdateUserDtoType } from "./users.dto";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { users } from "src/drizzle/schema/users";

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  async create(createUserDto: CreateUserDtoType) {
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
  async findOne({ id }: { id: string }) {
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

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    return user;
  }

  async update(updateUserDto: UpdateUserDtoType) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException("You need to specify at least one field");
    }
    const { id } = updateUserDto;
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    if (!user) throw new NotFoundException("User not found");

    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        this.saltRounds,
      );
    }

    return await this.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        username: users.username,
        email: users.email,
        profilePicture: users.profilePicture,
      });
  }
}
