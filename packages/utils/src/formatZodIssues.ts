import { ZodError, ZodIssue } from "zod";

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join(".");

  return `${pathString}: ${message}`;
};

export const formatZodError = (error: ZodError) => {
  const { issues } = error;

  if (issues.length === 0) {
    return "No validation issues";
  }

  return issues.map(formatZodIssue).join("; ");
};
