import { ConfigService } from "@nestjs/config";
import { Env } from "src/env";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}
  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
