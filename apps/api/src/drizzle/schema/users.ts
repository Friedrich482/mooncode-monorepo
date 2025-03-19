import { pgTable, text } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  username: text("name").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture").notNull(),
  ...timestamps,
});

export type User = InferSelectModel<typeof users>;
