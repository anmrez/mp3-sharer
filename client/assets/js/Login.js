

export class Login{


  constructor(){

    this._addEventButton()
    this._addEventSend( )
    
  }


  _addEventButton(){


    const button = document.querySelector( '#homeButtonLogin' )
    button.addEventListener( 'click', this._eventButton.bind( this ) )

  }


  _eventButton(){

    const window = document.querySelector( '#loginWindow' )
    window.classList.remove( 'none' )

  }
  
  
  _addEventSend( ){
    
    const button = document.querySelector( '#windowButtonLogin' )
    button.addEventListener( 'click', this._send.bind( this ) )

  }



  async _send(){

    const username = document.querySelector( '#loginWindowUsername' )

    const request = await fetch( '/login', {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify( { username: username.value } )
    })
    
    const statusElement = document.querySelector( '#statusLogin' )
    const responseText = await request.text()
    statusElement.classList.remove( 'none' )

    if ( request.status === 404 ) {

      statusElement.classList.remove( 'background_yellow' )
      statusElement.classList.remove( 'background_green' )
      statusElement.classList.add( 'background_red' )
      statusElement.innerHTML = responseText

      setTimeout( this._removeAlert, 3000 )
      
      return;

    }

    if ( request.status === 400 ) {

      statusElement.classList.add( 'background_yellow' )
      statusElement.classList.remove( 'background_green' )
      statusElement.classList.remove( 'background_red' )
      statusElement.innerHTML = responseText
      
      setTimeout( this._removeAlert, 3000 )

      return;

    }
    
    statusElement.classList.remove( 'background_yellow' )
    statusElement.classList.add( 'background_green' )
    statusElement.classList.remove( 'background_red' )
    statusElement.innerHTML = 'Conformation link has been sent to your email address.'


    setTimeout( this._removeAlert, 3000 )


  }


  _removeAlert(){

    console.log( 'remove' )
    document.querySelector( '#statusLogin' ).classList.add( 'none' )

  }
  

}