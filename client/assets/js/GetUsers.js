



export class GetUsers{


  users = document.querySelectorAll( '[data-user]' )


  constructor(){


  }


  init(){

    console.log( '[GetUsers] - inited.' )
    this._getUsers()

  }


  async _getUsers(){

    const response = await fetch( 'getUsers', {
      method: 'GET'
    } )

    const responseData = await response.json()

    this.users.forEach( ( item, index ) => {
      
      const image = item.firstElementChild
      
      if ( responseData[index] !== undefined ){

        image.src = './static/profile/' + responseData[index].image
        image.style.background = 'none'
        
      } else {
        
        image.src = './static/profile/default.png'

      }

    });

    return 

  }



}