import { UploadController } from "./upload.controller.ts";
import { UploadService } from "./upload.service.ts";
import { MySQLModule } from '../mysql/mysql.module.ts';
import { Router } from "../router/router.ts";


export class UploadModule{


  public controller: UploadController
  public service: UploadService

  
  constructor(
    private readonly router: Router,
    private readonly mySQLModule: MySQLModule
  ){

    this.service = new UploadService( 
      this.mySQLModule.serviceSoundtrack, 
      this.mySQLModule.serviceComment, 
      this.mySQLModule.serviceUser 
    )
    this.controller = new UploadController( this.router, this.service )

  }


}