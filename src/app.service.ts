import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  ruok(): Record<string, string | undefined | null> {
    return {
      buildVersion: process.env.BUILD_VERSION,
      environment: process.env.NODE_ENV,
      serviceName: process.env.SERVICE_NAME,
      message: `Welcome to ${process.env.SERVICE_NAME}!`,
    };
  }
}
