

export class Login{


  constructor(){

  }
  
  
  addEventSend( button ){

    button.addEventListener( 'click', this._send )

  }



  async _send(){

    console.log( '_sendLogin' )

    const username = document.querySelector( '#loginWindowUsername' )
    console.log( username.value )

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

      statusElement.classList.add( 'background_red' )
      statusElement.classList.remove( 'background_green' )
      statusElement.innerHTML = responseText
      
      return;

    }
    
    statusElement.classList.remove( 'background_red' )
    statusElement.classList.add( 'background_green' )
    statusElement.innerHTML = 'An email has been sent to your email.'




  }
  

}