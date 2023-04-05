import { Tooltip } from './Tooltip.js';


export class Download {

  #tooltip
  #download = document.createElement( 'a' )
  
  #player = document.querySelector( '#player' )
  #buttonDownload = this.#player.querySelector( '#download' )
  

  constructor( tooltip ) {

    if ( tooltip instanceof Tooltip === false ) throw 'Error [Download] - tooltip not Tooltip'
    this.#tooltip = tooltip

  }


  init() {
    
    this.#addEventClick()
    this.#addEventTooltip()

  }


  #addEventClick() {

    this.#buttonDownload.addEventListener( 'click', this.#eventClick.bind( this ) )

  }


  #addEventTooltip() {

    const tooltipShow = this.#tooltip.showTop.bind( this.#tooltip, this.#buttonDownload, 'Download soundtrack' )
    this.#buttonDownload.addEventListener( 'mousemove', tooltipShow )

    this.#buttonDownload.addEventListener( 'mouseout', this.#tooltip.hidden.bind( this.#tooltip ) )

  }


  #eventClick() {

    const title = this.#player.title
    const author = this.#player.author
    const soundtrack = this.#player.querySelector( '#soundtrack' )
    
    this.#download.setAttribute( 'href', soundtrack.src )
    this.#download.setAttribute( 'download', author + ' – ' + title + '.mp3' )
    this.#download.click()

  }


}