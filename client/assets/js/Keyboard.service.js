import { Player } from './Player.js'
import { GetSoundtracks } from './GetSoundtracks.js';

export class KeyboardService {

  playerService
  getMusicSercise

  constructor(
    playerService,
    getMusicSercise
  ){

    if ( playerService instanceof Player === false ) throw 'Error [Keyboard service] - playerService not Player'
    if ( getMusicSercise instanceof GetSoundtracks === false  ) throw 'Error [Keyboard service] - getMusicSercise not GetSoundtracks'

    this.playerService = playerService
    this.getMusicSercise = getMusicSercise

  }


  init(){

    this._disableSpaceScroll()

  }


  removeKeyboardEvents(){

    this.playerService.removeEventOnSpace()
    this.playerService.removeEventFastForward()
    this.playerService.removeEventRewind()

    this.getMusicSercise.removeEventReloadOnR()

  }


  addKeyboardEvents( ){

    this.playerService.addEventOnSpace()
    this.playerService.addEventFastForward()
    this.playerService.addEventRewind()

    this.getMusicSercise.addEventReloadOnR()

  }


  // PRIVATE --- ---
  _disableSpaceScroll(){

    window.addEventListener( 'keydown', function( event ) {

      if ( event.keyCode === 32 )
        if ( event.target === document.body ) event.preventDefault()

    });

  }

}