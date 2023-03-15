import { mysqlConfig } from '../../config.ts';
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

const client = await new Client().connect( mysqlConfig )


export class MySQLService{

  client: Client = client
  static isInited = false


  constructor(){

    this.checkInit()
    this.createDatabase()
    
  }

  
  private checkInit(){
    
    if ( MySQLService.isInited ) throw new Error( '[MySQLService] - Экземпляр класса уже существует' )
    MySQLService.isInited = true

  }
  

  private async createDatabase(){

    await this.client.execute(`CREATE DATABASE IF NOT EXISTS mp3_sharer`);
    await this.client.execute(`USE mp3_sharer`);

  }



}