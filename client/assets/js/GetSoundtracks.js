import { RenameSoundtrack } from './RenameSoundtrack.js'


export class GetSoundtracks{

  player = document.querySelector( '#player' )


  dataArray = []
  table = document.querySelector( '#tableMusick' )
  // this class added:
  // - table.update() = this.get()
  // - table.selected = soundtrack id seleccted

  sectionTable = document.querySelector( '#tableSoundtrack' )
  tableBody = this.table.querySelector( '#tableMusickBody' )

  switchButton = document.querySelector( '#switchButton' )
  switchButtonMusic = this.switchButton.querySelector( '#music' )
  switchButtonArchive = this.switchButton.querySelector( '#archive' )

  _linkOnReload

  timeoutSetList = []

  
  constructor(){

    this.table.update = this.get.bind( this )
    
  }
  
  
  init( renameSoundtrack ){
    
    if ( ! renameSoundtrack instanceof RenameSoundtrack ) throw 'Error [GetSoundtracks] - RenameSoundtrack Service is undefined'
    this.renameSoundtrackService = renameSoundtrack

    this.get()
    
    this._linkOnReload = this._eventReloadOnR.bind( this )
    this.addEventReloadOnR()
    this._addEventScrollTable()
    
    this._addEventSwitch()
    this._getUserID()
    
  }  
  
  
  _getUserID(){
    
    this.userID = document.querySelector( '#buttonUser' ).userID

  }

  // RELOAD --- ---
  addEventReloadOnR(){

    document.addEventListener( 'keyup', this._linkOnReload )

  }


  removeEventReloadOnR(){

    document.removeEventListener( 'keyup', this._linkOnReload )

  }


  _eventReloadOnR( event ){

    // R
    if ( event.keyCode === 82 ) {

      this.get()

    }

  }


  _addEventScrollTable(  ){

    this.sectionTable.addEventListener( 'scroll', function( event ) {

      const target = event.target
      if ( target.clientHeight + target.scrollTop > target.scrollHeight - 100 ) {

        if ( this.dataArray.length - this.sectionTable.lastLoadIndex <= 0 ) return;
        
        const item = this.dataArray[ this.dataArray.length - this.sectionTable.lastLoadIndex - 1 ]
        this.sectionTable.lastLoadIndex ++
        if ( ! item ) throw 'Error: item is undefined';
        this._addItem( item, this.sectionTable.lastLoadIndex )
        
      } 

    }.bind( this ) )

  }


  // SWITCH --- ---
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


  // GET SOUNDTRACKS --- ---
  async get(){

    let response

    if ( this.switchButtonArchive.classList.contains( 'switch_button_active' ) ) {
      
      response = await fetch( '/getSoundtracksInArchive', {
        method: 'GET'
      } ) 

    } else {

      response = await fetch( '/getSoundtracks', {
        method: 'GET'
      } )

    }

    if ( response.status !== 200 ) return;

    this.dataArray = []
    const responseBuffer = await response.arrayBuffer()

    let soundtracksBinary = new Uint8Array( responseBuffer )
    const decoder = new TextDecoder()

    while ( soundtracksBinary.length > 0 ){

      let HEAD = 0

      // length ID - 1 byte
      const lengthSoundID = this._decoderBynary( soundtracksBinary.slice( HEAD, HEAD + 1 ) )
      HEAD++

      // sound ID - length ID byte
      const soundID = this._decoderBynary( soundtracksBinary.slice( HEAD, HEAD + lengthSoundID ) )
      HEAD += lengthSoundID

      // duration - 2 byte
      const duration = this._decoderBynary( soundtracksBinary.slice( HEAD, HEAD + 2 ) )
      HEAD += 2

      // title - 1 byte + title length byte
      const titleLength = soundtracksBinary[HEAD]
      HEAD++
      
      const title = decoder.decode( soundtracksBinary.slice( HEAD, titleLength + HEAD ) )
      HEAD += titleLength
      
      // author - 1 byte + author length byte
      const authorLength = soundtracksBinary[HEAD]
      HEAD++
      
      const author = decoder.decode( soundtracksBinary.slice( HEAD, authorLength + HEAD ) )
      HEAD += authorLength

      // created at - 2 byte
      let createdAT = ''
      if ( soundtracksBinary[HEAD] < 10 ) createdAT = '0' + soundtracksBinary[HEAD] + '.'
      else createdAT =  soundtracksBinary[HEAD] + '.'

      if ( soundtracksBinary[HEAD + 1] < 10 ) createdAT += '0' + soundtracksBinary[HEAD + 1]
      else createdAT += soundtracksBinary[HEAD + 1]
      HEAD += 2

      // 
      soundtracksBinary = soundtracksBinary.slice( HEAD )

      this.dataArray.push({
        id: soundID,
        duration: duration,
        title: title,
        author: author,
        createdAT: createdAT
      })

    }

    if ( this.dataArray.length === 0 ) throw 'ERROR: Soundtracks not found'

    this._set()

  }





  _set(){

    this.tableBody.replaceChildren()
    this._cleatTimeoutSetList()

    let index = 1
    const length = this.dataArray.length

    while ( length + 1 > index ){

      const indexItem = length - index
      const item = this.dataArray[indexItem]
      const delay = 50 + index * 25

      const timeID = setTimeout( this._addItem.bind( this ), delay, item, index )
      this.timeoutSetList.push( timeID )

      index++

    }

  }


  _cleatTimeoutSetList(){

    this.timeoutSetList.forEach( item => {
      clearTimeout( item )
    } )

    this.timeoutSetList = []

  }


  _addItem( item, index ){

    if ( this.sectionTable.clientHeight + this.sectionTable.scrollTop < this.sectionTable.scrollHeight - 100 )return; 
    
    this.sectionTable.lastLoadIndex = index;

    const tr = document.createElement( 'tr' );

    tr.classList.add( 'table_row' )
    if ( item.id === this.table.selected ) tr.classList.add( 'td_play' )
    tr.align = 'center'
    tr.setAttribute( 'soundID', item.id )

    const tdID = this._createTDID( item )
    const tdDate = this._createTDDate( item )
    const tdDuration = this._createTDDuration( item )
    const tdPlay = this._createTDPlay( item )
    const tdTitle = this._createTDTitle( item )
    const tdAuthor = this._createTDAuthor( item )

    const arrayTDUsers = this._createTDUsers()
    arrayTDUsers.getCommets = this._eventGetCommentsInTDUsers.bind( arrayTDUsers, item )

    const delay = 40 + index * 10
    setTimeout( arrayTDUsers.getCommets, delay )

    tr.append( tdID )
    tr.append( tdDate )
    tr.append( tdDuration )
    tr.append( tdPlay )
    tr.append( tdTitle )
    tr.append( tdAuthor )


    arrayTDUsers.forEach( item => {
      tr.append( item )
    })

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

    td.innerHTML = item.createdAT

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
      const sub = item.title.substring( 0, 30 )
      td.innerHTML = sub + '...'
    } else td.innerHTML = item.title

    return td

  }


  _createTDAuthor( item ){

    const td = document.createElement( 'td' );
    td.classList.add( 'padding_x_1' )

    if ( item.author.length > 15 ) {
      const sub = item.author.substring( 0, 14 )
      td.innerHTML = sub + '...'
    } else td.innerHTML = item.author

    return td

  }


  _createTDUsers( ){

    const tdUsers = []

    let index = 1
    while ( 7 !== index ) {

      const td = document.createElement( 'td' );
      const span = document.createElement( 'span' )
      span.classList.add( 'round_status' )
      span.setAttribute( 'userID', index )

      td.append( span )
      tdUsers.push( td )

      index++

    }

    return tdUsers

  }


  async _eventGetCommentsInTDUsers( item ){

    const responseComments = await fetch( '/getComment', {
      method: 'POST',
      body: String( item.id )
    } )

    const data = await responseComments.json()
    
    let index = 0
    while( index !== this.length ){
      
      if ( data ) data.forEach( item => {
        
        const td = this[index]
        const span = td.lastChild
        
        if ( item.userID === index + 1 ) {
          
          if ( item.status === 1 ) {

            span.code = 1
            span.style.background = '#ff000077'
          
          } 

          if ( item.status === 2 ) {

            span.code = 2
            span.style.background = '#ffff0077'
          
          } 

          if ( item.status === 3 ) {

            span.code = 3
            span.style.background = '#00ff0077'

          } 

          if ( item.status === 10 ) {

            span.code = 10
            span.style.background = '#8b00ff77'

          } 

          if ( item.comment ) { 
            
            span.comment = item.comment

            // add point
            const point = document.createElement( 'span' )
            point.classList.add( 'point' )
            span.append( point )

            span.addEventListener( 'mousemove', function( event ){

              let tooltip = document.querySelector( '#tooltip' )
              let X = event.clientX
              let Y = event.clientY
              let text = event.target.comment
          
              tooltip.classList.remove( 'none' )
              tooltip.style.left = X + 'px'
              tooltip.style.top = Y + 'px'
              tooltip.innerHTML = text

            } )

            span.addEventListener( 'mouseout', function(){

              document.querySelector( '#tooltip' ).classList.add( 'none' )

            } )
  
          }

        }

        
      })

      index++

    }

  }


  _TDPlayEvent( item ){

    const id = this.player.querySelector( '#id' )
    const title = this.player.querySelector( '#title' )
    const author = this.player.querySelector( '#author' )
    const duration = this.player.querySelector( '#durationMax' )
    const soundtrack = this.player.querySelector( '#soundtrack' )
    const button = this.player.querySelector( '#button' )
    
    if ( id.innerHTML === String( item.id ) ) {

      button.click()
      return;

    }

    id.innerHTML = item.id
    player.soundID = item.id

    title.innerHTML = item.title
    player.title = item.title

    author.innerHTML = item.author
    player.author = item.author

    duration.innerHTML = this._getTime( item.duration )
    soundtrack.src = './static/mp3/' + item.id + '.mp3'

    this.table.selected = item.id
    
    // _set all 'pause'
    this.table.querySelectorAll('[sound]').forEach( item => {
      item.querySelector( '#play' ).classList.remove( 'none' )
      item.querySelector( '#pause' ).classList.add( 'none' )
    })

    // clear all highlight row
    this.table.querySelectorAll( '[soundID]' ).forEach( item => {
      item.classList.remove( 'td_play' )
    })
    
    // add highlight row
    const td = this.table.querySelector( '[soundID="' + item.id + '"]' )
    td.classList.add( 'td_play' )

    // show/hidden renameSoundtrack
    const span = td.querySelector( '[userid="' + this.userID +'"]' )
    console.log( span )
    if ( span === null ) this.renameSoundtrackService.hidden()
    if ( span.code === 10 ) this.renameSoundtrackService.show()

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


  _decoderBynary( array = [0] ) {

    const basicArray = []

    array.forEach( item => {
      basicArray.push( item )
    } )

    let result = 0
    let index = 0
    while ( index !== basicArray.length ){

      if ( index === basicArray.length - 1 ) result += basicArray[index]
      else 
        if ( basicArray[index] > 0 ) basicArray[index + 1] += basicArray[index] * 255

      index++

    }

    return result

  }


}