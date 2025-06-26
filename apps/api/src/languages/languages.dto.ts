import { z } from "zod";

export const CreateLanguageDto = z.object({
  dailyDataId: z.string().ulid(),
  timeSpent: z.number().int(),
  languageSlug: z.string().min(1),
});

export const UpdateLanguageDto = CreateLanguageDto;

export type CreateLanguageDtoType = z.infer<typeof CreateLanguageDto>;

export type UpdateLanguageDtoType = z.infer<typeof UpdateLanguageDto>;
