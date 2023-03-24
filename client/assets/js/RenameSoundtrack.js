

export class RenameSoundtrack{

  // in player
  player = document.querySelector( '#player' )
  playerTitle = this.player.querySelector( '#title' )
  playerAuthor = this.player.querySelector( '#author' )
  button = this.player.querySelector( '#renameSoundtrack' )
  
  // in modal window
  window = document.querySelector( '#renameSoundtrackWindow' )
  esc = this.window.querySelector( '#esc' )
  title = this.window.querySelector( '#title' )
  author = this.window.querySelector( '#author' )
  soundID = this.window.querySelector( '#soundID' )
  send = this.window.querySelector( '#send' )

  // other
  userID = document.querySelector( '#buttonUser' ).userID
  table = document.querySelector( '#tableMusick' )


  constructor( keyboardService ){

    if ( keyboardService === undefined ) throw 'Error [Upload] - keyboardService is undefined'
    this.keyboardService = keyboardService

  }


  init(){

    this._addEventButtonRename()
    this._addEventButtonEsc()
    this._addEventSend()

  }


  // EVENTS --- ---
  _addEventButtonRename(){

    this.button.addEventListener( 'click', this._openWindow.bind( this ) )

  }


  _addEventButtonEsc(){

    this.esc.addEventListener( 'click', this.closeWindow.bind( this ) )

  }


  _addEventSend(){
    
    this.send.addEventListener( 'click', this._eventSend.bind( this ) )  
    
  }
  
  
  async _eventSend(){

    const body = {
      id: this.soundID.value,
      title: this.title.value,
      author: this.author.value
    }

    body.title = body.title.substring( 0, 60 )
    body.author = body.author.substring( 0, 60 )

    console.log( body )

    await fetch( '/renameSoundtrack', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify( body )
    } ).then( () => {

      this.player.title = body.title
      this.playerTitle.innerHTML = body.title

      this.player.author = body.author
      this.playerAuthor.innerHTML = body.author

      this.closeWindow()
      this.table.update()

    } ).catch( ( err ) => {
      console.log( err )
    } )

  }


  // BUTTON --- ---
  show(){

    this.button.classList.remove( 'none' )

  }
  
  hidden(){

    this.button.classList.add( 'none' )

  }


  // WINDOW === === ===
  // OPEN === ===
  _openWindow(){

    this.window.classList.remove( 'none' )
    this.title.value = this.player.title
    this.author.value = this.player.author
    this.soundID.value = this.player.soundID

    this.keyboardService.removeKeyboardEvents()

  }


  // CLOSE === ===
  closeWindow(){

    this.window.classList.add( 'none' )
    this.keyboardService.addKeyboardEvents()

  }


}