import { date, integer, pgTable, text } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";
import { users } from "./users";

export const dailyData = pgTable("daily_data", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date().notNull(),
  timeSpent: integer("time_spent").notNull(),
  ...timestamps,
});

export type DailyData = InferSelectModel<typeof dailyData>;
