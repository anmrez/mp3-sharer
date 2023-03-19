import { AuthService } from "./auth.service.ts";
import { Router } from '../router/router.ts';


export class AuthController{


  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ){

    router.get( '/login/', function( req: Request ) {
      return authService.login( req )
    } )
    
    
    router.post( '/login', function( req: Request ) {
      return authService.sendEmail( req )
    } )

  }


}