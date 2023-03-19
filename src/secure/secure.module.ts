import { SecureService } from "./secure.service.ts";
import { Router } from '../router/router.ts';
import { MySQLModule } from '../mysql/mysql.module.ts';
import { ResponseModule } from '../response/response.module.ts';


export class SecureModule{

  private service: SecureService



  constructor(
    private readonly router: Router,
    private readonly MySQLModule: MySQLModule,
    private readonly responseModule: ResponseModule
  ){

    this.service = new SecureService( MySQLModule.serviceUser )

  }


  async use( req: Request ): Promise< Response > {

    if ( await this.service.isAuth( req ) ) return this.router.use( req )

    return this.responseModule.service.readFile( './client/Login.html', 403 )

  }



}