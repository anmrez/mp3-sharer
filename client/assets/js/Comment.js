

export class Comment{


  window = document.querySelector( '#commentWindow' )
  comment = this.window.querySelector( '#comment' )
  send = this.window.querySelector( '#send' )
  status = this.window.querySelector( '#status' )
  count = this.window.querySelector( '#count' )

  player = document.querySelector( '#player' )
  commentIntoPlayer = this.player.querySelector( '#comment' )
  soundID = this.player.querySelector( '#id' )

  table = document.querySelector( '#tableMusickBody' )
  buttonUser = document.querySelector( '#buttonUser' )
  userID = 0

  sendData = {
    soundID: 0,
    status: 0,
    comment: ''
  }

  constructor( player, getMusick ){

    if ( player === undefined ) throw 'PlayerService is undefined'
    if ( getMusick === undefined ) throw 'GetMusickService is undefined'

    this.playerService = player
    this.getMusickService = getMusick

  }


  init(){

    this._addEventInputTextarea()
    this._eventInputTextarea()

    this._addEventStatus()
    this._addEventButtonCommentIntoPlayer()
    this._addEventSend()

    this.userID = Number( this.buttonUser.userID )

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
    
  }


  // Button into player === ===
  _addEventButtonCommentIntoPlayer(){

    this.commentIntoPlayer.addEventListener( 'click', this._eventButtonCommentIntoPlayer.bind( this ) )

  }


  _eventButtonCommentIntoPlayer(){

    let isHidden = this.window.classList.contains( 'none' )

    if ( isHidden )
      this._openWindow()
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

    if ( response.status === 200 ) {

      this.getMusickService.get()
      this.closeWindow()

    }

  }



  // WINDOW === === ===
  // OPEN === ===

  _openWindow(){

    this._findCurrentComment()
    this._removeKeyboardEvents()
    this.window.classList.remove( 'none' )

  }


  _findCurrentComment(){

    const soundID = this.soundID.innerHTML
    const row = this.table.querySelector( '[soundid="' + soundID + '"]' )
    
    const status = row.querySelector( '[userid="' + this.userID + '"]' )
    const buttonsStatus = this.status.children
    if ( status.code === 1 ) buttonsStatus[0].click()
    if ( status.code === 2 ) buttonsStatus[1].click()
    if ( status.code === 3 ) buttonsStatus[2].click()

    this.comment.value = ''
    if ( status.comment ) this.comment.value = status.comment


  }



  _removeKeyboardEvents(){

    this.playerService.removeEventOnSpace()
    this.playerService.removeEventFastForward()
    this.playerService.removeEventRewind()

    this.getMusickService.removeEventReloadOnR()
    
  }
  


  // CLOSE === ===
  closeWindow(){
  
    this._addKeyboardEvents()
    this.window.classList.add( 'none' )
    
  }
  
  
  _addKeyboardEvents(){
    
    this.playerService.addEventOnSpace()
    this.playerService.addEventFastForward()
    this.playerService.addEventRewind()

    this.getMusickService.addEventReloadOnR()

  }


}