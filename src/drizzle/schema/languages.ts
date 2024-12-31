import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const languages = pgTable("languages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  languageName: text("language_name").notNull(),
  timeSpent: integer().notNull().default(0),
  ...timestamps,
});
