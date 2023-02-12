

export class Player{


  player = document.querySelector( '#player' )
  soundtrack = this.player.querySelector( '#soundtrack' )
  soundID = this.player.querySelector( '#id' )
  duration = {
    current: this.player.querySelector( '#durationCurrent' ),
    max: this.player.querySelector( '#durationMax' )
  } 
  button = this.player.querySelector( '#button' )
  volume = this.player.querySelector( '#volume' )

  timeline = this.player.querySelector( '#timeline' )
  timelineParent = this.player.querySelector( '#timelineParent' )
  tooltipTimeline = this.player.querySelector( '#tooltipTimeline' )

  _linkOnEventOnSpace
  _linkOnEventRewind
  _linkOnEventFastForward
  
  constructor(){
    
    this.soundtrack.volume = volume.value / 100
        
  }
  
  
  init(){
    
    this._addEventButton()
    this._addEventCurrentTime()
    this._addEventVolume()
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
    let time = this.soundtrack.duration
    let timeStr = this._getTime( time )
    if ( timeStr === 'NaN:NaN' ) this.duration.max.innerHTML = '00:00'
    if ( timeStr !== 'NaN:NaN' ) this.duration.max.innerHTML = this._getTime( time )

    this.soundtrack.addEventListener( 'loadeddata', this._eventButtonPlay.bind( this ) );

  }


  // STOP / SPACE === ===
  addEventOnSpace(){

    document.addEventListener( 'keyup', this._linkOnEventOnSpace )

  }
  
  removeEventOnSpace(){

    document.removeEventListener( 'keyup', this._linkOnEventOnSpace )
    
  }
  
  _eventOnSpace( event ){
    
    if ( event.keyCode === 32 ) this._eventButtonClick()
    
  }


  // REWIND === ===
  addEventRewind(){

    document.addEventListener( 'keyup', this._linkOnEventRewind )
    
  }
  
  
  removeEventRewind(){
    
    document.removeEventListener( 'keyup', this._linkOnEventRewind )

  }


  _eventRewind( event ){

    if ( event.keyCode === 37 ) this._rewind()

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

    if ( event.keyCode === 39 ) this._fastForward()

  }


  _fastForward(){

    if ( this.soundtrack.duration < this.soundtrack.currentTime + 10 ) 
      this.soundtrack.currentTime = this.soundtrack.duration
    else this.soundtrack.currentTime += 10

  }


  // BUTTON PLAY === ===
  _addEventButton(){

    this.button.status = 'pause'
    this.button.play = this._eventButtonPlay.bind( this )
    this.button.pause = this._eventButtonPause.bind( this )

    this.button.addEventListener( 'click', this._eventButtonClick.bind( this ) )

  }


  _eventButtonClick(){

    const id = this.soundID.innerHTML

    const bouttonIntoTable = document.querySelector( '[sound="' + id + '"]' )
    const playIntoTable = bouttonIntoTable.querySelector( '#play' )
    const pauseIntoTable = bouttonIntoTable.querySelector( '#pause' )
    
    if ( this.button.status === 'pause' ) {
      
      this.button.status = 'play'
      this.button.play()
      
      playIntoTable.classList.add( 'none' )
      pauseIntoTable.classList.remove( 'none' )
      
    } else {
      
      this.button.status = 'pause'
      this.button.pause()

      playIntoTable.classList.remove( 'none' )
      pauseIntoTable.classList.add( 'none' )


    }

  }


  _eventButtonPlay(){

    this.button.status = 'play'
    this.soundtrack.play()

    this.button.querySelector( '#play' ).classList.add( 'none' )
    this.button.querySelector( '#pause' ).classList.remove( 'none' )
    
  }
  
  
  _eventButtonPause(){
    
    this.button.status = 'pause'
    this.soundtrack.pause()

    this.button.querySelector( '#play' ).classList.remove( 'none' )
    this.button.querySelector( '#pause' ).classList.add( 'none' )

  }


  _addEventCurrentTime(){

    setInterval( this._eventCurrentTime.bind( this ), 100 )
    

  }


  _eventCurrentTime(){

    let time = this.soundtrack.currentTime
    this.duration.current.innerHTML = this._getTime( time )

  }


  _addEventVolume(){

    let volume = this.player.querySelector( '#volume' )
    volume.addEventListener( 'input', this._eventVolume.bind( this, volume ) )

  }


  _eventVolume( volume ){

    this.soundtrack.volume = volume.value / 100

  }


  _addEventTimeline(){

    setInterval( this._eventTimeline.bind( this ), 100 )

    timelineParent.addEventListener( 'mousemove', this._eventTimelineMove.bind( this ) )
    timelineParent.addEventListener( 'mouseout', this._eventTimelineOut.bind( this ) )
    timelineParent.addEventListener( 'click', this._eventTimelineClick.bind( this ) )

    
  }
  
  _eventTimeline(  ){
    
    let duration = this.soundtrack.duration
    let currentTime = this.soundtrack.currentTime
  
    this.timeline.style.width = currentTime * 100 / duration + '%'

  }


  _eventTimelineMove( event ){

    tooltipTimeline.classList.remove( 'none' )

    const maxWidth = this.timelineParent.offsetWidth
    const currentWidth = event.clientX

    const width = currentWidth * 100 / maxWidth
    tooltipTimeline.style.left = width + '%'

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