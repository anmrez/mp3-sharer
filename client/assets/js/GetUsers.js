import { Tooltip } from './Tooltip.js';


export class GetUsers{


  usersIntoTable = document.querySelectorAll( '[data-user]' )
  responseData

  constructor( tooltip ){

    if ( tooltip instanceof Tooltip === false ) throw 'Error [GetSoundtracks] - tooltip not Tooltip'
    this.tooltip = tooltip

  }


  init(){

    this._getUsers()

  }


  async _getUsers() {

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

      image.addEventListener( 'mousemove', this.tooltip.show.bind( this.tooltip, item, user.username ) )
      image.addEventListener( 'mouseout', this.tooltip.hidden.bind( this.tooltip ) )

      index++

    }

    return;

  }


}