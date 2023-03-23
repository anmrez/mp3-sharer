



export class GetUsers{


  usersIntoTable = document.querySelectorAll( '[data-user]' )
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

    let index = 0
    while ( this.usersIntoTable.length !== index ) {

      const item = this.usersIntoTable[index]
      const image = item.firstElementChild
      
      if ( this.responseData[index] === undefined ) break;

      const user = this.responseData[index]

      image.src = './static/profile/' + user.image
      image.style.background = 'none'

      image.addEventListener( 'mousemove', this._mousemoveUser.bind( this, user.username ) )
      image.addEventListener( 'mouseout', this._mouseoverUser.bind( this ) )

      index++

    }

    return;

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