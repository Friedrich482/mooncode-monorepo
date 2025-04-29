import z from "zod";

export const JWTDto = z.object({
  sub: z.string().ulid(),
  iat: z.number().int(),
  exp: z.number().int(),
});

export const SignInUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const RegisterUserDto = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export type SignInUserDtoType = z.infer<typeof SignInUserDto>;

export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;

export const loginResponseSchema = z.object({
  result: z.object({
    data: z.object({
      json: z.object({
        access_token: z.string().jwt(),
      }),
    }),
  }),
});
