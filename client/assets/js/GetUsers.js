



export class GetUsers{


  users = document.querySelectorAll( '[data-user]' )
  tooltip = document.querySelector( '#tooltip' )
  responseData

  constructor(){}


  init(){

    this._getUsers()

  }


  async _getUsers(){

    const response = await fetch( 'getUsers', {
      method: 'GET'
    } )

    this.responseData = await response.json()

    this.users.forEach( ( item, index ) => {
      
      const image = item.firstElementChild
      
      if ( this.responseData[index] !== undefined ){

        let item = this.responseData[index]

        image.src = './static/profile/' + item.image
        image.style.background = 'none'

        image.addEventListener( 'mousemove', this._mousemoveUser.bind( this, item.username ) )
        image.addEventListener( 'mouseout', this._mouseoverUser.bind( this ) )

      } else {
        
        // image.src = './static/profile/default.png'

      }

    });

    return 

  }



  _mousemoveUser( username, event ){

    this.tooltip.innerHTML = username
    this.tooltip.classList.remove( 'none' )
    this.tooltip.style.left = event.clientX + 'px'
    this.tooltip.style.top = event.clientY + 'px'

  }


  _mouseoverUser(){

    this.tooltip.classList.add( 'none' )

  }



}