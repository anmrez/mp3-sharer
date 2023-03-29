import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { MySQLServiceUser } from './mysql.service.user.ts';
import { MySQLServiceComment } from './mysql.service.comment.ts';
import { soundtrackDTO } from './dto/soundtrack.dto.ts';



export class MySQLServiceSoundtrack{

  client: Client

  constructor(
    client: Client,
    private readonly mySQLServiceUser: MySQLServiceUser,
    private readonly mySQLServiceComment: MySQLServiceComment
  ){

    this.client = client
    this.createSoundTable()

  }


  private async createSoundTable(  ){

    const showTables = await this.client.execute( `SHOW TABLES LIKE 'sounds';` )

    if ( showTables.rows?.length === 0 )

    await this.client.execute( `CREATE TABLE sounds (
      id INT PRIMARY KEY AUTO_INCREMENT,
      duration smallint,
      title varchar(60) NOT NULL,
      author varchar(60) NOT NULL,
      createdAt varchar(5) NOT NULL,
      is_archived boolean DEFAULT false,
      hash varchar(40)
    );` )

  }


  // GET --- ---
  async responseAllSounds(): Promise< Response > {

    const soundtracks = await this.getAllSounds()
    if ( soundtracks === null ) return new Response( null, {
      status: 404
    } ) 


    // const jsonData = JSON.stringify( sounds )
    // const jsonData = JSON.stringify( 1 )

    // return new Response( jsonData, {
    //   status: 200,
    //   headers: {
    //     'content-type': 'application/json'
    //   }
    // } )

    return new Response( this.intoBinary( soundtracks ) , {
      status: 200,
      headers: {
        'content-type': 'text/plain',
      }
    } )

    
  }


  async getAllSoundsInArchive(): Promise< Response > {
    
    const allSound = await this.client.execute( 'SELECT id, duration, title, author, createdAt FROM sounds WHERE is_archived = 1;' )
    const soundtracks = allSound.rows

    if ( soundtracks === undefined ) return new Response( null, {
      status: 404
    } )

    return new Response( this.intoBinary( soundtracks ) , {
      status: 200,
      headers: {
        'content-type': 'text/plain',
      }
    } )
    
  }


  async getAllSounds(): Promise< soundtrackDTO[] | null > {

    const allSound = await this.client.execute( 'SELECT id, duration, title, author, createdAt FROM sounds WHERE is_archived = 0;' )
    const sounds: soundtrackDTO[] | undefined = allSound.rows
    
    if ( sounds === undefined ) return null
    return sounds

  }

  // FIND --- ---
  async findByHash( hash: string ): Promise< soundtrackDTO | null > {

    const result = await this.client.execute( `SELECT * FROM sounds WHERE hash='` + hash + `';` )
    const sounds: soundtrackDTO[] | undefined = result.rows

    if ( sounds === undefined || sounds.length === 0 ) return null

    const sound = sounds[0]
    return sound

  }


  async findByTitleAndAuthor( title: string, author: string ): Promise< soundtrackDTO | null > {

    const result = await this.client.execute( `SELECT * FROM sounds 
    WHERE title='` + title + `' AND author='` + author + `'` )

    const sounds: soundtrackDTO[] | undefined = result.rows
    if ( sounds === undefined || sounds.length === 0 ) return null

    const sound = sounds[0]
    return sound

  }


  // async findByID( soundID: number ): Promise< soundtrackDTO[] | null > {

  //   const result = await this.client.execute( `SELECT id, title, author, is_archived FROM sounds 
  //   WHERE id LIKE '` + soundID + `%';` )

  //   const sounds: soundtrackDTO[] | undefined = result.rows

  //   if ( sounds === undefined ) return null
  //   return sounds

  // }


  async searchByTitleORAuthorORID( search: string ): Promise< soundtrackDTO[] | null > {

    const result = await this.client.execute( `SELECT id, title, author, is_archived FROM sounds 
    WHERE title LIKE '%` + search + `%' 
    OR author LIKE '%` + search + `%'
    OR id LIKE '%` + search + `%'
    ;` )

    const sounds: soundtrackDTO[] | undefined = result.rows

    if ( sounds === undefined ) return null
    return sounds

  }

  // REMOVE --- ---
  async removeSoundtrack( soundID: number ){

    await this.client.execute( `UPDATE sounds SET is_archived=true WHERE id=${ soundID }` )

  }


  // SET --- ---
  async setSound( title: string, author: string, duration: number, hash: string ){

    let day = String( new Date().getDate() )
    let month = String( new Date().getMonth() + 1 )

    if ( month.length === 1 ) month = '0' + month
    if ( day.length === 1 ) day = '0' + day
    
    const createdAt = month + '.' + day

    const result = await this.client.execute( `
    INSERT INTO sounds 
    ( duration, title, author, createdAt, hash ) 
    VALUES 
    ( '${ duration }', '${ title }', '${ author }', '${ createdAt }', '${ hash }' )
    `)

    if ( result.lastInsertId !== undefined ) return result.lastInsertId
    return null

  }


  // RENAME --- ---
  async renameSoundrack( req: Request ): Promise< Response > {

    const data: {
      id: number,
      title: string,
      author: string,
    } = await req.json()
    
    if ( !data.id || !data.title || !data.author ) return new Response( 'ucorrect data' )

    data.title = data.title.substring( 0, 60 )
    data.title = data.title.split(`'`).join('`')

    data.author = data.author.substring( 0, 60 )
    data.author = data.author.split(`'`).join('`')

    const user = await this.mySQLServiceUser.getUser( req )
    if ( user === null ) return new Response( null, { status: 400 } )
    
    const comments = await this.mySQLServiceComment.getCommentsBySoundID( data.id )
    if ( comments === null ) return new Response( null, { status: 404 } )


    // check author
    let isAuthor = false
    let index = 0
    while( comments.length > index ){

      const item = comments[index]
      if ( item.userID === user.id && item.status === 10 ) {

        isAuthor = true
        index = comments.length // stop while

      } 

      index++

    }


    if ( isAuthor === false ) return new Response( null, { status: 404 } )

    try{


      await this.client.execute( `UPDATE sounds SET title='${ data.title }', author='${ data.author }' WHERE id=${ data.id }` )
      return new Response( null, { status: 200 } )
      

    } catch ( err ) {
      

      console.log( '\n ' + err + '\n' )
      return new Response( null, { status: 500 } )


    }

  }



  // PRIVATE --- ---

  private intoBinary( arraySoundtracks: soundtrackDTO[] ): Uint8Array {

    const encoder = new TextEncoder()
    const length = arraySoundtracks.length

    const responseArray: number[] = []

    let index = 0
    while( index !== length ) {

      const item = arraySoundtracks[index]
      const lengthID = Math.ceil( item.id / 255 )

      // add length byte ID
      responseArray.push( ...this.converterTo16( lengthID, 1 ) )

      // add ID
      responseArray.push( ...this.converterTo16( item.id, lengthID ) )

      // add duration - 2 byte
      responseArray.push( ...this.converterTo16( item.duration, 2 ) )

      // add length title - 1 byte
      const titleEncode = encoder.encode( item.title )
      responseArray.push( ...this.converterTo16( titleEncode.length, 1 ) )
      
      // add title - title length byte
      responseArray.push( ...titleEncode )
      
      // add length author - 1 byte
      const authorEncode = encoder.encode( item.author )
      responseArray.push( ...this.converterTo16( authorEncode.length, 1 ) )
      
      // add author - author length byte
      responseArray.push( ...authorEncode )
      
      // add created at - 2 byte
      const created = item.createdAt.split('.')
      responseArray.push( Number( created[0] ) )
      responseArray.push( Number( created[1] ) )

      index++

    }

    return new Uint8Array( responseArray )

  }


  private converterTo16( data: number, length: number ) {

    const result = new Array( length )

    let index = result.length - 1
    while ( index !== -1 ) {

      if ( index === result.length - 1 ) {
        result[index - 1] = Math.floor( data / 255 )
        result[index] = data - 255 * result[index - 1]
      } else {
        
        result[index - 1] = Math.floor( result[index] / 255 )
        result[index] = result[index] - 255 * result[index - 1]

      }

      index--
    }

    return result

  }


}