import { MySQLServiceUser } from '../mysql/mysql.service.user.ts';



export class SecureService{


  constructor(
    private readonly mySQLServiceUser: MySQLServiceUser
  ){}


  async isAuth( req: Request ): Promise< boolean > {

    if ( this.isWhiteList( req ) ) return true

    const user = await this.mySQLServiceUser.getUser( req )

    if ( user === null ) return false
    return true

  }


  private isWhiteList( req: Request ){

    const path = new URL( req.url ).pathname
    const method = req.method
    const key = path + ' | ' + method

    if ( key === '/login/ | GET' ) return true
    if ( key === '/login | POST' ) return true
    if ( key === '/favicon.svg | GET' ) return true
    
    return false

  }


}