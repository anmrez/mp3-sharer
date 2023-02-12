"use strict";
import { Comment } from './Comment.js';
import { Download } from './Download.js';
import { GetMusick } from './GetMusick.js'
import { GetUsers } from './GetUsers.js';
import { Keyboard } from './Keyboard.js';
// import { Login } from './Login.js'
import { Profile } from './Profile.js';
import { Upload } from './Upload.js';
import { Player } from './Player.js'
import { TableResize } from './TableResize.js';

import { Windows1251 } from './Windows1251.js'






class Init{
  
  
  download = new Download()
  getMusick = new GetMusick()
  getUsers = new GetUsers()
  // login = new Login()
  player = new Player()
  profile = new Profile()
  tableResize = new TableResize()
  
  windows1251 = new Windows1251()
  upload = new Upload( this.player, this.getMusick, this.windows1251 )
  comment = new Comment( this.player, this.getMusick )

  keyboard = new Keyboard( this.upload, this.comment )
  
  
  constructor(){

    document.addEventListener( 'DOMContentLoaded', this.init.bind( this ) );
    
  }
  
  
  init(){
    
    let index = 1
    
    while( 11 > index ) {

      let delay = 100 * index

      if ( index === 1 ) setTimeout( this.profile.init.bind( this.profile ), delay ) 
      if ( index === 2 ) setTimeout( this.getMusick.init.bind( this.getMusick ), delay ) 
      if ( index === 3 ) setTimeout( this.getUsers.init.bind( this.getUsers ), delay ) 
      
      if ( index === 4 ) setTimeout( this.tableResize.init.bind( this.tableResize ), delay ) 
      
      if ( index === 5 ) setTimeout( this.player.init.bind( this.player ), delay ) 
      if ( index === 6 ) setTimeout( this.keyboard.init.bind( this.keyboard ), delay ) 
      
      // if ( index === 7 ) setTimeout( this.login.init.bind( this.login ), delay ) 
      if ( index === 8 ) setTimeout( this.comment.init.bind( this.comment ), delay ) 
      if ( index === 9 ) setTimeout( this.download.init.bind( this.download ), delay ) 
      if ( index === 10 ) setTimeout( this.upload.init.bind( this.upload ), delay ) 

      index++

    }


  }


}

new Init()
