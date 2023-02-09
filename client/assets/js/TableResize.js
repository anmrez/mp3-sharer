

export class TableResize{


  player = document.querySelector( '#player' )
  playerBody = player.querySelector( '#body' )
  table = document.querySelector( '#table' )


  constructor(){

    // this.init()

  }


  init(){

    console.log( '[TableResize] - inited.' )
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