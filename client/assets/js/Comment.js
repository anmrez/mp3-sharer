

export class Comment{


  window = document.querySelector( '#commentWindow' )
  comment = this.window.querySelector( '#comment' )
  send = this.window.querySelector( '#send' )
  status = this.window.querySelector( '#status' )
  count = this.window.querySelector( '#count' )

  player = document.querySelector( '#player' )
  commentIntoPlayer = this.player.querySelector( '#comment' )
  soundID = this.player.querySelector( '#id' )

  sendData = {
    soundID: 0,
    status: 0,
    comment: ''
  }

  constructor( player, getMusick ){

    this.playerService = player
    this.getMusickService = getMusick

  }


  init(){

    console.log( '[Comment] - inited.' )
    this._addEventInputTextarea()
    this._eventInputTextarea()

    this._addEventStatus()
    this._addEventButtonCommentIntoPlayer()
    this._addEventSend()

  }

  // TEXTAREA === ===
  _addEventInputTextarea(){

    this.comment.addEventListener( 'input', this._eventInputTextarea.bind( this ) )

  }

  _eventInputTextarea(){

    if ( this.comment.value.length > 100 )
      this.comment.value = this.comment.value.substring( 0, 100 )
    else
      this.count.innerHTML = this.comment.value.length + ''

  }

  // STATUS === ===
  _addEventStatus(){

    let childrens = this.status.children
    let index = 0

    while( childrens.length > index ){

      let item = childrens[index]
      item.addEventListener( 'click', this._eventStatus.bind( this ) )

      index++

    }

  }


  _eventStatus( event ){

    let childrens = this.status.children
    let index = 0

    while( childrens.length > index ){

      let item = childrens[index]

      if ( item === event.target ) {

        event.target.style.border = '2px solid #ccc'

        const status = index + 1
        this.sendData.status = status
        
      } else {
        
        item.style.border = '2px solid transparent'
        
      }
      
      
      index++
      
    }
    
    console.log( this.sendData )

  }

  // Button into player === ===
  _addEventButtonCommentIntoPlayer(){

    this.commentIntoPlayer.addEventListener( 'click', this._eventButtonCommentIntoPlayer.bind( this ) )

  }


  _eventButtonCommentIntoPlayer(){

    let isHidden = this.window.classList.contains( 'none' )

    if ( isHidden )
      this.openWindow()
    else 
      this.closeWindow()

  }


  _addEventSend(){

    this.send.addEventListener( 'click', this._eventSend.bind( this ) )

  }

  async _eventSend(){


    let comment = this.comment.value.substring( 0, 100 )
    this.sendData.comment = comment

    this.sendData.soundID = Number( this.soundID.innerHTML )

    const bodyJson = JSON.stringify( this.sendData )
    const response = await fetch( '/setComment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: bodyJson
    } )

    console.log( response ) 

    if ( response.status === 200 ) {

      this.getMusickService.get()
      this.closeWindow()

    }

  }


  // WINDOW
  // OPEN === ===

  openWindow(){

    this._removeKeyboardEvents()
    this.window.classList.remove( 'none' )

  }


  _removeKeyboardEvents(){

    this.playerService.removeEventOnSpace()
    this.getMusickService.removeEventReloadOnR()
    
  }
  

  // CLOSE === ===
  closeWindow(){
  
    this._addKeyboardEvents()
    this.window.classList.add( 'none' )
    
  }
  
  
  _addKeyboardEvents(){
    
    this.playerService.addEventOnSpace()
    this.getMusickService.addEventReloadOnR()

  }


}