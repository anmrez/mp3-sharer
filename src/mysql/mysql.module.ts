import { MySQLService } from "./mysql.service.ts";
import { MySQLController } from './mysql.controller.ts';
import { MySQLServiceSoundtrack } from "./mysql.service.soundtrack.ts";
import { MySQLServiceUser } from "./mysql.service.user.ts";
import { MySQLServiceComment } from "./mysql.service.comment.ts";
import { CookieModule } from "../cookie/cookie.module.ts";
import { Router } from "../router/router.ts";
import { ConfigModule } from '../config/config.module.ts';
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";



export class MySQLModule{

  static isInited = false
  public readonly constroller: MySQLController
  public readonly service: MySQLService
  public readonly serviceSoundtrack: MySQLServiceSoundtrack
  public readonly serviceUser: MySQLServiceUser
  public readonly serviceComment: MySQLServiceComment


  constructor(
    private readonly roter: Router,
    private readonly mysqlClient: Client,
    private readonly cookieModule: CookieModule,
    private readonly config: ConfigModule
  ){

    if ( MySQLModule.isInited ) throw new Error( '[MySQLModule] - Экземпляр класса уже существует' )
    MySQLModule.isInited = true

    this.service = new MySQLService( this.mysqlClient )
    this.serviceUser = new MySQLServiceUser( this.mysqlClient, cookieModule.service, config )
    this.serviceComment = new MySQLServiceComment( this.mysqlClient, this.serviceUser, cookieModule.service )
    this.serviceSoundtrack = new MySQLServiceSoundtrack( this.mysqlClient, this.serviceUser, this.serviceComment )
    this.constroller = new MySQLController( roter, this.serviceSoundtrack, this.serviceComment )
    
  }

}