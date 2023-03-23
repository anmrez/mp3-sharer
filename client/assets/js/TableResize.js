

export class TableResize{

  // in document
  player = document.querySelector( '#player' )
  mainTable = document.querySelector( '#mainTable' )

  // in player
  playerBody = this.player.querySelector( '#body' )

  // in mainTable
  table = this.mainTable.querySelector( '#table' )


  constructor(){}


  init(){

    this._evnetResizeWindow()
    this._addEventResizeWindow()

  }


  _addEventResizeWindow(){

    window.addEventListener( 'resize', this._evnetResizeWindow.bind( this ) )

  }


  _evnetResizeWindow(){

    const positionTable = this.table.offsetTop
    const positionPlayer = this.playerBody.offsetTop

    this.table.style.maxHeight = positionPlayer - 20 - positionTable + 'px'

  }


}