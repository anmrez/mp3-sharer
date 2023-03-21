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

    // this.router.get( '/search/**', function( req: Request ){
    //   return homeService.searchHandler( req )
    // } )

    this.router.post( '/search', function( req: Request ){
      return homeService.searchHandler( req )
    } )

  }

}