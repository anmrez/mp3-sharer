



export class Keyboard{

  windowUpload = document.querySelector( '#uploadWindow' )
  windowLogin = document.querySelector( '#loginWindow' )
  windowComment = document.querySelector( '#commentWindow' )
  
  constructor( upload, comment ){
    
    this.uploadService = upload
    this.commentService = comment

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

      this.windowLogin.classList.add( 'none' )


    }

  }


}