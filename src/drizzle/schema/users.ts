import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { dailyData } from "./dailyData";
import { relations } from "drizzle-orm";
import { timestamps } from "../columns.helpers";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pseudo: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture").notNull(),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  dailyData: many(dailyData),
}));
