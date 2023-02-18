

export class Keyboard{

  windowUpload = document.querySelector( '#uploadWindow' )
  windowComment = document.querySelector( '#commentWindow' )
  
  constructor( upload, comment, renameSoundtrack ){

    if ( player === undefined ) throw 'Player service is undefined'
    if ( comment === undefined ) throw 'comment service is undefined'
    if ( renameSoundtrack === undefined ) throw 'renameSoundtrack service is undefined'
    
    this.uploadService = upload
    this.commentService = comment
    this.renameSoundtrackService = renameSoundtrack

  }


  init(){

    this._disableSpaceScroll()
    this._addEventsESC()
    
  }
  
  
  _disableSpaceScroll(){

    window.addEventListener( 'keydown', function( event ) {

      if ( event.keyCode === 32 )
        if ( event.target === document.body ) event.preventDefault()

    });

  }


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