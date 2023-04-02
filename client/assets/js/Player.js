import { Binary } from './Binary.js';

// Player has further properties: 
// - title - soundtrack title
// - author - soundtrack author
// - soundID - soundtrack ID
// - status - soundtrack playback status (play/pause)
// - file - file
// - switch() - switch audio
// - pause() - pause audio

export class Player{

  player = document.querySelector( '#player' )
  soundtrack = this.player.querySelector( '#soundtrack' )
  soundID = this.player.querySelector( '#id' )
  duration = {
    current: this.player.querySelector( '#durationCurrent' ),
    max: this.player.querySelector( '#durationMax' )
  } 
  playButton = this.player.querySelector( '#button' )
  cover = this.player.querySelector( '#cover' )
  coverEmpty = this.player.querySelector( '#coverEmpty' )
  volumeSlider = this.player.querySelector( '#volume' )
  archiveIcon = this.player.querySelector( '#archive' )
  loadingIcon = this.player.querySelector( '#loadingIcon' )

  timeline = this.player.querySelector( '#timeline' )
  timelineParent = this.player.querySelector( '#timelineParent' )
  tooltipTimeline = this.player.querySelector( '#tooltipTimeline' )

  switchButton = document.querySelector( '#switchButton' )

  _linkOnEventOnSpace
  _linkOnEventRewind
  _linkOnEventFastForward
  
  constructor(
    binaryService
  ){
    
    if ( binaryService instanceof Binary === false ) throw '[GetSoundtracks] - binaryService not Binary'
    this.binaryService = binaryService

    this.soundtrack.volume = this.volumeSlider.value / 100
        
  }
  
  
  init(){
    
    this._addEventCurrentTime()
    this._addEventVolumeSlider()
    this._addEventTimeline()

    // play button
    this.playButton.addEventListener( 'click', this._switch.bind( this ) )
    
    // space
    this._linkOnEventOnSpace = this._eventOnSpace.bind( this )
    this.addEventOnSpace()

    // Rewind
    this._linkOnEventRewind = this._eventRewind.bind( this )
    this.addEventRewind()

    // fast forward
    this._linkOnEventFastForward = this._eventFastForward.bind( this )
    this.addEventFastForward()
    
    // time
    const time = this.soundtrack.duration
    const timeStr = this._getTime( time )

    if ( timeStr === 'NaN:NaN' ) this.duration.max.innerHTML = '00:00'
    else this.duration.max.innerHTML = timeStr

    // soundtrack listeners
    this.soundtrack.addEventListener( 'canplay', this._eventButtonPlay.bind( this ) );
    this.soundtrack.addEventListener( 'loadeddata', this._renderCover.bind( this ) );
    this.soundtrack.addEventListener( 'play', this._eventButtonPlay.bind( this ) )
    this.soundtrack.addEventListener( 'pause', this._eventButtonPause.bind( this ) )
    this.soundtrack.addEventListener( 'ended', this._eventButtonPause.bind( this ) )
    this.player.switch = this._switch.bind( this )
    this.player.pause = this._eventButtonPause.bind( this )

  }


  // STOP / SPACE === ===
  addEventOnSpace() { document.addEventListener( 'keyup', this._linkOnEventOnSpace ) }

  removeEventOnSpace() { document.removeEventListener( 'keyup', this._linkOnEventOnSpace ) }

  _eventOnSpace( event ) { if ( event.keyCode === 32 ) this._switch() }


  // REWIND === ===
  addEventRewind(){ document.addEventListener( 'keyup', this._linkOnEventRewind ) }
  
  removeEventRewind(){ document.removeEventListener( 'keyup', this._linkOnEventRewind ) }

  _eventRewind( event ){

    if ( event.keyCode === 37 ){
      this._rewind() 
      this._eventCurrentTime()
    } 

  }

  _rewind(){

    if ( this.soundtrack.currentTime < 10 ) this.soundtrack.currentTime = 0
    else this.soundtrack.currentTime -= 10

  }


  // FAST FORWARD === ===
  addEventFastForward(){

    document.addEventListener( 'keyup', this._linkOnEventFastForward )
    
  }
  
  
  removeEventFastForward(){
    
    document.removeEventListener( 'keyup', this._linkOnEventFastForward )

  }


  _eventFastForward( event ){

    if ( event.keyCode === 39 ) {
      this._fastForward()
      this._eventCurrentTime()
    } 

  }


  _fastForward(){

    if ( this.soundtrack.duration < this.soundtrack.currentTime + 10 ) 
      this.soundtrack.currentTime = this.soundtrack.duration
    else this.soundtrack.currentTime += 10

  }


  // BUTTON PLAY --- ---
  _eventButtonPlay(){

    this.loadingIcon.classList.add( 'none' )
    this.archiveIcon.classList.add( 'none' )

    this.player.status = 'play'
    this.playButton.status = 'play'
    this.soundtrack.play()

    if ( this.switchButton.status === 'music' ) {

      this.cover.classList.remove( 'none' )
      this.coverEmpty.classList.add( 'none' )

    }

    this.playButton.querySelector( '#play' ).classList.add( 'none' )
    this.playButton.querySelector( '#pause' ).classList.remove( 'none' )

    // into table
    const bouttonIntoTable = document.querySelector( `[sound="${this.player.soundID}"]` )   
    const playIntoTable = bouttonIntoTable.querySelector( '#play' )
    const pauseIntoTable = bouttonIntoTable.querySelector( '#pause' )

    playIntoTable.classList.add( 'none' )
    pauseIntoTable.classList.remove( 'none' )
    
  }
  
  
  _eventButtonPause(){
    
    this.player.status = 'pause'
    this.playButton.status = 'pause'
    this.soundtrack.pause()

    if ( this.switchButton.status === 'archive' ) return;

    this.playButton.querySelector( '#play' ).classList.remove( 'none' )
    this.playButton.querySelector( '#pause' ).classList.add( 'none' )

    // into table
    const buttonIntoTable = document.querySelector( `[sound="${this.player.soundID}"]` )   
    const playIntoTable = buttonIntoTable.querySelector( '#play' )
    const pauseIntoTable = buttonIntoTable.querySelector( '#pause' )

    playIntoTable.classList.remove( 'none' )
    pauseIntoTable.classList.add( 'none' )

  }


  // UPDATE TIME INTO PLAYER --- ---
  _addEventCurrentTime(){ setInterval( this._eventCurrentTime.bind( this ), 500 ) }


  _eventCurrentTime(){

    const time = this.soundtrack.currentTime
    this.duration.current.innerHTML = this._getTime( time )

  }


  // VOLUME SLIDER --- ---
  _addEventVolumeSlider(){ this.volumeSlider.addEventListener( 'input', this._eventVolumeSlider.bind( this ) ) }


  _eventVolumeSlider(){ this.soundtrack.volume = this.volumeSlider.value / 100 }


  // TIMELINE --- ---
  _addEventTimeline(){

    setInterval( this._eventTimeline.bind( this ), 100 )

    this.timelineParent.addEventListener( 'mousemove', this._eventTimelineMove.bind( this ) )
    this.timelineParent.addEventListener( 'mouseout', this._eventTimelineOut.bind( this ) )
    this.timelineParent.addEventListener( 'click', this._eventTimelineClick.bind( this ) )

    
  }
  
  _eventTimeline(  ) {
    
    const duration = this.soundtrack.duration
    const currentTime = this.soundtrack.currentTime

    this.timeline.style.width = currentTime * 100 / duration + '%'

  }


  _eventTimelineMove( event ) {

    this.tooltipTimeline.classList.remove( 'none' )

    const maxWidth = this.timelineParent.clientWidth
    const currentWidth = event.clientX

    const width = currentWidth * 100 / maxWidth
    this.tooltipTimeline.style.left = width + '%'

    const duration = this.soundtrack.duration
    const time = duration * width / 100
    this.tooltipTimeline.innerHTML = this._getTime( time )
    this.tooltipTimeline.time = time

  }


  _eventTimelineOut(  ){ 

    this.tooltipTimeline.classList.add( 'none' ) 

  }


  _eventTimelineClick() {
    const time = this.tooltipTimeline.time
    this.soundtrack.currentTime = time
  }


  // RENDER COVER --- ---
  async _renderCover() {
    
    const key = 'cover:' + this.player.soundID
    const coverFromStorage = sessionStorage.getItem( key )

    if ( coverFromStorage !== null ) {
      
      // url rewrite in new variable
      const ulr = coverFromStorage
      // cover load into player
      this.cover.src = ulr
      return;

    }

    const soundtrackBuffer = await this.player.file.arrayBuffer()
    const soundtrack = new Uint8Array( soundtrackBuffer )
    
    const cover = this.binaryService.readCoverInSoundtrack.apply( this, [soundtrack] )
    const ulr =  URL.createObjectURL( cover )

    // cover save into sessionStorage
    sessionStorage.setItem( key, ulr );
    // cover load into player
    this.cover.src = ulr

  }


  // OTHER --- ---
  _getTime( totalSecond ) {

    totalSecond = Math.floor( totalSecond )

    let minute = 0
    let second = 0

    minute = Math.floor( totalSecond / 60 )
    second = totalSecond - 60 * minute

    if ( second < 10 ) second = '0' + second
    if ( minute < 10 ) minute = '0' + minute

    return minute + ':' + second

  }


  _switch() { 

    if ( this.soundtrack.paused ) this.soundtrack.play()
    else this.soundtrack.pause()

  }


}