import { MySQLService } from '../mysql/mysql.service.ts';



export class ProfileService{


  constructor(
    private readonly mySQLService: MySQLService
  ){}


  async get( req: Request, res: any ){

    const token = this.getToken( req )
    if ( token === null ) return res( new Response( undefined, { status: 400 } ) )

    const user = await this.mySQLService.getUserByToken( token )
    if ( user === null ) return res( 
      new Response( undefined, { 
        status: 400, 
        headers: {
          'Set-cookie': 'token=-1; max-age=-1'
        } 
      }) 
    )

    const responseJson = JSON.stringify({
      username: user.username,
      image: user.image
    })

    res( 
      new Response( responseJson, {
        status: 200
      }) 
    )

  }


  isVerifiedUser( req: Request ){

    const token = this.getToken( req )
    if ( token === null ) return false

    return true

  }



  // PRIVATE === ===

  private getToken( req: Request ) {

    const cookie = req.headers.get( 'cookie' )
    if ( cookie === null ) return null

    const token = 'token'

    let matches = cookie.match(new RegExp(
      "(?:^|; )" + token.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent( matches[1] ) : null;

  }


}


