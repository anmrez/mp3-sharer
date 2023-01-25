import { MailerService } from "./mailer.service.ts";



export class MailerModule{


  service: MailerService


  constructor(){

    this.service = new MailerService()

  }

}