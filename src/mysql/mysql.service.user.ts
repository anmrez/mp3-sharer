import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import { userDTO } from "./dto/user.dto.ts";
import { CookieService } from '../cookie/cookie.service.ts';
import { ConfigModule, IUser } from '../config/config.module.ts';


export class MySQLServiceUser{

  
  private users: IUser[] = []


  constructor(
    private readonly mysqlClient: Client,
    private readonly cookieService: CookieService,
    private readonly configModule: ConfigModule
  ){

    this.users = this.configModule.users
    this.createUserTable()

  }



  private async createUserTable(){

    const showTables = await this.mysqlClient.execute( `SHOW TABLES LIKE 'users';` )

    if ( showTables.rows?.length !== 0 ) return undefined

    await this.mysqlClient.execute(
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
      if ( item.image ) await this.mysqlClient.execute(`INSERT INTO users( username, image, email ) VALUES ( '${item.username}', '${item.image}', '${ item.email }' );`);

      if ( item.image === undefined ) await this.mysqlClient.execute(`INSERT INTO users( username, email ) VALUES ( '${ item.username }', '${ item.email }' );`);

      index++

    }



  }


  async getAllUsers(){

    const result = await this.mysqlClient.execute( `SELECT * FROM users;` )
    
    if ( result.rows === undefined ) return null

    const users: userDTO[] = result.rows
    return users

  }


  async getUserByName( username: string ): Promise< userDTO | null > {

    const result = await this.mysqlClient.execute( `SELECT * FROM users WHERE username='${ username }';` )

    if ( result.rows?.length === 0 ) return null
    if ( result.rows === undefined ) return null

    const user: userDTO = result.rows[0]
    return user

  }


  async getUserByToken( token: string ): Promise< userDTO | null > {

    const result = await this.mysqlClient.execute( `SELECT * FROM users WHERE token='${ token }';` )

    if ( result.rows?.length === 0 ) return null
    if ( result.rows === undefined ) return null

    const user: userDTO = result.rows[0]
    return user

  }


  async getUser( req: Request ): Promise< userDTO | null > {

    const token = this.cookieService.get( req, 'token' )
    if ( token === null ) return null

    const user = await this.getUserByToken( token )
    if ( user === null ) return null

    return user

  }


  async setToken( username: string, token: string ): Promise< void >{

    await this.mysqlClient.execute( `UPDATE users SET token='${ token }' WHERE username='${ username }';` )

  }



}