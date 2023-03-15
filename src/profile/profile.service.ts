import { CookieService } from '../cookie/cookie.service.ts';
import { MySQLServiceUser } from '../mysql/mysql.service.user.ts';



export class ProfileService{


  constructor(
    private readonly cookieService: CookieService,
    private readonly mySQLServiceUser: MySQLServiceUser
  ){}


  async getAllUsers(): Promise< Response > {

    const users = await this.mySQLServiceUser.getAllUsers()
    if ( users === null ) return new Response( undefined, { status: 404 } ) 

    const responseData: any[] = []

    users.forEach ( item => {

      responseData.push({
        username: item.username,
        image: item.image
      })

    })

    const responseDataJson = JSON.stringify( responseData )
    return new Response( responseDataJson, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    } )

  }


  async get( req: Request ): Promise< Response >{

    const token = this.cookieService.get( req, 'token' )
    if ( token === null ) return new Response( undefined, { status: 400 } )

    const user = await this.mySQLServiceUser.getUserByToken( token )
    if ( user === null ) return new Response( undefined, { 
      status: 400, 
      headers: {
        'Set-cookie': 'token=-1; max-age=-1'
      } 
    }) 

    const responseJson = JSON.stringify({
      id: user.id,
      username: user.username,
      image: user.image
    })

    return new Response( responseJson, {
      status: 200
    }) 

  }


  async isVerifiedUser( req: Request ){

    const token = this.cookieService.get( req, 'token' )
    if ( token === null ) return false

    const user = await this.mySQLServiceUser.getUserByToken( token )
    if ( user === null ) return false

    return true

  }


}


