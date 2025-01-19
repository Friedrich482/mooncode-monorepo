import { Test, TestingModule } from '@nestjs/testing';
import { CodingDataController } from './coding-data.controller';
import { CodingDataService } from './coding-data.service';

describe('CodingDataController', () => {
  let controller: CodingDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodingDataController],
      providers: [CodingDataService],
    }).compile();

    controller = module.get<CodingDataController>(CodingDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
