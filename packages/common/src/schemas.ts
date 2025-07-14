import z from "zod";

export const JWTDto = z.object({
  sub: z.string().ulid(),
  iat: z.number().int(),
  exp: z.number().int(),
});

export const SignInUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  callbackUrl: z.string().nullable(),
});

export const RegisterUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  callbackUrl: z.string().nullable(),
});

export const loginResponseSchema = z.object({
  result: z.object({
    data: z.object({
      json: z.object({
        access_token: z.string().jwt(),
      }),
    }),
  }),
});

export const dateStringDto = z.string().refine(
  (value) => {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!dateRegex.test(value)) return false;

    const [, month = "", day = "", year = ""] = dateRegex.exec(value) || [];
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    // Check if the date is valid using Date object
    const date = new Date(yearNum, monthNum - 1, dayNum);
    const isValidDate =
      date.getFullYear() === yearNum &&
      date.getMonth() === monthNum - 1 &&
      date.getDate() === dayNum;

    return (
      monthNum >= 1 &&
      monthNum <= 12 &&
      dayNum >= 1 &&
      yearNum >= 1900 &&
      yearNum <= 2100 &&
      isValidDate
    );
  },
  { message: "String must be a valid date in MM/DD/YYYY format" },
);
