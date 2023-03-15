import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { soundtrackDTO } from "./dto/soundtrack.dto.ts";



export class MySQLServiceSoundtrack{

  client: Client

  constructor(
    client: Client
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
      is_archived boolean DEFAULT false
    );` )

  }


  async getAllSounds(): Promise< soundtrackDTO[] | null > {

    const allSound = await this.client.execute( 'SELECT * FROM sounds WHERE is_archived = 0;' )

    if ( allSound.rows == undefined ) return null
    return allSound.rows
    
  }


  async getAllSoundsInArchive(){
    
    const allSound = await this.client.execute( 'SELECT * FROM sounds WHERE is_archived = 1;' )

    if ( allSound.rows == undefined ) return null
    return allSound.rows
    
  }


  async removeSoundtrack( soundID: number ){

    await this.client.execute( `UPDATE sounds SET is_archived=true WHERE id=${ soundID }` )

  }


  async setSound( title: string, author: string, duration: number ){

    let day = String( new Date().getDate() )
    let month = String( new Date().getMonth() + 1 )

    if ( month.length === 1 ) month = '0' + month
    if ( day.length === 1 ) day = '0' + day
    
    const createdAt = month + '.' + day

    const result = await this.client.execute( `
    INSERT INTO sounds 
    ( duration, title, author, createdAt ) 
    VALUES 
    ( '${ duration }', '${ title }', '${ author }', '${ createdAt }' )
    `)

    if ( result.lastInsertId !== undefined ) return result.lastInsertId
    return null

  }


  async renameSoundrack( soundID: number, title: string, author: string ){

    await this.client.execute( `UPDATE sounds SET title='${ title }', author='${ author }' WHERE id=${ soundID }` )

  }


}