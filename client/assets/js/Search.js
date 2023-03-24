import { KeyboardService } from './Keyboard.service.js';


export class Search{

  mainSearchElement = document.querySelector( '#search' )
  inputSearch = this.mainSearchElement.querySelector( '#input' )
  tableSearch = this.mainSearchElement.querySelector( '#table' )
  resultSearch = this.mainSearchElement.querySelector( '#result' )
  

  constructor( keyboardService ){

    if ( ! keyboardService instanceof KeyboardService ) throw 'Error [Search] - keyboardService is undefined'
    this.keyboardService = keyboardService

    this.inputSearch.value = ''

  }


  init(){

    this._onCLick()
    this._onInput()
    this._onFocus()
    this._onBlur()

  }


  // ADD EVENTS --- ---
  _onCLick(){
    document.addEventListener( 'click', this._eventClick.bind( this ) )
  }
  

  _onInput(){
    this.inputSearch.addEventListener( 'input', this._eventInput.bind( this ) )
  }


  _onFocus(){
    this.inputSearch.addEventListener( 'focus', this.keyboardService.removeKeyboardEvents.bind( this.keyboardService ) )
  }
  
  _onBlur(){
    this.inputSearch.addEventListener( 'blur', this.keyboardService.addKeyboardEvents.bind( this.keyboardService ) )
  }
  
  
  // EVENTS --- ---
  _eventClick( event ){

    let target = event.target

    // if input
    if ( target.id === 'input' && target.value !== '' ) return this._showTable()

    // if other
    while ( target.id !== 'search' ){

      // if not table
      if ( target === document.activeElement ) return this._hiddenTable()

      target = target.parentElement 

    }

  }


  async _eventInput(){

    if ( this.inputSearch.value === '' ) return this._hiddenTable()

    const response = await fetch( '/search', {
      method: 'POST',
      body: this.inputSearch.value
    } )

    const data = await response.json()
    if ( data.length === 0 ) return this._hiddenTable()

    this.resultSearch.replaceChildren()

    data.forEach( (item, index) => {

      setTimeout( this._render.bind( this ), index * 5, item )

    });

    this._showTable()

  }


  _render( item ){

    // item = { id: number, title: string, author: string, is_archived: 0 || 1 }

    if ( typeof item === 'number' ) return this._renderTotal( item )

    // create row
    const tr = document.createElement( 'tr' )
    tr.classList.add( 'text_center' )
    tr.classList.add( 'table_row' )
    tr.classList.add( 'pointer' )

    tr.addEventListener( 'click', this._renderItemClick.bind( this, tr ) )

    tr.archived = item.is_archived
    tr.soundID = item.id

    // column id
    const id = document.createElement( 'td' )
    id.innerHTML = item.id
    tr.append( id )

    // column title
    const title = document.createElement( 'td' )
    if ( item.title.length > 25 ) title.innerHTML = item.title.slice(0, 25) + '...'
    else title.innerHTML = item.title
    tr.append( title )
    
    // column author
    const author = document.createElement( 'td' )
    if ( item.author.length > 16 ) author.innerHTML = item.author.slice(0, 16) + '...'
    else author.innerHTML = item.author
    tr.append( author )

    // column is_archived
    const is_archived = document.createElement( 'td' )
    if ( item.is_archived === 1 ) is_archived.innerHTML = '✓'
    tr.append( is_archived )

    // add row into table
    this.resultSearch.append( tr )

  }


  _renderItemClick( clickRow ){

    // clickRow.soundID
    if ( clickRow.archived === 0 ) {

      // find into not archived
      console.log( 'not archived' )
      
    } else {
      
      // find into archived
      console.log( 'archived' )

    }

  }


  _renderTotal( number ){

    const tr = document.createElement( 'tr' )
    tr.classList.add( 'text_center' )
    tr.classList.add( 'table_row' )
    tr.classList.add( 'pointer' )
    
    const emptyTD = document.createElement( 'td' )
    tr.append( emptyTD )
    
    const td = document.createElement( 'td' )
    td.innerHTML = `And ${ number } more entries`
    tr.append( td )
    
    tr.append( document.createElement( 'td' ) )
    tr.append( document.createElement( 'td' ) )

    // add row into table
    this.tableSearch.append( tr )

  }



  // TABLE --- ---
  _showTable(){

    console.log( 'show' )
    this.tableSearch.classList.remove( 'none' )

  }
  
  
  _hiddenTable(){

    console.log( 'hidden' )
    this.tableSearch.classList.add( 'none' )
    
  }


}