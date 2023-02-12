

export class Profile{


  buttonUser = document.querySelector( '#buttonUser' )
  image =  this.buttonUser.querySelector( '#image' )
  username = this.buttonUser.querySelector( '#username' )


  constructor(){}
  
  
  init(){
    
    this.get()

  }


  async get(){

    const request = await fetch( '/getProfile', {
      method: 'POST',
    })

    if ( request.status !== 200 ) return;
    
    const response = await request.json()
    
    this.username.innerHTML = response.username
    this.image.src = '/static/profile/' + response.image
    this.image.alt = response.image

  }

}