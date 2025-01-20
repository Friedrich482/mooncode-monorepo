import { Inject, Injectable } from "@nestjs/common";
import { CreateDailyDataDto } from "./dto/create-daily-data.dto";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UpdateDailyDataDto } from "./dto/update-daily-data.dto";
import { dailyData } from "src/drizzle/schema/dailyData";
import { eq } from "drizzle-orm";

@Injectable()
export class DailyDataService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  async createDailyData(createDailyDataDto: CreateDailyDataDto) {
    const { timeSpent, userId } = createDailyDataDto;
    const [createdDailyData] = await this.db
      .insert(dailyData)
      .values({
        date: new Date().toISOString(),
        timeSpent: timeSpent,
        userId,
      })
      .returning({
        timeSpent: dailyData.timeSpent,
        date: dailyData.date,
        id: dailyData.id,
      });

    return createdDailyData;
  }

  findAll() {
    return `This action returns all dailyData`;
  }

  async findOneDailyData(userId: number) {
    const [oneDailyData] = await this.db
      .select({ timeSpent: dailyData.timeSpent, id: dailyData.id })
      .from(dailyData)
      .where(eq(dailyData.userId, userId));
    return oneDailyData;
  }

  async updateDailyData(
    userId: number,
    updateDailyDataDto: UpdateDailyDataDto,
  ) {
    const { timeSpent } = updateDailyDataDto;
    const [updatedDailyData] = await this.db
      .update(dailyData)
      .set({
        timeSpent,
      })
      .where(eq(dailyData.userId, userId))
      .returning({
        timeSpent: dailyData.timeSpent,
        id: dailyData.id,
      });
    return updatedDailyData;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyDatum`;
  }
}
