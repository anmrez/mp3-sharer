import { HomeService } from './home.service.ts';
import { Router } from "../router/router.ts";



export class HomeController{


  constructor( 
    private readonly router: Router,
    private readonly homeService: HomeService,
  ){

    this.router.get( '/', function( req: Request ){
      return homeService.gethomepage( req )
    })

  }

}