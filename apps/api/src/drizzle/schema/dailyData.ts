import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";
import { users } from "./users";

export const dailyData = pgTable("daily_data", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid().toLowerCase()),
  userId: varchar("user_id", { length: 26 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date().notNull(),
  timeSpent: integer("time_spent").notNull(),
  ...timestamps,
});

export type DailyData = InferSelectModel<typeof dailyData>;
