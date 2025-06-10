import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { dailyData } from "./dailyData";
import { languages } from "./languages";
import { projects } from "./projects";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";

export const files = pgTable("files", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid().toLowerCase()),
  projectId: varchar("project_id", { length: 26 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  dailyDataId: varchar("daily_time_id", { length: 26 })
    .notNull()
    .references(() => dailyData.id, { onDelete: "cascade" }),
  languageId: varchar("language_id", { length: 26 })
    .notNull()
    .references(() => languages.id, { onDelete: "cascade" }),

  fileName: text("file_name").notNull(),
  path: text("path").notNull(),
  timeSpent: integer("time_spent").notNull().default(0),
  ...timestamps,
});

export type File = InferSelectModel<typeof files>;
