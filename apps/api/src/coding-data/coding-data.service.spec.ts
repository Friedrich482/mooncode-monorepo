import { Test, TestingModule } from "@nestjs/testing";
import { CodingDataService } from "./coding-data.service";

describe("CodingDataService", () => {
  let service: CodingDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingDataService],
    }).compile();

    service = module.get<CodingDataService>(CodingDataService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
