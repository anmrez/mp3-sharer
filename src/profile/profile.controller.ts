import { Router } from '../router/router.ts';
import { ProfileService } from './profile.service.ts';


export class ProfileController{


  constructor(
    private readonly router: Router,
    private readonly profileService: ProfileService
  ){

    router.get( '/getProfile', function( req: Request ){
      return profileService.get( req )
    } )
    

    router.get( '/getUsers', function() {
      return profileService.getAllUsers()
    } )


  }


}