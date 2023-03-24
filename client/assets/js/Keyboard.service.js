import { Player } from './Player.js'
import { GetSoundtracks } from './GetSoundtracks.js';

export class KeyboardService {

  playerService
  getMusicSercise

  constructor(
    playerService,
    getMusicSercise
  ){

    if ( ! playerService instanceof Player ) throw 'Error [Keyboard service] - playerService not Player'
    if ( ! getMusicSercise instanceof GetSoundtracks ) throw 'Error [Keyboard service] - getMusicSercise not GetSoundtracks'

    this.playerService = playerService
    this.getMusicSercise = getMusicSercise

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



}