import { ProfileService } from './profile.service.ts';


export class ProfileController{


  constructor(
    private readonly profileService: ProfileService
  ){}


  get( req: Request, res: any ){

    this.profileService.get( req, res )

  }


}