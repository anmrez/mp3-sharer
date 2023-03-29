

export class TableResize{

  // in document
  player = document.querySelector( '#player' )

  // in player
  playerBody = this.player.querySelector( '#body' )

  // tableSoundtrack
  table = document.querySelector( '#tableSoundtrack' )


  constructor(){}


  init(){

    this._evnetResizeWindow()
    this._addEventResizeWindow()

  }


  _addEventResizeWindow(){

    window.addEventListener( 'resize', this._evnetResizeWindow.bind( this ) )

  }


  _evnetResizeWindow(  ){

    const positionTable = this.table.offsetTop
    const positionPlayer = this.playerBody.offsetTop

    this.table.style.maxHeight = positionPlayer - 5 - positionTable + 'px'

  }


}