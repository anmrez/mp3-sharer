import { MySQLService } from "./mysql.service.ts";
import { MySQLController } from './mysql.controller.ts';
import { MySQLServiceSoundtrack } from "./mysql.service.soundtrack.ts";
import { MySQLServiceUser } from "./mysql.service.user.ts";
import { MySQLServiceComment } from "./mysql.service.comment.ts";
import { CookieModule } from "../cookie/cookie.module.ts";




export class MySQLModule{

  constroller: MySQLController
  service: MySQLService
  serviceSoundtrack: MySQLServiceSoundtrack
  serviceUser: MySQLServiceUser
  serviceComment: MySQLServiceComment


  constructor(
    cookieModule: CookieModule
  ){

    this.service = new MySQLService()
    
    this.serviceSoundtrack = new MySQLServiceSoundtrack( this.service.client )
    this.serviceUser = new MySQLServiceUser( this.service.client )
    this.serviceComment = new MySQLServiceComment( this.service.client, this.serviceUser, cookieModule.service )

    this.constroller = new MySQLController( 
      cookieModule.service, 
      this.serviceUser, 
      this.serviceSoundtrack, 
      this.serviceComment 
    )
    
  }

}