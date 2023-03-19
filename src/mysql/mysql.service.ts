import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";


export class MySQLService{





  constructor(
    private readonly mysqlClient: Client
  ){

    this.checkInit()
    this.createDatabase()
    
  }

  
  private checkInit(){
    


  }
  

  private async createDatabase(){

    await this.mysqlClient.execute(`CREATE DATABASE IF NOT EXISTS mp3_sharer`);
    await this.mysqlClient.execute(`USE mp3_sharer`);

  }



}