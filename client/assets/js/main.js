"use strict";
import { Comment } from './Comment.js';
import { Download } from './Download.js';
import { GetSoundtracks } from './GetSoundtracks.js';
import { GetUsers } from './GetUsers.js';
import { Profile } from './Profile.js';
import { Upload } from './Upload.js';
import { Player } from './Player.js'
import { TableResize } from './TableResize.js';
import { RenameSoundtrack } from './RenameSoundtrack.js'
import { Windows1251 } from './Windows1251.js'
import { Search } from './Search.js';
import { KeyboardEscape } from './Keyboard.escape.js';
import { KeyboardService } from './Keyboard.service.js';
import { Binary } from './Binary.js';
import { Tooltip } from './Tooltip.js';


class Init{
  
  
  profile = new Profile()
  tableResize = new TableResize()
  binary = new Binary()
  tooltip = new Tooltip()
  
  download = new Download( this.tooltip )
  getUsers = new GetUsers( this.tooltip )
  getSoundtrack = new GetSoundtracks( this.binary, this.tooltip )
  player = new Player( this.binary )

  windows1251 = new Windows1251()
  
  keyboardService = new KeyboardService( this.player, this.getSoundtrack )
  search = new Search( this.keyboardService )

  comment = new Comment( this.keyboardService, this.tooltip )
  upload = new Upload( this.keyboardService, this.windows1251 )
  renameSoundtrack = new RenameSoundtrack( this.keyboardService )
  
  keyboardEscape = new KeyboardEscape( this.upload, this.comment, this.renameSoundtrack )
  
  
  constructor(){

    document.addEventListener( 'DOMContentLoaded', this.init.bind( this ) );
    
  }
  
  
  init(){

    sessionStorage.clear()
    
    let index = 1
    
    while( index !== 13 ) {

      const delay = 50 * index

      if ( index === 1 ) setTimeout( this.profile.init.bind( this.profile ), delay ) 
      if ( index === 2 ) setTimeout( this.getUsers.init.bind( this.getUsers ), delay ) 
      if ( index === 3 ) setTimeout( this.getSoundtrack.init.bind( this.getSoundtrack, this.renameSoundtrack ), delay ) 
      
      if ( index === 4 ) setTimeout( this.tableResize.init.bind( this.tableResize ), delay ) 
      
      if ( index === 5 ) setTimeout( this.player.init.bind( this.player ), delay ) 
      if ( index === 6 ) setTimeout( this.keyboardEscape.init.bind( this.keyboardEscape ), delay ) 
      
      if ( index === 7 ) setTimeout( this.comment.init.bind( this.comment ), delay ) 
      if ( index === 8 ) setTimeout( this.download.init.bind( this.download ), delay ) 
      if ( index === 9 ) setTimeout( this.upload.init.bind( this.upload ), delay ) 
      
      if ( index === 10 ) setTimeout( this.renameSoundtrack.init.bind( this.renameSoundtrack ), delay ) 
      
      if ( index === 11 ) setTimeout( this.search.init.bind( this.search ), delay ) 
      if ( index === 12 ) setTimeout( this.keyboardService.init.bind( this.keyboardService ), delay ) 

      index++

    }


  }


}

new Init()
