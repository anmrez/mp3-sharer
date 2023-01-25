import { AuthService } from "./auth.service.ts";


export class AuthController{


  constructor(
    private readonly authService: AuthService
  ){}



  login( req: Request, res: any ){

    this.authService.login( req, res )
    
  }
  
  
  registration( req: Request, res: any ){
    
    this.authService.registration( req, res )

  }


  getAllUsersInConsole(){

    this.authService.getAllUsersInConsole()

  }


}