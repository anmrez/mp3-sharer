import { UploadService } from './upload.service.ts';
import { Router } from '../router/router.ts';


export class UploadController{


  constructor(
    private readonly router: Router,
    private readonly uploadService: UploadService,
  ){

    router.post( '/upload', function( req: Request ){
      return uploadService.write( req )
    } )

  }


}