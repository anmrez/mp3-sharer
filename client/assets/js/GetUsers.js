



export class GetUsers{


  users = document.querySelectorAll( '[data-user]' )


  constructor(){

    this.init()

  }


  init(){

    console.log( this.users )


  }



}