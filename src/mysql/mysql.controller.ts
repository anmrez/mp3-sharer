import { MySQLServiceComment } from './mysql.service.comment.ts';
import { MySQLServiceSoundtrack } from './mysql.service.soundtrack.ts';
import { Router } from '../router/router.ts';


export class MySQLController{


  constructor(
    private readonly router: Router,
    private readonly mySQLServiceSoundtrack: MySQLServiceSoundtrack,
    private readonly mySQLServiceComment: MySQLServiceComment,
  ){

    this.addRoutingComments( mySQLServiceComment )
    this.addRoutingSoundtrack( mySQLServiceSoundtrack )

  }


  addRoutingComments( mySQLServiceComment: MySQLServiceComment ) {

    this.router.post( '/getComment', function( req: Request ) {
      return mySQLServiceComment.getCommentByRequest( req )
    } )


    this.router.post( '/setComment', function( req: Request ){
      return mySQLServiceComment.setComment( req )
    } )

  }


  addRoutingSoundtrack( mySQLServiceSoundtrack: MySQLServiceSoundtrack ) {

    this.router.get( '/getSounds', function() {
      return mySQLServiceSoundtrack.responseAllSounds()
    } )


    this.router.get( '/getSoundsInArchive', function() {
      return mySQLServiceSoundtrack.getAllSoundsInArchive()
    } )
    

    this.router.post( '/renameSoundtrack', function( req: Request ) {
      return mySQLServiceSoundtrack.renameSoundrack( req )
    } )

  }


}