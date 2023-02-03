import { mysqlConfig, users } from '../../config.ts';
import { Client } from "https://deno.land/x/mysql/mod.ts";
const client = await new Client().connect( mysqlConfig );


export interface IUser{
  username: string
  email: string
  image?: string
}


interface IUserMySQL{
  id: number
  username: string
  email: string
  image: string
  token: null | string
}


export class MySQLService{


  private users: IUser[] = users


  constructor(){

    this.create()

  }


  private async create(){

    await this.createDatabase()
    await this.createUserTable()
    await this.createSoundTable()

  }


  private async createDatabase(){

    await client.execute(`CREATE DATABASE IF NOT EXISTS mp3_sharer`);
    await client.execute(`USE mp3_sharer`);

  }



  // USERS === ===

  private async createUserTable(){

    await client.execute(`DROP TABLE IF EXISTS users;`);

    await client.execute(
      `CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username varchar(20) NOT NULL,
        image varchar(30) DEFAULT 'default.png',
        email varchar(30) NOT NULL,
        token varchar(50)
      );`
    );


    let index = 0
    while ( this.users.length > index ) {

      const item = this.users[index]
      if ( item.image ) await client.execute(`INSERT INTO users( username, image, email ) VALUES ( '${item.username}', '${item.image}', '${ item.email }' );`);

      if ( item.image === undefined ) await client.execute(`INSERT INTO users( username, email ) VALUES ( '${ item.username }', '${ item.email }' );`);

      index++

    }

  }


  async getAllUsers(){

    const result = await client.execute( `SELECT * FROM users;` )
    
    const users = result.rows
    return users

  }


  async getUserByName( username: string ): Promise< IUserMySQL | null > {

    const result = await client.execute( `SELECT * FROM users WHERE username='${ username }';` )

    if ( result.rows?.length === 0 ) return null
    if ( result.rows === undefined ) return null

    const user: IUserMySQL = result.rows[0]
    return user

  }


  async getUserByToken( token: string ): Promise< IUserMySQL | null > {

    const result = await client.execute( `SELECT * FROM users WHERE token='${ token }';` )

    if ( result.rows?.length === 0 ) return null
    if ( result.rows === undefined ) return null

    const user: IUserMySQL = result.rows[0]
    return user

  }


  async setToken( username: string, token: string ): Promise< void >{

    await client.execute( `UPDATE users SET token='${ token }' WHERE username='${ username }';` )

  }



  // SOUNDS === ===

  private async createSoundTable(  ){

    const showTables = await client.execute( `SHOW TABLES LIKE 'sounds';` )

    console.log( showTables.rows?.length )
    if ( showTables.rows?.length === 0 )

    await client.execute( `CREATE TABLE sounds (
      id INT PRIMARY KEY AUTO_INCREMENT,
      duration smallint,
      title varchar(60) NOT NULL,
      author varchar(60) NOT NULL,
      createdAt varchar(5) NOT NULL
    );` )

  }


  async getAllSounds(){

    const allSound = await client.execute( 'SELECT * FROM sounds;' )
    return allSound.rows

  }


  async setSound( title: string, author: string, duration: number ){

    let day = String( new Date().getDate() )
    let month = String( new Date().getMonth() + 1 )

    if ( month.length === 1 ) month = '0' + month
    if ( day.length === 1 ) day = '0' + day
    
    const createdAt = month + '.' + day

    const result = await client.execute( `
    INSERT INTO sounds 
    ( duration, title, author, createdAt ) 
    VALUES 
    ( '${ duration }', '${ title }', '${ author }', '${ createdAt }' )
    `)

    if ( result.lastInsertId !== undefined ) return result.lastInsertId
    return null

  }


}