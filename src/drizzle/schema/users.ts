import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pseudo: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture").notNull(),
  ...timestamps,
});
