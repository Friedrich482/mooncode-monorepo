import { BaseExceptionFilter } from "@nestjs/core";
import { Catch } from "@nestjs/common";

@Catch()
export class TrpcExceptionFilter extends BaseExceptionFilter {
  catch(e: any) {
    console.error("TRPC error", e.message);
    // super.catch(exception, host);
  }
}
