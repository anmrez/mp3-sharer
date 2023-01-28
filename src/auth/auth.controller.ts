import { AuthService } from "./auth.service.ts";


export class AuthController{


  constructor(
    private readonly authService: AuthService
  ){}



  sendEmail( req: Request, res: any ){

    this.authService.sendEmail( req, res )
    
  }

  
  login( req: Request, res: any ){

    return this.authService.login( req, res )

  }
  

  getAllUsersInConsole(){

    this.authService.getAllUsersInConsole()

  }


}