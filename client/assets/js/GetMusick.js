

export class GetMusick{

  dataArray = []
  table = document.querySelector( '#tableMusick' )
  tableBody = document.querySelector( '#tableMusickBody' )

  switchButton = document.querySelector( '#switchButton' )
  switchButtonMusic = switchButton.querySelector( '#music' )
  switchButtonArchive = switchButton.querySelector( '#archive' )

  linkOnReload

  constructor(){

    this.table.update = this.get.bind( this )

  }


  init(){

    this.get()
    
    this.linkOnReload = this._eventReloadOnR.bind( this )
    this.addEventReloadOnR()

    this._addEventSwitch()

  }


  // RELOAD === ===
  addEventReloadOnR(){

    document.addEventListener( 'keyup', this.linkOnReload )

  }


  removeEventReloadOnR(){

    document.removeEventListener( 'keyup', this.linkOnReload )

  }


  _eventReloadOnR( event ){

    if ( event.keyCode === 82 ){

      this.get()

    }

  }


  // SWITCH === ===
  _addEventSwitch(){

    this.switchButtonMusic.addEventListener( 'click', 
      this._eventSwitch.bind( this, this.switchButtonMusic, this.switchButtonArchive ) 
    )

    this.switchButtonArchive.addEventListener( 'click', 
      this._eventSwitch.bind( this, this.switchButtonArchive, this.switchButtonMusic ) 
    )

  }

  _eventSwitch( button, reverceButton ){

    button.classList.add( 'switch_button_active' )
    reverceButton.classList.remove( 'switch_button_active' )
    this.get()

  }


  // GET DATA
  async get(){

    let response

    if ( this.switchButtonArchive.classList.contains( 'switch_button_active' ) ) {
      
      response = await fetch( '/getSoundsInArchive', {
        method: 'GET'
      } ) 

    } else {

      response = await fetch( '/getSounds', {
        method: 'GET'
      } )

    }

    this.dataArray = await response.json()

    if ( this.dataArray.length === 0 ) {
      console.log( 'Soundtracks not found' )
      return;
    }

    this.set()

  }


  set(){

    this.tableBody.replaceChildren()

    let index = 1
    const length = this.dataArray.length

    while ( length + 1 > index ){

      const indexItem = length - index
      const item = this.dataArray[indexItem]
      const delay = 50 + index * 30

      setTimeout( this._addItem.bind( this ), delay, item )

      index++

    }


  }


  async _addItem( item ){


    const tr = document.createElement( 'tr' );

    tr.classList.add( 'table_row' )
    tr.align = 'center'
    tr.setAttribute( 'soundID', item.id )

    const tdID = this._createTDID( item )
    const tdDate = this._createTDDate( item )
    const tdDuration = this._createTDDuration( item )
    const tdPlay = this._createTDPlay( item )
    const tdTitle = this._createTDTitle( item )
    const tdAuthor = this._createTDAuthor( item )
    const arrayTDUsers = await this._createTDUsers( item )

    tr.append( tdID )
    tr.append( tdDate )
    tr.append( tdDuration )
    tr.append( tdPlay )
    tr.append( tdTitle )
    tr.append( tdAuthor )


    arrayTDUsers.forEach( item => {
      tr.append( item )
    })

    // table.append( tr )
    this.tableBody.append( tr )

  }


  _createTDID( item ){

    const td = document.createElement( 'td' );

    td.innerHTML = item.id

    td.classList.add( 'padding_x_1' )
    td.classList.add( 'text_0_75' )
    td.classList.add( 'color_dark' )

    return td

  }


  _createTDDate( item ){

    const td = document.createElement( 'td' );

    td.innerHTML = item.createdAt

    return td

  }
  

  _createTDDuration( item ){

    const td = document.createElement( 'td' );

    let minute = Math.floor( item.duration / 60 )
    let sercond = item.duration - minute * 60

    if ( minute.toString().length === 1 ) minute = '0' + minute
    if ( sercond.toString().length === 1 ) sercond = '0' + sercond


    td.innerHTML = minute + ':' + sercond

    return td

  }


  _createTDPlay( item ){

    const td = document.createElement( 'td' );
    td.classList.add( 'pointer' )
    td.classList.add( 'fill_pink' )
    td.setAttribute( 'sound', item.id )
    td.status = 'pause'

    td.addEventListener( 'click', this._TDPlayEvent.bind( this, item ) )

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute( 'height', '14px' )
    svg.setAttribute( 'width', '14px' )
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute( 'd', 'M0 0 L14 7 L0 14' )
    path.id = 'play'

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.classList.add( 'none' )
    g.id = 'pause'

    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line1.setAttribute( 'x1', '3' )
    line1.setAttribute( 'y1', '0' )
    line1.setAttribute( 'x2', '3' )
    line1.setAttribute( 'y2', '14' )
    line1.setAttribute( 'stroke-width', '2' )
    
    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line2.setAttribute( 'x1', '11' )
    line2.setAttribute( 'y1', '0' )
    line2.setAttribute( 'x2', '11' )
    line2.setAttribute( 'y2', '14' )
    line2.setAttribute( 'stroke-width', '2' )

    g.append( line1 )
    g.append( line2 )

    svg.append( path )
    svg.append( g )

    td.append( svg )
    return td

  }


  _createTDTitle( item ){

    const td = document.createElement( 'td' );

    td.classList.add( 'padding_x_1' )

    if ( item.title.length > 30 ) {

      let sub = item.title.substring( 0, 30 )
      td.innerHTML = sub + '...'
      return td
      
    }
    
    td.innerHTML = item.title
    return td

  }


  _createTDAuthor( item ){

    const td = document.createElement( 'td' );

    td.classList.add( 'padding_x_1' )
    td.innerHTML = item.author

    return td

  }


  async _createTDUsers( item ){

    let tdUsers = []

    const responseComments = await fetch( '/getComment', {
      method: 'POST',
      body: item.id + ''
    } )

    const data = await responseComments.json()

    let index = 1
    while ( 7 !== index ) {

      const td = document.createElement( 'td' );
      const span = document.createElement( 'span' )
      span.classList.add( 'round_status' )

      if ( data ) data.forEach( item => {
        
        if ( item.userID === index ) {

          if ( item.status === 1 ) span.style.background = '#ff000077'
          if ( item.status === 2 ) span.style.background = '#ffff0077'
          if ( item.status === 3 ) span.style.background = '#00ff0077'
          if ( item.status === 10 ) span.style.background = '#8b00ff77'
          if ( item.comment ) { 
  
            span.text = item.comment
            span.addEventListener( 'mousemove', this._addStatusHover )
            span.addEventListener( 'mouseout', this._addStatusOut )
  
          }

        }
  
      })

      td.append( span )
      tdUsers.push( td )

      index++

    }

    return tdUsers

  }


  _addStatusHover( event ) {

    let tooltip = document.querySelector( '#tooltip' )
    let X = event.clientX
    let Y = event.clientY
    let text = event.target.text

    tooltip.classList.remove( 'none' )
    tooltip.style.left = X + 'px'
    tooltip.style.top = Y + 'px'
    tooltip.innerHTML = text

  }


  _addStatusOut(){

    document.querySelector( '#tooltip' ).classList.add( 'none' )

  }


  _TDPlayEvent( item ){

    const player = document.querySelector( '#player' )
    const id = player.querySelector( '#id' )
    const title = player.querySelector( '#title' )
    const author = player.querySelector( '#author' )
    const duration = player.querySelector( '#durationMax' )
    const soundtrack = player.querySelector( '#soundtrack' )
    const button = player.querySelector( '#button' )
    
    if ( id.innerHTML === String( item.id ) ) {

      button.click()
      return;

    }
    
    id.innerHTML = item.id
    title.innerHTML = item.title
    author.innerHTML = item.author
    duration.innerHTML = this._getTime( item.duration )
    soundtrack.src = './static/mp3/' + item.id + '.mp3'


    
    
    const table = document.querySelector( '#tableMusick' )
    
    // set all 'pause'
    table.querySelectorAll('[sound]').forEach( item => {
      item.querySelector( '#play' ).classList.remove( 'none' )
      item.querySelector( '#pause' ).classList.add( 'none' )
    })

    // clear all highlight row
    table.querySelectorAll( '[soundID]' ).forEach( item => {
      item.classList.remove( 'td_play' )
    })
    
    // add highlight row
    const td = table.querySelector( '[soundID="' + item.id + '"]' )
    td.classList.add( 'td_play' )


  }


  _getTime( totalSecond ){

    totalSecond = Math.floor( totalSecond )

    let minute = 0
    let second = 0

    minute = Math.floor( totalSecond / 60 )
    second = totalSecond - 60 * minute

    if ( second < 10 ) second = '0' + second
    if ( minute < 10 ) minute = '0' + minute

    return minute + ':' + second

  }


}