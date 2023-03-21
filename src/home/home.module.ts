import { HomeController } from "./home.controller.ts";
import { HomeService } from "./home.service.ts";
import { Router } from '../router/router.ts';
import { ResponseModule } from '../response/response.module.ts';
import { MySQLModule } from '../mysql/mysql.module.ts';



export class HomeModule{

  public service: HomeService
  public contoller: HomeController

  constructor(
    private readonly router: Router,
    private readonly responseModule: ResponseModule,
    private readonly mySQLModule: MySQLModule
  ){

    this.service = new HomeService( this.responseModule.service, this.mySQLModule.serviceSoundtrack )
    this.contoller = new HomeController( this.router, this.service, )

  }


}