import { MailerService } from "../mailer/mailer.service.ts";
import { GeneratorService } from "../generator/generator.service.ts";
import { MySQLServiceUser } from '../mysql/mysql.service.user.ts';
import { ResponseService } from '../response/response.service.ts';


interface ITokenMap_key{
  username: string
  dateCreate: number
}

type Token = string


export class AuthService{


  private tokenMap = new Map<Token, ITokenMap_key>()


  constructor(
    private readonly mySQLServiceUser: MySQLServiceUser,
    private readonly mailerService: MailerService,
    private readonly generatorService: GeneratorService,
    private readonly responseService: ResponseService
  ){

    setInterval( this.clearOldTokens.bind( this ), 30_000 )

  }


  async sendEmail( req: Request ): Promise< Response > {

    const body: { username: string | undefined } = await req.json()

    if ( typeof body.username !== 'string' ) return this.responseService.response( 'Username is invalid', 404 )
    const username = body.username

    // ищем пользователя в БД
    const user = await this.mySQLServiceUser.getUserByName( username )
    if ( user === null ) return this.responseService.response( 'User not found!', 404 )

    // генерируем токен и сохраняем его 
    const urlToken = this.generatorService.urlToken()
    const isSave = this.isSaveUrlToken( user.username, urlToken )

    // Если письмо уже отправленно, то оповещаем пользователя
    if ( isSave === false ) return this.responseService.response( 'The email has already been sent!', 400 )

    // Отправляем пользователю на почту ссылку для входа
    this.mailerService.send( user.email, urlToken )
    return this.responseService.response( null, 200 )
    
  }


  async login( req: Request ): Promise< Response > {

    // get token from url
    const urlToken = new URL( req.url ).searchParams.get( 'token' )
    if ( urlToken === null ) return this.responseService.redirect( '/' )

    // get data
    const dataToken = this.tokenMap.get( urlToken )
    if ( dataToken === undefined ) return this.responseService.redirect( '/' )

    // Сгенерировать токен, записаеть его в БД
    const token = this.generatorService.token()
    await this.mySQLServiceUser.setToken( dataToken.username, token )

    // token lifetime
    let maxAge = 999_999_999
    if ( dataToken.username === 'Guest' ) maxAge = 600

    // delete token from map
    this.tokenMap.delete( urlToken )

    // redirect
    const headers = new Headers()
    headers.set( 'Set-cookie', 'token=' + token + '; simesite=strict; Path=/; HttpOnly; max-age=' + maxAge )
    return this.responseService.redirect( '/', headers )

  }

  
  // PRIVATE === ===
  private isSaveUrlToken( username: string, token: string ): boolean {

    if ( this.isExistUrlToken( username ) ) return false

    this.tokenMap.set( token, {
      username: username,
      dateCreate: new Date().getTime()
    } )

    return true

  }


  private isExistUrlToken( username: string ): boolean {

    const iterator = this.tokenMap.values()

    let index = 0
    while ( index !== this.tokenMap.size ){

      const item = iterator.next().value
      if ( item.username === username ) return true

      index++

    }

    return false

  }


  private clearOldTokens (): void {

    const iterator = this.tokenMap.entries()
    const arrTokenDelete: string[] = []

    let index = 0
    while ( index !== this.tokenMap.size ) {

      const item: [ string, ITokenMap_key ] = iterator.next().value
      const key = item[0]
      const data = item[1]
      if ( this.isUrlTokenOutdated( data.dateCreate ) ) arrTokenDelete.push( key ) 
      
      index++
      
    }

    arrTokenDelete.forEach( key => {
      this.tokenMap.delete( key )
    } )

  }


  private isUrlTokenOutdated( dateCreateToken: number ): boolean {

    const nowDate = new Date().getTime()
    const fiveMinute = 300_000

    return nowDate > dateCreateToken + fiveMinute

  }


}