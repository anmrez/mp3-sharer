import { MailerService } from "./mailer.service.ts";
import { ConfigModule } from '../config/config.module.ts';



export class MailerModule{


  service: MailerService


  constructor(
    private readonly configModule: ConfigModule
  ){

    this.service = new MailerService( this.configModule )

  }

}