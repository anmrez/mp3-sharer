import { ConfigModule } from "../config/config.module.ts";
import { LoggerService } from "./logger.service.ts";



export class LoggerModule{


  public readonly service: LoggerService

  
  constructor(
    private readonly config: ConfigModule
  ){

    this.service = new LoggerService( this.config )

  }

}