



export class Keyboard{



  constructor(){

    this._addEventsESC()

  }


  _addEventsESC(){

    window.addEventListener( 'keydown', this._eventESC.bind( this ) )

  }


  _eventESC( event ){

    if ( event.key === 'Escape' ){

      document.querySelector( '#uploadWindow' ).classList.add( 'none' )
      document.querySelector( '#loginWindow' ).classList.add( 'none' )

    }

  }


}