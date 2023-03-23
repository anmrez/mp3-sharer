// Player has further properties: 
// - title - soundtrack title
// - author - soundtrack author
// - soundID - soundtrack ID
// - status - soundtrack playback status (play/pause)

export class Player{

  player = document.querySelector( '#player' )
  soundtrack = this.player.querySelector( '#soundtrack' )
  soundID = this.player.querySelector( '#id' )
  duration = {
    current: this.player.querySelector( '#durationCurrent' ),
    max: this.player.querySelector( '#durationMax' )
  } 
  playButton = this.player.querySelector( '#button' )
  volumeSlider = this.player.querySelector( '#volume' )

  timeline = this.player.querySelector( '#timeline' )
  timelineParent = this.player.querySelector( '#timelineParent' )
  tooltipTimeline = this.player.querySelector( '#tooltipTimeline' )

  _linkOnEventOnSpace
  _linkOnEventRewind
  _linkOnEventFastForward
  
  constructor(){
    
    this.soundtrack.volume = this.volumeSlider.value / 100
        
  }
  
  
  init(){
    
    this._addEventButton()
    this._addEventCurrentTime()
    this._addEventVolumeSlider()
    this._addEventTimeline()

    
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

    // soundtrack loaded
    this.soundtrack.addEventListener( 'loadeddata', this._eventButtonPlay.bind( this ) );

  }


  // STOP / SPACE === ===
  addEventOnSpace() { document.addEventListener( 'keyup', this._linkOnEventOnSpace ) }

  removeEventOnSpace() { document.removeEventListener( 'keyup', this._linkOnEventOnSpace ) }

  _eventOnSpace( event ) { if ( event.keyCode === 32 ) this._eventButtonClick() }


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


  // BUTTON PLAY === ===
  _addEventButton(){

    this.playButton.status = 'pause'
    this.playButton.play = this._eventButtonPlay.bind( this )
    this.playButton.pause = this._eventButtonPause.bind( this )

    this.playButton.addEventListener( 'click', this._eventButtonClick.bind( this ) )

  }


  _eventButtonClick(){

    this.player.soundID = this.soundID.innerHTML

    const bouttonIntoTable = document.querySelector( `[sound="${this.player.soundID}"]` )   
    const playIntoTable = bouttonIntoTable.querySelector( '#play' )
    const pauseIntoTable = bouttonIntoTable.querySelector( '#pause' )
    

    if ( this.playButton.status === 'pause' ) {
      
      this.playButton.status = 'play'
      this.playButton.play()
      
      playIntoTable.classList.add( 'none' )
      pauseIntoTable.classList.remove( 'none' )
      
    } else {
      
      this.playButton.status = 'pause'
      this.playButton.pause()

      playIntoTable.classList.remove( 'none' )
      pauseIntoTable.classList.add( 'none' )


    }

  }


  _eventButtonPlay(){

    this.player.status = 'play'
    this.playButton.status = 'play'
    this.soundtrack.play()

    this.playButton.querySelector( '#play' ).classList.add( 'none' )
    this.playButton.querySelector( '#pause' ).classList.remove( 'none' )
    
  }
  
  
  _eventButtonPause(){
    
    this.player.status = 'pause'
    this.playButton.status = 'pause'
    this.soundtrack.pause()

    this.playButton.querySelector( '#play' ).classList.remove( 'none' )
    this.playButton.querySelector( '#pause' ).classList.add( 'none' )

  }


  _addEventCurrentTime(){ setInterval( this._eventCurrentTime.bind( this ), 500 ) }


  _eventCurrentTime(){

    const time = this.soundtrack.currentTime
    this.duration.current.innerHTML = this._getTime( time )

  }


  _addEventVolumeSlider(){ this.volumeSlider.addEventListener( 'input', this._eventVolumeSlider.bind( this ) ) }


  _eventVolumeSlider(){ this.soundtrack.volume = this.volumeSlider.value / 100 }


  _addEventTimeline(){

    setInterval( this._eventTimeline.bind( this ), 100 )

    this.timelineParent.addEventListener( 'mousemove', this._eventTimelineMove.bind( this ) )
    this.timelineParent.addEventListener( 'mouseout', this._eventTimelineOut.bind( this ) )
    this.timelineParent.addEventListener( 'click', this._eventTimelineClick.bind( this ) )

    
  }
  
  _eventTimeline(  ){
    
    const duration = this.soundtrack.duration
    const currentTime = this.soundtrack.currentTime
  
    if ( currentTime === duration ) this._eventButtonPause()
    this.timeline.style.width = currentTime * 100 / duration + '%'

  }


  _eventTimelineMove( event ){

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


  _eventTimelineClick(){
    const time = this.tooltipTimeline.time
    this.soundtrack.currentTime = time
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