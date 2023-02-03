import { MySQLService } from "./mysql.service.ts";
import { MySQLController } from './mysql.controller.ts';




export class MySQLModule{

  constroller: MySQLController
  service: MySQLService


  constructor(){

    this.service = new MySQLService()
    this.constroller = new MySQLController( this.service )

  }


}