

export class WindowLogin{


  constructor(){
    this.addEventView()
    this.addEventClose()
  }


  addEventView( button ){

    const buttonLogin = document.querySelector( '#buttonLogin' )

    buttonLogin.addEventListener( 'click', function(){

      document.querySelector( '#loginWindow' ).style.display = 'block'
    
    } )

  }


  addEventClose(  ){

    window.addEventListener( 'keydown', function( event ){

      if ( event.key === 'Escape' ) document.querySelector( '#loginWindow' ).style.display = 'none'
    
    } )


  }





}