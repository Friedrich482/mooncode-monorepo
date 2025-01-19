import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CodingDataService } from "./coding-data.service";
import { CreateCodingDatumDto } from "./dto/create-coding-data.dto";
import { UpdateCodingDatumDto } from "./dto/update-coding-data.dto";

@Controller("coding-data")
export class CodingDataController {
  constructor(private readonly codingDataService: CodingDataService) {}

  @Post("/users/user")
  create(@Body() createCodingDatumDto: CreateCodingDatumDto) {
    return this.codingDataService.create(createCodingDatumDto);
  }

  @Get()
  findAll() {
    return this.codingDataService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.codingDataService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCodingDatumDto: UpdateCodingDatumDto,
  ) {
    return this.codingDataService.update(+id, updateCodingDatumDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.codingDataService.remove(+id);
  }
}
