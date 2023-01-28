

export class Profile{


  constructor(){

    this.get()

  }


  async get(){


    const request = await fetch( '/getProfile', {
      method: 'POST',
    })

    if ( request.status !== 200 ) return;

    const response = await request.json()

    const buttonLogin = document.querySelector( '#buttonLogin' )
    buttonLogin.classList.add( 'none' )
    
    const buttonUser = document.querySelector( '#buttonUser' )
    buttonUser.classList.remove( 'none' )
    

    buttonUser.querySelector( '#username' ).innerHtml = response.username
    buttonUser.querySelector( '#userImage' ).src = '/static/profile/' + response.image
    buttonUser.querySelector( '#userImage' ).alt = response.image
    

  }


}