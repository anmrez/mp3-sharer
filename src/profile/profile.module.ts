import { MySQLModule } from "../mysql/mysql.module.ts";
import { ProfileController } from "./profile.controller.ts";
import { ProfileService } from "./profile.service.ts";


export class ProfileModule{


  service: ProfileService
  controller: ProfileController


  constructor(
    private readonly mySQLModule: MySQLModule
  ){

    this.service = new ProfileService( this.mySQLModule.service )
    this.controller = new ProfileController( this.service )

  }



}