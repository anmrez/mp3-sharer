

export class Download{

  
  buttonDownload = document.querySelector( '#download' )
  player = document.querySelector( '#player' )

  
  constructor(){

  }


  init(){
    
    this._addEventClick()

  }


  _addEventClick(){

    this.buttonDownload.addEventListener( 'click', this._eventClick.bind( this ) )

  }

  _eventClick(){

    const title = player.querySelector( '#title' ).innerHTML
    const author = player.querySelector( '#author' ).innerHTML
    const soundtrack = player.querySelector( '#soundtrack' )

    const a = document.createElement( 'a' )
    a.setAttribute( 'href', soundtrack.src )
    a.setAttribute( 'download', author + ' – ' + title + '.mp3' )

    document.body.append( a )

    a.click()

    document.body.removeChild( a );

  }

}