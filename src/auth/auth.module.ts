import { MailerModule } from "../mailer/mailer.module.ts";
import { AuthController } from "./auth.controller.ts";
import { AuthService } from "./auth.service.ts";
import { GeneratorModule } from '../generator/generator.module.ts';
import { MySQLModule } from "../mysql/mysql.module.ts";
import { Router } from '../router/router.ts';
import { ResponseModule } from '../response/response.module.ts';




export class AuthNodule{

  service: AuthService
  controller: AuthController

  constructor(
    private readonly router: Router,
    private readonly mysqlModule: MySQLModule,
    private readonly mailerModule: MailerModule,
    private readonly generatorModule: GeneratorModule,
    private readonly responseModule: ResponseModule,
  ){
    
    this.service = new AuthService( 
      this.mysqlModule.serviceUser, 
      this.mailerModule.service, 
      this.generatorModule.service,
      this.responseModule.service
    )

    this.controller = new AuthController( router, this.service )

  }


}