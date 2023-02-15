

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
    
    const user = await request.json()

    this.buttonUser.userID = user.id
    this.username.innerHTML = user.username
    this.image.src = '/static/profile/' + user.image
    this.image.alt = user.image

  }

}