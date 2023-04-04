

export class Tooltip{


  #tooltip = document.querySelector( '#tooltip' )


  constructor(){}


  showTop( element, message = undefined ) {

    if ( element === undefined ) throw 'Error [Tooltip - showTop] - element is undefined'

    this.#show()

    const coordinate = element.getBoundingClientRect()
    const tooltipCoordinate = this.#tooltip.getBoundingClientRect()

    this.#tooltip.style.left = coordinate.x + coordinate.width / 2 - tooltipCoordinate.width / 2 + 'px'
    this.#tooltip.style.top = coordinate.y - 10 - coordinate.height + 'px'

    this.#addMessage( message )

  }


  showBottom( element, message = undefined ) {

    if ( element === undefined ) throw 'Error [Tooltip - showTop] - element is undefined'

    this.#show()

    const coordinate = element.getBoundingClientRect()
    const tooltipCoordinate = this.#tooltip.getBoundingClientRect()

    this.#tooltip.style.left = coordinate.x + coordinate.width / 2 - tooltipCoordinate.width / 2 + 'px'
    this.#tooltip.style.top = coordinate.y + coordinate.height + 'px'

    this.#addMessage( message )

  }

  
  show( event, message = undefined ) {

    if ( event instanceof Event === false ) throw 'Error [Tooltip - show] - event not Event'

    this.#tooltip.classList.remove( 'none' )
    this.#tooltip.style.left = event.clientX + 5 + 'px'
    this.#tooltip.style.top = event.clientY + 5 + 'px'

    this.#addMessage( message )

  }


  hidden() {

    this.#tooltip.classList.add( 'none' )

  }


  // PRIVATE --- ---
  #show() {

    this.#tooltip.classList.remove( 'none' )

  }

  #addMessage( message ) {

    if ( message === undefined ) this.#tooltip.innerHTML = event.target.comment
    else this.#tooltip.innerHTML = message

  }


}