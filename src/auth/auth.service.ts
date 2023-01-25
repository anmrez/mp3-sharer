import { MailerService } from "../mailer/mailer.service.ts";
import { UserDBServices } from "../userdb/userdb.services.ts";
import { GeneratorService } from "../generator/generator.service.ts";


export class AuthService{


  constructor(
    private readonly userDBService: UserDBServices,
    private readonly mailerService: MailerService,
    private readonly generatorService: GeneratorService,
  ){}


  async login( req: Request, res: any ){

    const body: { username: string } = await req.json()
    const username = body.username

    const user = this.userDBService.getUser( username )
    if ( user === null ) {
      this.sendNotFound( res )
      return;
    }

    const urlToken = this.generatorService.urlToken()
    this.userDBService.createLoginToken( username, urlToken )

    this.mailerService.send( user.email, urlToken )
    this.sendOK( res )
    
  }


  loginByToken( req: Request, res: any ){

    const urlToken = new URL( req.url ).searchParams.get( 'token' )
    if ( urlToken === null ) return '404';

    const token = this.userDBService.checkingUrlToken( urlToken )
    if ( token === null ) return '404';

    res( new Response( undefined, {
      status: 301,
      headers: {
        'Set-cookie': 'token=' + token + '; simesite=strict; Path=/; HttpOnly; max-age=' + 999_999_999 ,
        'Location': '/'
      }
    } ) )

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