


export class Search{

  searchInput = document.querySelector( '#search' )
  searchTable = document.querySelector( '#searchTable' )
  searchTableBody = document.querySelector( '#searchResult' )
  

  constructor(){

    console.log( this.searchTable )
    this.searchInput.value = ''

  }


  init(){

    this._onCLick()
    this._onInput()
    this._onBlur()

  }


  // ADD EVENTS --- ---
  _onCLick(){
    this.searchInput.addEventListener( 'click', this._eventClick.bind( this ) )
  }
  
  
  _onBlur(){
    this.searchInput.addEventListener( 'blur', this._hiddenTable.bind( this ) );
  }
  

  _onInput(){
    this.searchInput.addEventListener( 'input', this._eventInput.bind( this ) )
  }

  
  // EVENTS --- ---
  _eventClick(){

    if ( this.searchInput.value !== '' ) this._showTable()

  }



  async _eventInput(){

    if ( this.searchInput.value === '' ) return this._hiddenTable()

    const response = await fetch( '/search', {
      method: 'POST',
      body: this.searchInput.value
    } )

    const data = await response.json()
    if ( data.length === 0 ) return this._hiddenTable()

    this._render( data )
    this._showTable()

  }


  async _render( data ){

    this.searchTableBody.replaceChildren()
    let index = 0

    while ( index !== data.length ){

      const item = data[index]

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

      this.searchTableBody.append( tr )

      index++
    }

  }


  _showTable(){
    this.searchTable.classList.remove( 'none' )
  }
  
  
  _hiddenTable(){
    this.searchTable.classList.add( 'none' )
  }


}