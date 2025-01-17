import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { dailyData } from "./dailyData";
import { timestamps } from "../columns.helpers";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("name").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture").notNull(),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  dailyData: many(dailyData),
}));

export type User = InferSelectModel<typeof users>;
