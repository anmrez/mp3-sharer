import { KeyboardService } from './Keyboard.service.js';
import { Tooltip } from './Tooltip.js';


export class Comment{

  // inputs classes
  #keyboardService
  #tooltip

  // in modal window
  #window = document.querySelector( '#commentWindow' )
  #comment = this.#window.querySelector( '#comment' )
  #send = this.#window.querySelector( '#send' )
  #status = this.#window.querySelector( '#status' )
  #count = this.#window.querySelector( '#count' )

  // in player
  #player = document.querySelector( '#player' )
  #commentIntoPlayer = this.#player.querySelector( '#comment' )

  // other
  #table = document.querySelector( '#tableMusick' )
  #tableBody = this.#table.querySelector( '#tableMusickBody' )
  #buttonUser = document.querySelector( '#buttonUser' )
  
  #userID
  #sendData = {
    soundID: 0,
    status: 0,
    comment: ''
  }


  constructor( keyboardService, tooltip ){

    if ( keyboardService instanceof KeyboardService === false ) throw 'Error [Comment] - keyboardService not KeyboardService'
    this.#keyboardService = keyboardService

    if ( tooltip instanceof Tooltip === false ) throw 'Error [Comment] - tooltip not Tooltip'
    this.#tooltip = tooltip

  }


  init(){

    this.#getUserID()
    this.#addEventInputTextarea()

    this.#addEventStatus()
    this.#addEventButtonCommentIntoPlayer()
    this.#addEventSend()

  }


  #getUserID(){

    this.#userID = Number( this.#buttonUser.userID )
    console.log( 'user id: ', this.#userID )
    if ( this.#userID === undefined ) setTimeout( this.#getUserID.bind( this ), 2000 ) 

  }


  // TEXTAREA --- ---
  #addEventInputTextarea(){

    this.#eventInputTextarea()
    this.#comment.addEventListener( 'input', this.#eventInputTextarea.bind( this ) )

  }


  #eventInputTextarea(){

    if ( this.#comment.value.length > 100 ) this.#comment.value = this.#comment.value.substring( 0, 100 )
    else this.#count.innerHTML = this.#comment.value.length + ''

  }


  // STATUS --- ---
  #addEventStatus(){

    const childrens = this.#status.children

    let index = 0
    while( childrens.length > index ){

      const item = childrens[index]
      item.addEventListener( 'click', this.#eventStatus.bind( this ) )

      index++

    }

  }


  #eventStatus( event ){

    const childrens = this.#status.children

    let index = 0
    while( childrens.length > index ){

      const item = childrens[index]

      if ( item === event.target ) {

        event.target.style.border = '2px solid #ccc'

        const status = index + 1
        this.#sendData.status = status
        
      } else item.style.border = '2px solid transparent'
      
      index++
      
    }
    
  }


  // Button into player --- ---
  #addEventButtonCommentIntoPlayer(){

    this.#commentIntoPlayer.addEventListener( 'click', this.#eventButtonCommentIntoPlayer.bind( this ) )

    const tooltipShow = this.#tooltip.showTop.bind( this.#tooltip, this.#commentIntoPlayer, 'comment' )

    this.#commentIntoPlayer.addEventListener( 'mousemove', tooltipShow )
    this.#commentIntoPlayer.addEventListener( 'mouseout', this.#tooltip.hidden.bind( this.#tooltip ) )

  }


  #eventButtonCommentIntoPlayer(){

    const isHidden = this.#window.classList.contains( 'none' )

    if ( isHidden ) this.#openWindow()
    else this.closeWindow()

  }


  // SEND --- ---
  #addEventSend(){

    this.#send.addEventListener( 'click', this.#eventSend.bind( this ) )

  }


  async #eventSend(){

    const comment = this.#comment.value.substring( 0, 100 )
    this.#sendData.comment = comment

    this.#sendData.soundID = this.#player.soundID

    const bodyJson = JSON.stringify( this.#sendData )
    const response = await fetch( '/setComment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: bodyJson
    } )

    if ( response.status === 200 ) {

      this.#table.update()
      this.closeWindow()

    }

  }


  // WINDOW === === ===
  // OPEN === ===

  #openWindow(){

    this.#findCurrentComment()
    this.#keyboardService.removeKeyboardEvents()
    this.#window.classList.remove( 'none' )

    
  }
  
  
  #findCurrentComment(){

    const soundID = this.#player.soundID 
    const row = this.#tableBody.querySelector( '[soundid="' + soundID + '"]' )
    
    const status = row.querySelector( '[userid="' + this.#userID + '"]' )
    const buttonsStatus = this.#status.children
    if ( status.code === 1 ) buttonsStatus[0].click()
    if ( status.code === 2 ) buttonsStatus[1].click()
    if ( status.code === 3 ) buttonsStatus[2].click()

    this.#comment.value = ''
    if ( status.comment ) this.#comment.value = status.comment

  }


  // CLOSE === ===
  closeWindow(){
  
    this.#keyboardService.addKeyboardEvents()
    this.#window.classList.add( 'none' )
    
  }



}