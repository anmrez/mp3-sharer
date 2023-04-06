import { RenameSoundtrack } from './RenameSoundtrack.js'
import { Binary } from './Binary.js';
import { Tooltip } from './Tooltip.js';


export class GetSoundtracks{

  #player = document.querySelector( '#player' )
  #playerElements = {
    id: this.#player.querySelector( '#id' ),
    title: this.#player.querySelector( '#title' ),
    author: this.#player.querySelector( '#author' ),
    duration: this.#player.querySelector( '#durationMax' ),
    soundtrack: this.#player.querySelector( '#soundtrack' ),
    button: this.#player.querySelector( '#button' ),
  }

  #listSoundtracks = new Map()
  #sectionTable = document.querySelector( '#tableSoundtrack' )
  #table = document.querySelector( '#tableMusick' )
  // this class added:
  // - table.update() = this.get()
  // - table.selected = soundtrack id seleccted
  #tableBody = this.#table.querySelector( '#tableMusickBody' )

  #switchButton = document.querySelector( '#switchButton' )
  // status - status table music/archive
  // archive() - choose archive
  // music() - choose music
  #switchButtonMusic = this.#switchButton.querySelector( '#music' )
  #switchButtonArchive = this.#switchButton.querySelector( '#archive' )

  #linkOnReload

  #timeoutList = new Map()

  
  constructor(
    binaryService,
    tooltip
  ){

    if ( binaryService instanceof Binary === false ) throw '[GetSoundtracks] - binaryService not Binary'
    this.binaryService = binaryService

    if ( tooltip instanceof Tooltip === false ) throw 'Error [GetSoundtracks] - tooltip not Tooltip'
    this.tooltip = tooltip

    this.#table.update = this.get.bind( this )
    
  }
  
  
  init( renameSoundtrack ) {
    
    if ( renameSoundtrack instanceof RenameSoundtrack === false ) throw 'Error [GetSoundtracks] - RenameSoundtrack Service not RenameSoundtrack'
    this.renameSoundtrackService = renameSoundtrack

    this.get()
    
    this.#linkOnReload = this.#eventReloadOnR.bind( this )
    this.addEventReloadOnR()
    this.#addEventScrollTable()
    
    this.#getUserID()
    
    this.#switchButton.status = 'music'
    this.#addEventSwitch()
   
  }  
  
  
  #getUserID() {
    
    this.userID = document.querySelector( '#buttonUser' ).userID
    if ( this.userID === undefined ) setTimeout( this.#getUserID.bind( this ), 1000 )

  }

  // RELOAD --- ---
  addEventReloadOnR() {

    document.addEventListener( 'keyup', this.#linkOnReload )

  }


  removeEventReloadOnR() {

    document.removeEventListener( 'keyup', this.#linkOnReload )

  }


  #eventReloadOnR( event ) {

    // R
    if ( event.keyCode === 82 ) {

      this.get()

    }

  }


  // SCROLL --- ---
  #addEventScrollTable() {

    this.#sectionTable.addEventListener( 'scroll', function( event ) {

      const target = event.target
      if ( target.clientHeight + target.scrollTop > target.scrollHeight - 100 ) {

        if ( ! this.#listSoundtracks.has( this.#sectionTable.nextSoundtrack ) ) {

          this.#sectionTable.nextSoundtrack--
          return;

        } 

        const soundID = this.#sectionTable.nextSoundtrack
        const nextSoundtrack = this.#listSoundtracks.get( soundID )
        nextSoundtrack.id = soundID

        if ( ! this.#timeoutList.has( soundID ) ) {
          const timeID = setTimeout( this.#addItem.bind( this ), 20, nextSoundtrack, soundID )
          this.#timeoutList.set( soundID, timeID )
        }
        
      } 

    }.bind( this ) )

  }


  // SWITCH --- ---
  #addEventSwitch() {

    this.#switchButton.music = this.#eventSwitch.bind( this, this.#switchButtonMusic, this.#switchButtonArchive, 'music' )
    this.#switchButton.archive = this.#eventSwitch.bind( this, this.#switchButtonArchive, this.#switchButtonMusic, 'archive' )

    this.#switchButtonMusic.addEventListener( 'click', this.#switchButton.music.bind( this ) )
    this.#switchButtonArchive.addEventListener( 'click', this.#switchButton.archive.bind( this ) )

  }


  #eventSwitch( button, reverceButton, status ) {

    this.#switchButton.status = status
    button.classList.add( 'switch_button_active' )
    reverceButton.classList.remove( 'switch_button_active' )
    this.get()

  }


  // GET SOUNDTRACKS --- ---
  async get() {

    let response

    if ( this.#switchButtonArchive.classList.contains( 'switch_button_active' ) ) {
      
      response = await fetch( '/getSoundtracksInArchive', {
        method: 'GET'
      } ) 

    } else {

      response = await fetch( '/getSoundtracks', {
        method: 'GET'
      } )

    }

    if ( response.status !== 200 ) return;

    const responseBuffer = await response.arrayBuffer()

    const soundtracksBinary = new Uint8Array( responseBuffer )
    this.#listSoundtracks = this.binaryService.decodeArraySoundtracks( soundtracksBinary )

    if ( this.#listSoundtracks.size === 0 ) throw 'ERROR: Soundtracks not found'

    this.#set()

  }


  #set() {

    this.#tableBody.replaceChildren()
    this.#clearTimeouList()
    this.#sectionTable.nextSoundtrack = undefined

    const iterator = this.#listSoundtracks.keys()

    const keysArray = []
    for ( const key of iterator ) keysArray.push( key )
    
    let timeIndex = 1
    let index = 1

    while( index !== keysArray.length + 1 && index !== 20 ) {

      const soundID = keysArray[ keysArray.length - index]
      const dataSoundtrack = this.#listSoundtracks.get( soundID )
      dataSoundtrack.id = soundID
      const delay = timeIndex * 20

      const timeID = setTimeout( this.#addItem.bind( this ), delay, dataSoundtrack, soundID )
      this.#timeoutList.set( soundID, timeID )

      index++
      timeIndex++

    }

  }


  #clearTimeouList() {

    const iterator = this.#timeoutList.values()
    for ( const value of iterator ) clearTimeout( value ) 
    
    this.#timeoutList = new Map()

  }


  #addItem( soundtrack ) {
   
    this.#sectionTable.nextSoundtrack = soundtrack.id - 1;

    const tr = document.createElement( 'tr' );

    tr.classList.add( 'table_row' )
    if ( soundtrack.id === this.#table.selected ) tr.classList.add( 'td_play' )
    tr.align = 'center'
    tr.setAttribute( 'soundID', soundtrack.id )

    const tdID = this.#createTDID( soundtrack )
    const tdDate = this.#createTDDate( soundtrack )
    const tdDuration = this.#createTDDuration( soundtrack )

    let tdShow, tdPlay
    if ( this.#switchButton.status === 'archive' ) tdShow = this.#createTDShow( soundtrack )
    else tdPlay = this.#createTDPlay( soundtrack )

    const tdTitle = this.#createTDTitle( soundtrack )
    const tdAuthor = this.#createTDAuthor( soundtrack )

    const arrayTDUsers = this.#createTDUsers()
    arrayTDUsers.getCommets = this._eventGetCommentsInTDUsers.bind( arrayTDUsers, soundtrack, this.tooltip )

    setTimeout( arrayTDUsers.getCommets, 70 )

    tr.append( tdID )
    tr.append( tdDate )
    tr.append( tdDuration )
    if ( tdPlay !== undefined ) tr.append( tdPlay )
    if ( tdShow !== undefined ) tr.append( tdShow )

    tr.append( tdTitle )
    tr.append( tdAuthor )


    arrayTDUsers.forEach( soundtrack => {
      tr.append( soundtrack )
    })

    this.#tableBody.append( tr )

  }


  // CREATE TD --- ---
  #createTDID( soundtrack ) {

    const td = document.createElement( 'td' );

    td.innerHTML = soundtrack.id

    td.classList.add( 'padding_x_1' )
    td.classList.add( 'text_0_75' )
    td.classList.add( 'color_dark' )

    return td

  }


  #createTDDate( soundtrack ) {

    const td = document.createElement( 'td' );

    td.innerHTML = soundtrack.createdAT

    return td

  }
  

  #createTDDuration( soundtrack ) {

    const td = document.createElement( 'td' );

    let minute = Math.floor( soundtrack.duration / 60 )
    let sercond = soundtrack.duration - minute * 60

    if ( minute.toString().length === 1 ) minute = '0' + minute
    if ( sercond.toString().length === 1 ) sercond = '0' + sercond


    td.innerHTML = minute + ':' + sercond

    return td

  }


  #createTDShow( soundtrack ) {

    const td = document.createElement( 'td' );
    td.classList.add( 'pointer' )
    td.classList.add( 'fill_pink' )
    td.setAttribute( 'sound', soundtrack.id )
    td.addEventListener( 'click', this.#TDShowEvent.bind( this, soundtrack ) )

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute( 'height', '14px' )
    svg.setAttribute( 'width', '14px' )
    svg.setAttribute( 'viewBox', '0 0 24 24' )
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute( 'd', 'M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z' )

    svg.append( path )
    td.append( svg )
    return td

  }


  #createTDPlay( soundtrack ) {

    const td = document.createElement( 'td' );
    td.classList.add( 'pointer' )
    td.classList.add( 'fill_pink' )
    td.setAttribute( 'sound', soundtrack.id )
    td.status = 'pause'

    td.addEventListener( 'click', this.#TDPlayEvent.bind( this, soundtrack ) )

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute( 'height', '14px' )
    svg.setAttribute( 'width', '14px' )
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute( 'd', 'M0 0 L14 7 L0 14' )
    path.id = 'play'

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
    group.classList.add( 'none' )
    group.id = 'pause'

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

    group.append( line1 )
    group.append( line2 )

    svg.append( path )
    svg.append( group )

    td.append( svg )
    return td

  }


  #createTDTitle( soundtrack ) {

    const td = document.createElement( 'td' );
    td.classList.add( 'padding_x_1' )

    if ( soundtrack.title.length > 30 ) {
      const sub = soundtrack.title.substring( 0, 30 )
      td.innerHTML = sub + '...'
    } else td.innerHTML = soundtrack.title

    return td

  }


  #createTDAuthor( soundtrack ) {

    const td = document.createElement( 'td' );
    td.classList.add( 'padding_x_1' )

    if ( soundtrack.author.length > 15 ) {
      const sub = soundtrack.author.substring( 0, 14 )
      td.innerHTML = sub + '...'
    } else td.innerHTML = soundtrack.author

    return td

  }


  #createTDUsers( ) {

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


  // EVENTS --- ---
  async _eventGetCommentsInTDUsers( soundtrack, tooltip ) {

    const responseComments = await fetch( '/getComment', {
      method: 'POST',
      body: String( soundtrack.id )
    } )

    const data = await responseComments.json()
    
    let index = 0
    while( index !== this.length ) {
      
      if ( data ) data.forEach( soundtrack => {
        
        const td = this[index]
        const span = td.lastChild
        
        if ( soundtrack.userID === index + 1 ) {
          
          if ( soundtrack.status === 1 ) {

            span.code = 1
            span.style.background = '#ff000077'
          
          } 

          if ( soundtrack.status === 2 ) {

            span.code = 2
            span.style.background = '#ffff0077'
          
          } 

          if ( soundtrack.status === 3 ) {

            span.code = 3
            span.style.background = '#00ff0077'

          } 

          if ( soundtrack.status === 10 ) {

            span.code = 10
            span.style.background = '#8b00ff77'

          } 

          if ( soundtrack.comment ) { 
            
            span.comment = soundtrack.comment

            // add point
            const point = document.createElement( 'span' )
            point.classList.add( 'point' )
            span.append( point )

            span.addEventListener( 'mousemove', tooltip.show.bind( tooltip ) )
            span.addEventListener( 'mouseout', tooltip.hidden.bind( tooltip ) )
  
          }

        }

        
      })

      index++

    }

  }


  #TDShowEvent( soundtrack ) {

    this.#player.pause()

    // hidden icons
    this.#player.querySelector( '#loadingIcon' ).classList.add( 'none' )
    this.#player.querySelector( '#play' ).classList.add( 'none' )
    this.#player.querySelector( '#pause' ).classList.add( 'none' )

    // hidden cover
    this.#player.querySelector( '#cover' ).classList.add( 'none' )
    this.#player.querySelector( '#coverEmpty' ).classList.add( 'none' )
    
    // show icon archive
    this.#player.querySelector( '#archive' ).classList.remove( 'none' )

    this.#writingDataIntoPlayer( undefined, undefined, soundtrack )

    // update table data
    this.#table.selected = soundtrack.id
    this.#addHighlightInTable( soundtrack.id )

  }


  async #TDPlayEvent( soundtrack ) {

    if ( this.#player.soundID === soundtrack.id ) {

      this.#player.switch()
      return;

    } 

    this.#player.querySelector( '#loadingIcon' ).classList.remove( 'none' )
    this.#player.querySelector( '#play' ).classList.add( 'none' )
    this.#player.querySelector( '#pause' ).classList.add( 'none' )
    this.#player.querySelector( '#archive' ).classList.add( 'none' )


    const key = 'soundtrack:' + soundtrack.id
    let mp3 = undefined
    let blobURL = undefined
    const soundFromStorage = sessionStorage.getItem( key )

    if ( soundFromStorage !== null ) blobURL = soundFromStorage
    else {


      const response = await fetch( 'static/mp3/' + soundtrack.id + '.mp3', {
        method: 'GET'
      } )
  
      if ( response.status !== 200 ) throw 'Sound undefined'

      this.#player.querySelector( '#archive' ).classList.add( 'none' )
      const mp3Buffer = await response.arrayBuffer()
      mp3 = new File( [mp3Buffer], soundtrack.author + ' – ' + soundtrack.title + '.mp3', { type: 'audio/mpeg' } )
      blobURL = URL.createObjectURL( mp3 )
      sessionStorage.setItem( key, blobURL )

    }

    this.#writingDataIntoPlayer( mp3, blobURL, soundtrack )
    this.#resetAllButtonsIntoTable()
    this.#changeButtonPlayIntoTable( soundtrack.id )

    // update table data
    this.#table.selected = soundtrack.id

    this.#addHighlightInTable( soundtrack.id )

  }


  // OTHER --- ---
  #resetAllButtonsIntoTable() {

    this.#table.querySelectorAll('[sound]').forEach( soundtrack => {

      soundtrack.querySelector( '#play' ).classList.remove( 'none' )
      soundtrack.querySelector( '#pause' ).classList.add( 'none' )

    })

  }


  #changeButtonPlayIntoTable( soundID ) {

    if ( ! soundID ) throw 'ERROR - soundID in undefined'

    if ( Number( this.#player.soundID ) !== soundID ) {

      const row = this.#table.querySelector('[soundid="' + soundID + '"]')
      row.querySelector( '#play' ).classList.add( 'none' )
      row.querySelector( '#pause' ).classList.remove( 'none' )

    } 

  }


  #addHighlightInTable( soundID ) {

    if ( ! soundID ) throw 'ERROR - soundID in undefined'

    // clear all highlight row into table
    this.#table.querySelectorAll( '[soundID]' ).forEach( soundtrack => {
      soundtrack.classList.remove( 'td_play' )
    })
    
    // add highlight row into table
    const row = this.#table.querySelector( '[soundID="' + soundID + '"]' )
    row.classList.add( 'td_play' )

    // block/unblock rename button
    const span = row.querySelector( '[userid="' + this.userID +'"]' )
    if ( span.code === 10 ) this.renameSoundtrackService.unblock()
    else this.renameSoundtrackService.block()

  }


  #writingDataIntoPlayer( mp3File, blobURL, soundtrack ) {

    if ( mp3File !== undefined ) this.#player.file = mp3File
    if ( blobURL !== undefined ) this.#playerElements.soundtrack.src = blobURL

    this.#playerElements.id.innerHTML = soundtrack.id
    this.#playerElements.title.innerHTML = soundtrack.title
    this.#playerElements.author.innerHTML = soundtrack.author
    this.#playerElements.duration.innerHTML = this.#getTime( soundtrack.duration )

    this.#player.soundID = soundtrack.id
    this.#player.title = soundtrack.title
    this.#player.author = soundtrack.author

  }


  #getTime( totalSecond ) {

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