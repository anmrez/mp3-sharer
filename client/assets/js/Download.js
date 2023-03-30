

export class Download{

  
  player = document.querySelector( '#player' )
  buttonDownload = this.player.querySelector( '#download' )

  _download = document.createElement( 'a' )
  
  constructor(){}


  init(){
    
    this._addEventClick()

  }


  _addEventClick(){

    this.buttonDownload.addEventListener( 'click', this._eventClick.bind( this ) )

  }

  _eventClick(){

    const title = this.player.title
    const author = this.player.author
    const soundtrack = this.player.querySelector( '#soundtrack' )
    
    this._download.setAttribute( 'href', soundtrack.src )
    this._download.setAttribute( 'download', author + ' – ' + title + '.mp3' )
    this._download.click()

  }

}