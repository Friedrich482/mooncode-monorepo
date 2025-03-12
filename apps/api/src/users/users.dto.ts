import { RegisterUserDto } from "src/auth/auth.dto";
import { z } from "zod";

export const UpdateProfileDto = RegisterUserDto.partial();

export const FindByIdDto = z.object({
  id: z.string().ulid(),
});

export const FindByUsernameDto = z.object({
  username: z.string(),
});

export const UpdateUserDto = z.object({
  id: z.string().ulid(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
});

export const DeleteUserDto = z.object({
  id: z.string().ulid(),
});

export type CreateUserDtoType = z.infer<typeof RegisterUserDto>;

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;
