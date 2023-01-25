import { AuthService } from "./auth.service.ts";


export class AuthController{


  constructor(
    private readonly authService: AuthService
  ){}



  login( req: Request, res: any ){

    this.authService.login( req, res )
    
  }

  loginByToken( req: Request, res: any ){

    return this.authService.loginByToken( req, res )

  }
  

  getAllUsersInConsole(){

    this.authService.getAllUsersInConsole()

  }


}