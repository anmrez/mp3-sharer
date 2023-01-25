import { MailerModule } from "../mailer/mailer.module.ts";
import { UserDBModule } from "../userdb/userdb.module.ts";
import { AuthController } from "./auth.controller.ts";
import { AuthService } from "./auth.service.ts";




export class AuthNodule{

  service: AuthService
  controller: AuthController

  constructor(
    private readonly userDBModule: UserDBModule,
    private readonly mailerModule: MailerModule
  ){
    this.service = new AuthService( this.userDBModule.service, this.mailerModule.service )
    this.controller = new AuthController( this.service )
  }


}