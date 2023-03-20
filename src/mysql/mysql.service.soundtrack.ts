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


  async responseAllSounds(): Promise< Response > {

    const sounds = await this.getAllSounds()
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


  async getAllSounds(): Promise< soundtrackDTO[] | null > {

    const allSound = await this.client.execute( 'SELECT * FROM sounds WHERE is_archived = 0;' )
    const sounds: soundtrackDTO[] | undefined = allSound.rows
    
    if ( sounds === undefined ) return null
    return sounds

  }


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


  async getAllSoundsInArchive(): Promise< Response > {
    
    const allSound = await this.client.execute( 'SELECT * FROM sounds WHERE is_archived = 1;' )
    const sounds = allSound.rows

    if ( sounds === undefined ) return new Response( null, {
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


  async removeSoundtrack( soundID: number ){

    await this.client.execute( `UPDATE sounds SET is_archived=true WHERE id=${ soundID }` )

  }


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


  // async renameSoundrack( soundID: number, title: string, author: string ): Promise< Response >{
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


}