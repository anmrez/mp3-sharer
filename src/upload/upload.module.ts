import { UploadController } from "./upload.controller.ts";
import { UploadService } from "./upload.service.ts";
import { MySQLModule } from '../mysql/mysql.module.ts';
import { Router } from "../router/router.ts";
import { ConfigModule } from "../config/config.module.ts";
import { HashModule } from '../hash/hash.module.ts';


export class UploadModule{


  public controller: UploadController
  public service: UploadService

  
  constructor(
    private readonly router: Router,
    private readonly mySQLModule: MySQLModule,
    private readonly config: ConfigModule,
    private readonly hashModule: HashModule
  ){

    this.service = new UploadService( 
      this.mySQLModule.serviceSoundtrack, 
      this.mySQLModule.serviceComment, 
      this.mySQLModule.serviceUser,
      this.config,
      this.hashModule.service,
    )
    this.controller = new UploadController( this.router, this.service )

  }


}