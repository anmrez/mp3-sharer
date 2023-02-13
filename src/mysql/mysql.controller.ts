import { MySQLService } from './mysql.service.ts';


export class MySQLController{


  constructor(
    private readonly mySQLService: MySQLService
  ){}


  async getUser( req: Request ){
    
    const token = this.getToken( req )
    if ( token === null ) return null
    
    const user = await this.mySQLService.getUserByToken( token )
    if ( user === null ) return null

    return user

  }


  async getAllSounds(): Promise< Response > {

    const sounds = await this.mySQLService.getAllSounds()
    if ( sounds === null ) return new Response( null, {
      status: 404
    } ) 

    const jsonData = JSON.stringify( sounds )

    return new Response( jsonData, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    } )

  }


  async getAllSoundsInArchive(): Promise< Response > {

    const sounds = await this.mySQLService.getAllSoundsInArchive()
    if ( sounds === null ) return new Response( null, {
      status: 404
    } ) 

    const jsonData = JSON.stringify( sounds )

    return new Response( jsonData, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    } )

  }


  async getComment( req: Request ): Promise< Response > {

    const soundID = Number( await req.text() )
    const data = await this.mySQLService.getCommentsBySoundID( soundID )

    const dataJson = JSON.stringify( data )
    return new Response( dataJson, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    } )

  }


  async addCommet( req: Request ): Promise< Response > {
    
    const data: {
      soundID: number,
      status: number,
      comment: string
    } = await req.json()

    data.comment = data.comment.substring( 0, 100 )

    try {
      

      if ( data.soundID !== 0 ) {

        await this.mySQLService.addComment( req, data.soundID, data.status, data.comment )
        return new Response( undefined, { status: 200 } )
        
      } else {
        
        return new Response( 'This soundtrack does not exist', { status: 404 } )

      }
      
      
    } catch ( err ) {

      const currentdate = new Date();
      const datetime = "Error: " 
        + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

      console.log( '\n' )
      console.log( datetime )
      console.log( err )
      console.log( '\n' )

      return new Response( 'Error when writing a comment to the database', { status: 500 } )


    }


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