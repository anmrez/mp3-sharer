import { AuthService } from "./auth.service.ts";


export class AuthController{


  constructor(
    private readonly authService: AuthService
  ){}



  sendEmail( req: Request ): Promise< Response > {

    return this.authService.sendEmail( req )
    
  }

  
  login( req: Request ): Promise< Response | "404" > {

    return this.authService.login( req )

  }
  

  getAllUsersInConsole(){

    this.authService.getAllUsersInConsole()

  }


}