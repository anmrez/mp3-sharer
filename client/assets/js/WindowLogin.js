

export class WindowLogin{



  addEventView( button ){

    button.addEventListener( 'click', function(){

      document.querySelector( '#loginWindow' ).style.display = 'block'
    
    } )

  }


  addEventClose(  ){

    window.addEventListener( 'keydown', function( event ){

      if ( event.key === 'Escape' ) document.querySelector( '#loginWindow' ).style.display = 'none'
    
    } )


  }





}