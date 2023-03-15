import { MySQLModule } from "../mysql/mysql.module.ts";
import { ProfileController } from "./profile.controller.ts";
import { ProfileService } from "./profile.service.ts";
import { CookieModule } from '../cookie/cookie.module.ts';


export class ProfileModule{


  service: ProfileService
  controller: ProfileController


  constructor(
    private readonly cookieModule: CookieModule,
    private readonly mySQLModule: MySQLModule,
  ){

    this.service = new ProfileService( this.cookieModule.service, this.mySQLModule.serviceUser )
    this.controller = new ProfileController( this.service )

  }



}