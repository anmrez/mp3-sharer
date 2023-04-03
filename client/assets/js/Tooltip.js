

export class Tooltip{


  _tooltip = document.querySelector( '#tooltip' )


  constructor(){}

  
  show( event, message = undefined ) {

    if ( event === undefined ) throw 'Error [Tooltip] - event is undefined'

    this._tooltip.classList.remove( 'none' )
    
    if ( event instanceof Event ){

      this._tooltip.style.left = event.clientX + 5 + 'px'
      this._tooltip.style.top = event.clientY + 5 + 'px'

    } else {

      const coordinate = event.getBoundingClientRect()
      const tooltipCoordinate = this._tooltip.getBoundingClientRect()

      this._tooltip.style.left = coordinate.x + coordinate.width / 2 - tooltipCoordinate.width / 2 + 'px'
      this._tooltip.style.top = coordinate.y + coordinate.height + 'px'

    }

    if ( message === undefined ) this._tooltip.innerHTML = event.target.comment
    else this._tooltip.innerHTML = message

  }

  hidden(){

    this._tooltip.classList.add( 'none' )

  }




}