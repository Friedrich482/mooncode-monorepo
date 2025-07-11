import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { languages } from "./languages";
import { projects } from "./projects";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";

export const files = pgTable(
  "files",
  {
    id: varchar("id", { length: 26 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => ulid().toLowerCase()),
    projectId: varchar("project_id", { length: 26 })
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    languageId: varchar("language_id", { length: 26 })
      .notNull()
      .references(() => languages.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    path: text("path").notNull(),
    timeSpent: integer("time_spent").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    projectIdIdx: index("project_id_index").on(table.projectId),
    languageIdIdx: index("language_id_index").on(table.languageId),
    nameIdx: index("file_name_index").on(table.name),
    path: index("file_path_index").on(table.path),
  }),
);
