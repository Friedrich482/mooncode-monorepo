import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { dailyData } from "./dailyData";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";

export const languages = pgTable("languages", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  dailyDataId: text("daily_time_id")
    .notNull()
    .references(() => dailyData.id, { onDelete: "cascade" }),
  languageName: text("language_name").notNull(),
  timeSpent: integer("time_spent").notNull().default(0),
  ...timestamps,
});

export type Language = InferSelectModel<typeof languages>;
