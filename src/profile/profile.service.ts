import { MySQLService } from '../mysql/mysql.service.ts';



export class ProfileService{


  constructor(
    private readonly mySQLService: MySQLService
  ){}


  async getAllUsers(): Promise< Response > {

    const users = await this.mySQLService.getAllUsers()
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

    const token = this.getToken( req )
    if ( token === null ) return new Response( undefined, { status: 400 } )

    const user = await this.mySQLService.getUserByToken( token )
    if ( user === null ) return new Response( undefined, { 
      status: 400, 
      headers: {
        'Set-cookie': 'token=-1; max-age=-1'
      } 
    }) 

    const responseJson = JSON.stringify({
      username: user.username,
      image: user.image
    })

    return new Response( responseJson, {
      status: 200
    }) 

  }


  async isVerifiedUser( req: Request ){

    const token = this.getToken( req )
    if ( token === null ) return false

    const user = await this.mySQLService.getUserByToken( token )
    if ( user === null ) return false

    return true

  }



  // PRIVATE === ===

  private getToken( req: Request ) {

    const cookie = req.headers.get( 'cookie' )
    if ( cookie === null ) return null

    const token = 'token'

    const matches = cookie.match(new RegExp(
      "(?:^|; )" + token.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent( matches[1] ) : null;

  }


}


