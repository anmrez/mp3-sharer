import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { commentDTO } from "./dto/comment.dto.ts";
import { MySQLServiceUser } from "./mysql.service.user.ts";
import { CookieService } from '../cookie/cookie.service.ts';


export class MySQLServiceComment{

  private client: Client
  private serviceUser: MySQLServiceUser
  private cookieService: CookieService

  constructor(
    client: Client,
    serviceUser: MySQLServiceUser,
    cookieService: CookieService
  ){

    this.client = client
    this.serviceUser = serviceUser
    this.cookieService = cookieService

    this.createCommentTable()

  }


  private async createCommentTable(){

    const showTables = await this.client.execute( `SHOW TABLES LIKE 'comments';` )

    if ( showTables.rows?.length === 0 )
    await this.client.execute( `CREATE TABLE comments (
      soundID INT NOT NULL,
      userID tinyint NOT NULL,
      status tinyint DEFAULT 0,
      comment varchar(100)
    );` )

  }


  async addComment( req: Request, soundID: number, status: number, comment: string ){

    if ( status !== 1 && status !== 2 && status !== 3 && status !== 10 ) status = 0

    // const token = this.getToken( req )
    const token = this.cookieService.get( req, 'token' )
    if ( token === null ) throw 'Token undefined'

    const user = await this.serviceUser.getUserByToken( token )
    if ( user === null ) throw 'User not found'
    const userID = user.id

    const data = await this.client.execute( `SELECT * FROM comments 
    WHERE soundID=${ soundID } AND userID=${ userID };` )

    if ( data.rows === undefined || data.rows.length === 0 ) {

      await this.client.execute( `INSERT INTO comments ( soundID, userID, status, comment ) 
      VALUES ( ${ soundID }, ${userID}, ${ status }, '${ comment }' )` )

    } else {

      await this.client.execute( `UPDATE comments SET comment='${ comment }' WHERE soundID=${ soundID } AND userID=${ userID };` )

      if ( data.rows[0].status !== 10 ) await this.client.execute( `UPDATE comments SET status='${ status }' WHERE soundID=${ soundID } AND userID=${ userID };` )

    } 

  }


  async getCommentsBySoundID( soundID: number ): Promise< commentDTO[] | null >{

    const result = await this.client.execute( `SELECT * FROM comments WHERE soundID=${ soundID };` )

    if ( result.rows === undefined ) return null
    return result.rows 

  }


}