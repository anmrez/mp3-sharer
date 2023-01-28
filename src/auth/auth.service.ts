import { MailerService } from "../mailer/mailer.service.ts";
import { GeneratorService } from "../generator/generator.service.ts";
import { MySQLService } from '../mysql/mysql.service.ts';


interface IListTokens{
  username: string
  token: string
  dateCreate: number
}


export class AuthService{


  urlTokens: IListTokens[] = []


  constructor(
    private readonly mysqlService: MySQLService,
    private readonly mailerService: MailerService,
    private readonly generatorService: GeneratorService,
  ){}


  async sendEmail( req: Request, res: any ){

    const body: { username: string } = await req.json()
    const username = body.username

    // ищем пользователя в БД
    const user = await this.mysqlService.getUser( username )
    if ( user === null ) {
      this.sendNotFound( res )
      return;
    }

    // генерируем токен и сохраняем его 
    const urlToken = this.generatorService.urlToken()
    const save = this.saveUrlToken( user.username, urlToken )

    // Если письмо уже отправленно то оповещаем пользователя
    if ( save === false ) return this.alreadyBeenSent( res )

    // Отправляем пользователю на почту ссылку для входа
    this.mailerService.send( user.email, urlToken )
    this.sendOK( res )
    
  }


  async login( req: Request, res: any ){

    const urlToken = new URL( req.url ).searchParams.get( 'token' )
    if ( urlToken === null ) return '404';

    const username = this.findUrlToken( urlToken )
    if ( username === null ) return '404';

    // Сгенерировать токен, записаеть его в БД
    const token = this.generatorService.token()
    await this.mysqlService.setToken( username, token )

    res( new Response( undefined, {
      status: 301,
      headers: {
        'Set-cookie': 'token=' + token + '; simesite=strict; Path=/; HttpOnly; max-age=' + 999_999_999 ,
        'Location': '/'
      }
    } ) )

  }



  async getAllUsersInConsole(){

    console.log( await this.mysqlService.getAllUsers() )

  }

   
  
  // PRIVATE === ===

  private saveUrlToken( username: string, token: string ): boolean {

    if ( this.isExistUrlToken( username ) ) return false

    this.urlTokens.push({
      username: username,
      token: token,
      dateCreate: new Date().getTime()
    })

    return true

  }


  private findUrlToken( urlToken: string ): string | null {

    let index = 0

    while( this.urlTokens.length > index ){

      const item = this.urlTokens[index]
      if ( item.token === urlToken ) {

        if ( this.isUrlTokenNotOutdated( item.dateCreate ) ) return item.username

        this.urlTokens.splice( index, 1 )
        return null
        
      } 

      index++

    }

    return null

  }


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


  private alreadyBeenSent( res: any ){

    res( new Response( 'The email has already been sent!', {
      status: 400,
      headers: {
        'content-type': 'text/plain'
      }
    } ) )

  }


  private isExistUrlToken( username: string ): boolean {

    let index = 0

    while( this.urlTokens.length > index ){

      const item = this.urlTokens[index]
      if ( item.username === username ) {


        return true
      } 

      index++

    }

    return false

  }


  private isUrlTokenNotOutdated( dateCreateToken: number ): boolean {

    const nowDate = new Date().getTime()
    const fiveMinute = 300000

    if ( nowDate < dateCreateToken + fiveMinute ) return true
    
    return false

  }

}