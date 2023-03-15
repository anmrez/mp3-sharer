import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { userDTO } from "./dto/user.dto.ts";
import { users } from '../../config.ts';


export interface IUser{
  username: string
  email: string
  image?: string
}


export class MySQLServiceUser{

  private users: IUser[] = users
  private client: Client


  constructor(
    client: Client
  ){

    this.client = client
    this.createUserTable()

  }



  private async createUserTable(){

    // await this.client.execute(`DROP TABLE IF EXISTS users;`);
    const showTables = await this.client.execute( `SHOW TABLES LIKE 'users';` )

    if ( showTables.rows?.length === 0 )
    await this.client.execute(
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
      if ( item.image ) await this.client.execute(`INSERT INTO users( username, image, email ) VALUES ( '${item.username}', '${item.image}', '${ item.email }' );`);

      if ( item.image === undefined ) await this.client.execute(`INSERT INTO users( username, email ) VALUES ( '${ item.username }', '${ item.email }' );`);

      index++

    }

  }


  async getAllUsers(){

    const result = await this.client.execute( `SELECT * FROM users;` )
    
    if ( result.rows === undefined ) return null

    const users: userDTO[] = result.rows
    return users

  }


  async getUserByName( username: string ): Promise< userDTO | null > {

    const result = await this.client.execute( `SELECT * FROM users WHERE username='${ username }';` )

    if ( result.rows?.length === 0 ) return null
    if ( result.rows === undefined ) return null

    const user: userDTO = result.rows[0]
    return user

  }


  async getUserByToken( token: string ): Promise< userDTO | null > {

    const result = await this.client.execute( `SELECT * FROM users WHERE token='${ token }';` )

    if ( result.rows?.length === 0 ) return null
    if ( result.rows === undefined ) return null

    const user: userDTO = result.rows[0]
    return user

  }


  async setToken( username: string, token: string ): Promise< void >{

    await this.client.execute( `UPDATE users SET token='${ token }' WHERE username='${ username }';` )

  }



}