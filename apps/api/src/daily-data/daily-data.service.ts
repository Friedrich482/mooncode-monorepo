import {
  CreateDailyDataDtoType,
  UpdateDailyDataDtoType,
} from "./daily-data.dto";
import { Inject, Injectable } from "@nestjs/common";
import { and, between, eq } from "drizzle-orm";
import { eachDayOfInterval, format } from "date-fns";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { dailyData } from "src/drizzle/schema/dailyData";

@Injectable()
export class DailyDataService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase,
  ) {}
  async createDailyData(createDailyDataDto: CreateDailyDataDtoType) {
    const { timeSpent, userId } = createDailyDataDto;
    const [createdDailyData] = await this.db
      .insert(dailyData)
      .values({
        date: new Date().toLocaleString(),
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

  async findOneDailyData(userId: string, date: string) {
    const [oneDailyData] = await this.db
      .select({ id: dailyData.id, timeSpent: dailyData.timeSpent })
      .from(dailyData)
      .where(and(eq(dailyData.userId, userId), eq(dailyData.date, date)));

    if (!oneDailyData) {
      return;
    }
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

  async updateDailyData(updateDailyDataDto: UpdateDailyDataDtoType) {
    const { timeSpent, userId, date } = updateDailyDataDto;
    const [updatedDailyData] = await this.db
      .update(dailyData)
      .set({
        date: new Date().toLocaleString(),
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
}
