import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { dailyData } from "./dailyData";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";

export const languages = pgTable("languages", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid().toLowerCase()),
  dailyDataId: varchar("daily_time_id", { length: 26 })
    .notNull()
    .references(() => dailyData.id, { onDelete: "cascade" }),
  languageName: text("language_name").notNull(),
  timeSpent: integer("time_spent").notNull().default(0),
  ...timestamps,
});

export type Language = InferSelectModel<typeof languages>;
