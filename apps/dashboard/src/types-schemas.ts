import { PERIODS } from "./constants";
import { z } from "zod";

export const PeriodSchema = z.enum([...PERIODS]);
export type Period = z.infer<typeof PeriodSchema>;

export const IsoDateSchema = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    "Date must be in YYYY-MM-DD format",
  )
  .refine(
    (dateStr) => {
      const date = new Date(dateStr);
      const [year, month, day] = dateStr.split("-").map(Number);

      return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
      );
    },
    { message: "Invalid date" },
  )
  .transform((dateStr) => new Date(dateStr));

export const ProjectParamsSchema = z.object({
  projectName: z.string().min(1),
});

export type TreeNode = {
  type: "node";
  value: number;
  name: string;
  children: Tree[];
  key: string;
};
export type TreeLeaf = {
  type: "leaf";
  name: string;
  key: string;
  value: number;
};

export type Tree = TreeNode | TreeLeaf;

export type Bubble = Omit<d3.HierarchyCircularNode<Tree>, "constructor"> & {
  vx: number;
  vy: number;
};

// eslint-disable-next-line no-unused-vars
type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (
  // eslint-disable-next-line no-unused-vars
  ...a: infer X
) => void
  ? X
  : never;
type GrowToSize<T, A extends Array<T>, N extends number> = {
  0: A;
  1: GrowToSize<T, Grow<T, A>, N>;
}[A["length"] extends N ? 0 : 1];

export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;

export type Entry = {
  languageName: string;
  color: string;
  languageSlug: string;
};
