import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";
import { users } from "./users";

export const projects = pgTable("projects", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid().toLowerCase()),
  userId: varchar("user_id", { length: 26 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  projectName: text("project_name").notNull(),
  path: text("path").notNull(),
  ...timestamps,
});

export type Project = InferSelectModel<typeof projects>;
