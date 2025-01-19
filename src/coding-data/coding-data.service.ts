import { Injectable } from "@nestjs/common";
import { CreateCodingDatumDto } from "./dto/create-coding-data.dto";
import { UpdateCodingDatumDto } from "./dto/update-coding-data.dto";

@Injectable()
export class CodingDataService {
  create(createCodingDatumDto: CreateCodingDatumDto) {
    return "This action adds a new codingDatum";
  }

  findAll() {
    return `This action returns all codingData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codingDatum`;
  }

  update(id: number, updateCodingDatumDto: UpdateCodingDatumDto) {
    return `This action updates a #${id} codingDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} codingDatum`;
  }
}
