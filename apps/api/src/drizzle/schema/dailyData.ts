import { date, index, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";
import { users } from "./users";

export const dailyData = pgTable(
  "daily_data",
  {
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
  },
  (table) => ({
    userIdIdx: index("daily_data_user_id_index").on(table.userId),
    dateIdx: index("daily_data_date_index").on(table.date),
  }),
);
