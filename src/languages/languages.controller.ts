import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { LanguagesService } from "./languages.service";
import { UpdateLanguageDto } from "./dto/update-language.dto";

@Controller("languages")
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.createLanguage(createLanguageDto);
  }

  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(":id")
  findOne(@Body() dailyDataId: number, languageName: string) {
    return this.languagesService.findOneLanguage(dailyDataId, languageName);
  }

  @Patch(":id")
  update(
    @Body() updateLanguageDto: UpdateLanguageDto,
    dailyDataId: number,
    languageName: string,
  ) {
    return this.languagesService.updateLanguage(
      dailyDataId,
      updateLanguageDto,
      languageName,
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.languagesService.remove(+id);
  }
}
