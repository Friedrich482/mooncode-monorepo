import { Inject, Injectable } from "@nestjs/common";
import { and, between, eq } from "drizzle-orm";
import { eachDayOfInterval, format } from "date-fns";
import { CreateDailyDataDto } from "./dto/create-daily-data.dto";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UpdateDailyDataDto } from "./dto/update-daily-data.dto";
import { dailyData } from "src/drizzle/schema/dailyData";

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

  async findOneDailyData(userId: string, date: string) {
    const [oneDailyData] = await this.db
      .select({ id: dailyData.id, timeSpent: dailyData.timeSpent })
      .from(dailyData)
      .where(and(eq(dailyData.userId, userId), eq(dailyData.date, date)));
    return oneDailyData;
  }
  async findRangeDailyData(userId: string, start: string, end: string) {
    const dbData = await this.db
      .select({
        id: dailyData.id,
        timeSpent: dailyData.timeSpent,
        date: dailyData.date,
      })
      .from(dailyData)
      .where(
        and(eq(dailyData.userId, userId), between(dailyData.date, start, end)),
      );

    const dateRange = eachDayOfInterval({
      start: new Date(start),
      end: new Date(end),
    });

    const dataByDate = dbData.reduce(
      (acc, data) => {
        acc[data.date] = data;
        return acc;
      },
      {} as Record<string, (typeof dbData)[0]>,
    );

    return dateRange.map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return (
        dataByDate[formattedDate] || {
          id: null,
          timeSpent: 0,
          date: formattedDate,
        }
      );
    });
  }

  async updateDailyData(updateDailyDataDto: UpdateDailyDataDto) {
    const { timeSpent, userId, date } = updateDailyDataDto;
    const [updatedDailyData] = await this.db
      .update(dailyData)
      .set({
        date: new Date().toISOString(),
        timeSpent,
      })
      .where(and(eq(dailyData.userId, userId), eq(dailyData.date, date)))
      .returning({
        timeSpent: dailyData.timeSpent,
        id: dailyData.id,
        date: dailyData.date,
      });
    return updatedDailyData;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyDatum`;
  }
}
