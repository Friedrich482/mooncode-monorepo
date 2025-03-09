import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Input, Query, Router } from "nestjs-trpc";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { z } from "zod";

const getUserByIdSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  profilePicture: z.string(),
});

@Router({ alias: "users" })
@Controller("users")
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Query({ input: z.object({ id: z.string() }), output: getUserByIdSchema })
  @UseGuards(AuthGuard)
  @Get(":id")
  findOne(@Param("id") @Input("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Get("by-username/:username")
  findByUsername(@Param("username") username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
