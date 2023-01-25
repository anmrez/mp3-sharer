import { MailerService } from "../mailer/mailer.service.ts";
import { UserDBServices } from "../userdb/userdb.services.ts";


interface IListTokens{
  token: string
  dateCreate: number
}


export class AuthService{


  listOfLoginTokens: IListTokens[] = []


  constructor(
    private readonly userDBService: UserDBServices,
    private readonly mailerService: MailerService
  ){}


  async login( req: Request, res: any ){

    const body: { username: string } = await req.json()
    const username = body.username

    const user = this.userDBService.getUser( username )
    if ( user === null ) {
      this.sendNotFound( res )
      return;
    }

    this.mailerService.send( user.email, 'token' )

    this.sendOK( res )
    
  }
  

  getAllUsersInConsole(){

    console.log( this.userDBService.getAll() )

  }



  // PRIVATE === ===

  private sendNotFound( res: any ){

    res( new Response( 'User not found!', {
      status: 404,
      headers: {
        'content-type': 'text/plain'
      }
    } ) )

  }


  private sendOK( res: any ){

    res( new Response( undefined, {
      status: 200
    } ) )

  }

}