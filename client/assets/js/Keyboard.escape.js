import { Comment } from './Comment.js';
import { RenameSoundtrack } from './RenameSoundtrack.js'
import { Upload } from './Upload.js';


export class KeyboardEscape {


  windowUpload = document.querySelector( '#uploadWindow' )
  windowComment = document.querySelector( '#commentWindow' )
  

  constructor( 
    upload, 
    comment, 
    renameSoundtrack 
  ){

    if ( upload instanceof Upload === false ) throw 'Error [Keyboard escape] - upload not Upload'
    if ( comment instanceof Comment === false ) throw 'Error [Keyboard escape] - comment not Comment'
    if ( renameSoundtrack instanceof RenameSoundtrack === false ) throw 'Error [Keyboard escape] - renameSoundtrack not RenameSoundtrack'
    
    this.uploadService = upload
    this.commentService = comment
    this.renameSoundtrackService = renameSoundtrack

  }


  init(){

    this._addEventsESC()
    
  }
  

  // PRIVATE --- ---
  _addEventsESC(){

    window.addEventListener( 'keydown', this._eventESC.bind( this ) )

  }


  _eventESC( event ){

    if ( event.key === 'Escape' ){

      this.uploadService.closeWindow()
      this.commentService.closeWindow()
      this.renameSoundtrackService.closeWindow()

    }

  }


}