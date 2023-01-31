

export class Profile{


  constructor(){

    this.get()

  }


  async get(){

    const request = await fetch( '/getProfile', {
      method: 'POST',
    })

    if ( request.status !== 200 ) return;

    const buttonLogin = document.querySelector( '#buttonLogin' )
    buttonLogin.classList.add( 'none' )
    
    const buttonUser = document.querySelector( '#buttonUser' )
    buttonUser.classList.remove( 'none' )

    const response = await request.json()

    buttonUser.querySelector( '#username' ).innerHTML = response.username
    buttonUser.querySelector( '#userImage' ).src = '/static/profile/' + response.image
    buttonUser.querySelector( '#userImage' ).alt = response.image

  }

}