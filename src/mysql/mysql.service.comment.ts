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


  async setComment( req: Request ): Promise< Response > {

    const data: {
      soundID: number | undefined,
      status: number | undefined,
      comment: string | undefined
    } = await req.json()

    if ( data.soundID === undefined ) return new Response( 'id soundtrack - undefined', { status: 400 } )
    if ( data.soundID === 0 ) return new Response( 'This soundtrack does not exist', { status: 400 } )

    if ( data.status === undefined ) return new Response( 'status of comment - undefined', { status: 400 } )

    const token = this.cookieService.get( req, 'token' )
    if ( token === null ) return new Response( null, { status: 403 } )

    const user = await this.serviceUser.getUserByToken( token )
    if ( user === null ) return new Response( null, { status: 403 } )
    const userID = user.id

    if ( data.comment === undefined ) return this.removeTextOfComment( data.soundID, userID )

    data.comment = data.comment.substring( 0, 100 )
    data.comment = data.comment.split(`'`).join('`')

    if ( data.status !== 1 && data.status !== 2 && data.status !== 3 && data.status !== 10 ) data.status = 0

    const comments = await this.client.execute( `SELECT * FROM comments WHERE soundID=${ data.soundID } AND userID=${ userID };` )

    if ( comments.rows === undefined || comments.rows.length === 0 ) {

      await this.addComment( data.soundID, userID, data.status, data.comment  )

    } else {

      await this.client.execute( `UPDATE comments SET comment='${ data.comment }' WHERE soundID=${ data.soundID } AND userID=${ userID };` )

      if ( comments.rows[0].status !== 10 ) await this.client.execute( `UPDATE comments SET status='${ data.status }' WHERE soundID=${ data.soundID } AND userID=${ userID };` )

    } 

    return new Response( null, { status: 200 } )

  }


  async addComment( soundID: number, userID: number, status = 10, comment = '' ){

    await this.client.execute( `INSERT INTO comments ( soundID, userID, status, comment ) 
      VALUES ( ${ soundID }, ${ userID }, ${ status }, '${ comment }' )` )

  }


  async getCommentByRequest( req: Request ): Promise< Response >{

    const soundID = Number( await req.text() )

    const comments = await this.getCommentsBySoundID( soundID )
    if ( comments === null ) return new Response( null, {
      status: 404
    } )

    const commentsJson = JSON.stringify( comments )
    return new Response( commentsJson, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    } )

  }


  async getCommentsBySoundID( soundID: number ): Promise< commentDTO[] | null > {

    const result = await this.client.execute( `SELECT * FROM comments WHERE soundID=${ soundID };` )

    const comments: commentDTO[] | undefined = result.rows
    if ( comments === undefined ) return null

    return comments

  }


  private async removeTextOfComment( soundID: number, userID: number ){

    await this.client.execute( `UPDATE comments SET comment="" WHERE soundID=` + soundID + ` AND userID=` + userID + ``  )
    return new Response( 'text removed', { status: 200 } )

  }


}