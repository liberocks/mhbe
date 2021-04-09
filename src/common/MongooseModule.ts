import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

export default MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get("MONGO_CONNECTION_STRING"),
    connectionName: configService.get("SERVICE_NAME"),
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }),
});
