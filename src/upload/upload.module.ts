import { ProfileModule } from "../profile/profile.module.ts";
import { UploadController } from "./upload.controller.ts";
import { UploadService } from "./upload.service.ts";
import { MySQLModule } from '../mysql/mysql.module.ts';


export class UploadModule{


  controller: UploadController
  service: UploadService

  constructor(
    private readonly profileModule: ProfileModule,
    private readonly mySQLModule: MySQLModule
  ){

    this.service = new UploadService( this.mySQLModule.service )
    this.controller = new UploadController( this.service, this.profileModule.service )

  }


}