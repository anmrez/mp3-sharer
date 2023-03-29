

export class Profile{


  buttonUser = document.querySelector( '#buttonUser' )
  image =  this.buttonUser.querySelector( '#image' )
  username = this.buttonUser.querySelector( '#username' )


  constructor(){}
  
  
  init(){
    
    this._get()
    
  }


  async _get(){

    const response = await fetch( '/getProfile', {
      method: 'GET',
    })

    if ( response.status === 200 ) {

      const user = await response.json()
      
      this.buttonUser.userID = user.id
      this.username.innerHTML = user.username
      this.image.src = '/static/profile/' + user.image
      this.image.alt = user.image
      
      return;
      
    }
    
    this.buttonUser.userID = -1
    this.image.src = '/static/profile/default.png'
    this.image.alt = 'default.png'
    this.username.innerHTML = '404'

  }

}