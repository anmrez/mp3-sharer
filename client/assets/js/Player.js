

export class Player{


  player = document.querySelector( '#player' )
  
  soundtrack = this.player.querySelector( '#soundtrack' )
  soundID = this.player.querySelector( '#id' )
  duration = {
    current: this.player.querySelector( '#durationCurrent' ),
    max: this.player.querySelector( '#durationMax' )
  } 

  buttonPlay = this.player.querySelector( '#button' )
  
  constructor(){

    // console.log( this.player )
    // console.log( this.soundtrack )
    // console.log( this.soundID )
    // console.log( this.duration )
    // console.log( this.buttonPlay )

    
    setTimeout( this.init.bind( this ), 100 )
    
    
  }
  
  
  init(){
    
    this._addEventPlay()
    this._addEventCurrentTime()
    
    let time = this.soundtrack.duration
    console.log( time )
    this.duration.max.innerHTML = this._getTime( time )

  }



  _addEventPlay(){

    this.buttonPlay.addEventListener( 'click', this._eventPlay.bind( this ) )

  }

  _eventPlay(){

    console.log( 'click' )

    let play = this.player.querySelector( '#play' )
    let pause = this.player.querySelector( '#pause' )

    if ( play.classList.contains( 'none' ) ){
      
      this.soundtrack.pause()
      play.classList.remove( 'none' )
      pause.classList.add( 'none' )
      
    } else {
      
      this.soundtrack.play()
      play.classList.add( 'none' )
      pause.classList.remove( 'none' )


    }
    

  }

  _addEventCurrentTime(){

    setInterval( this._eventCurrentTime.bind( this ), 100 )

  }

  _eventCurrentTime(){

    let time = this.soundtrack.currentTime
    // time = Math.floor( time )

    this.duration.current.innerHTML = this._getTime( time )

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