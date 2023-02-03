import { UploadService } from './upload.service.ts';
import { ProfileService } from '../profile/profile.service.ts';


export class UploadController{


  constructor(
    private readonly uploadService: UploadService,
    private readonly profileService: ProfileService
  ){}


  
  async write( req: Request, res: any ){

    console.log( 'Upload file' )

    // const isVerified = await this.profileService.isVerifiedUser( req )
    // if ( isVerified === false ) {
      
    //   res( new Response( undefined, { status: 401 } ) )
    //   return;

    // } 

    this.uploadService.write( req, res )

  }


}