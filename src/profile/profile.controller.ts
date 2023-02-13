import { ProfileService } from './profile.service.ts';


export class ProfileController{


  constructor(
    private readonly profileService: ProfileService
  ){}


  get( req: Request ): Promise< Response > {

    return this.profileService.get( req )

  }


  getAllUsers(): Promise< Response > {

    return this.profileService.getAllUsers()

  }


}