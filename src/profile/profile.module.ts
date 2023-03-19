import { MySQLModule } from "../mysql/mysql.module.ts";
import { ProfileController } from "./profile.controller.ts";
import { ProfileService } from "./profile.service.ts";
import { CookieModule } from '../cookie/cookie.module.ts';
import { Router } from "../router/router.ts";


export class ProfileModule{


  service: ProfileService
  controller: ProfileController


  constructor(
    private readonly router: Router,
    private readonly cookieModule: CookieModule,
    private readonly mySQLModule: MySQLModule,
  ){

    this.service = new ProfileService( this.cookieModule.service, this.mySQLModule.serviceUser )
    this.controller = new ProfileController( this.router, this.service )

  }



}