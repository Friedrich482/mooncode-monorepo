import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
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

  findOne(@Body() dailyDataId: string, languageName: string) {
    return this.languagesService.findOneLanguage(dailyDataId, languageName);
  }

  update(@Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languagesService.updateLanguage(updateLanguageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.languagesService.remove(+id);
  }
}
