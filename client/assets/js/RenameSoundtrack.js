

export class RenameSoundtrack{

  player = document.querySelector( '#player' )
  playerTitle = this.player.querySelector( '#title' )
  playerAuthor = this.player.querySelector( '#author' )
  button = this.player.querySelector( '#renameSoundtrack' )

  window = document.querySelector( '#renameSoundtrackWindow' )
  esc = this.window.querySelector( '#esc' )
  title = this.window.querySelector( '#title' )
  author = this.window.querySelector( '#author' )
  soundID = this.window.querySelector( '#soundID' )

  send = this.window.querySelector( '#send' )

  userID = document.querySelector( '#buttonUser' ).userID
  table = document.querySelector( '#tableMusick' )


  constructor( player, getMusick ){

    if ( player === undefined ) throw 'PlayerService is undefined'
    if ( getMusick === undefined ) throw 'GetMusickService is undefined'

    this.playerService = player
    this.getMusickService = getMusick

  }


  init(){

    this._addEventButtonRename()
    this._addEventButtonEsc()
    this._addEventSend()

  }


  // Event button rename === ===
  _addEventButtonRename(){

    this.button.addEventListener( 'click', this._openWindow.bind( this ) )

  }


  // Event button esc === ===
  _addEventButtonEsc(){

    this.esc.addEventListener( 'click', this.closeWindow.bind( this ) )

  }

  // Event send
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


  // button

  show(){

    this.button.classList.remove( 'none' )

  }
  
  hidden(){

    this.button.classList.add( 'none' )

  }

  // WINDOW === === ===

  _openWindow(){

    this.window.classList.remove( 'none' )
    this.title.value = this.player.title
    this.author.value = this.player.author
    this.soundID.value = this.player.soundID

    this._removeKeyboardEvents()

  }


  _removeKeyboardEvents(){

    this.playerService.removeEventOnSpace()
    this.playerService.removeEventFastForward()
    this.playerService.removeEventRewind()

    this.getMusickService.removeEventReloadOnR()
    
  }


  closeWindow(){

    this.window.classList.add( 'none' )
    this._addKeyboardEvents()

  }

  _addKeyboardEvents(){
    
    this.playerService.addEventOnSpace()
    this.playerService.addEventFastForward()
    this.playerService.addEventRewind()

    this.getMusickService.addEventReloadOnR()

  }


}