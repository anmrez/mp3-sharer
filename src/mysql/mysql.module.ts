import { MySQLService } from "./mysql.service.ts";




export class MySQLModule{


  service: MySQLService


  constructor(){

    this.service = new MySQLService()

  }


}