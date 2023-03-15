import { MailerModule } from "../mailer/mailer.module.ts";
import { AuthController } from "./auth.controller.ts";
import { AuthService } from "./auth.service.ts";
import { GeneratorModule } from '../generator/generator.module.ts';
import { MySQLModule } from "../mysql/mysql.module.ts";




export class AuthNodule{

  service: AuthService
  controller: AuthController

  constructor(
    private readonly mysqlModule: MySQLModule,
    private readonly mailerModule: MailerModule,
    private readonly generatorModule: GeneratorModule
  ){
    
    this.service = new AuthService( 
      this.mysqlModule.serviceUser, 
      this.mailerModule.service, 
      this.generatorModule.service 
    )

    this.controller = new AuthController( this.service )
  }


}