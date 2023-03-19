import { Router } from "./router/router.ts";
import { ResponseService } from './response/response.service.ts';


export class AppController{


  constructor(
    private readonly router: Router,
    private readonly responseService: ResponseService,
  ){

    router.get( '/assets/**', function( req: Request ) {
      return responseService.readFileStatic( req )
    } )


    router.get( '/static/**', function( req: Request ) {
      return responseService.readFileStatic( req )
    } )


    router.get( '/favicon.svg', function() {
      return responseService.readFile( './client/favicon.svg' )
    } )



  }


}