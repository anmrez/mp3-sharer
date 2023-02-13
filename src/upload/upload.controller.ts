import { UploadService } from './upload.service.ts';


export class UploadController{


  constructor(
    private readonly uploadService: UploadService,
  ){}

  
  write( req: Request ): Promise< Response > {

    return this.uploadService.write( req )

  }


}