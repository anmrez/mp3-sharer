


export class Search{

  mainSearchElement = document.querySelector( '#search' )
  inputSearch = this.mainSearchElement.querySelector( '#input' )
  tableSearch = this.mainSearchElement.querySelector( '#table' )
  resultSearch = this.mainSearchElement.querySelector( '#result' )
  

  constructor(){

    this.inputSearch.value = ''

  }


  init(){

    this._onCLick()
    this._onInput()
    this._onBlur()

  }


  // ADD EVENTS --- ---
  _onCLick(){
    this.inputSearch.addEventListener( 'click', this._eventClick.bind( this ) )
  }
  
  
  _onBlur(){
    this.inputSearch.addEventListener( 'blur', this._hiddenTable.bind( this ) );
  }
  

  _onInput(){
    this.inputSearch.addEventListener( 'input', this._eventInput.bind( this ) )
  }

  
  // EVENTS --- ---
  _eventClick(){

    if ( this.inputSearch.value !== '' ) this._showTable()

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

    const tr = document.createElement( 'tr' )
    tr.classList.add( 'text_center' )
    tr.classList.add( 'height_2' )

    const id = document.createElement( 'td' )
    id.innerHTML = item.id
    tr.append( id )
    
    const title = document.createElement( 'td' )
    if ( item.title.length > 25 ) title.innerHTML = item.title.slice(0, 25) + '...'
    else title.innerHTML = item.title
    tr.append( title )
    
    const author = document.createElement( 'td' )
    if ( item.author.length > 16 ) author.innerHTML = item.author.slice(0, 16) + '...'
    else author.innerHTML = item.author
    tr.append( author )

    const is_archived = document.createElement( 'td' )
    if ( item.is_archived === 1 ) is_archived.innerHTML = '✓'
    tr.append( is_archived )

    this.resultSearch.append( tr )

  }


  _showTable(){

    this.tableSearch.classList.remove( 'none' )

  }
  
  
  _hiddenTable(){

    this.tableSearch.classList.add( 'none' )
    
  }


}