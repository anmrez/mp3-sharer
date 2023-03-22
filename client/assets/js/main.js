"use strict";
import { Comment } from './Comment.js';
import { Download } from './Download.js';
import { GetMusick } from './GetMusick.js'
import { GetUsers } from './GetUsers.js';
import { Keyboard } from './Keyboard.js';
import { Profile } from './Profile.js';
import { Upload } from './Upload.js';
import { Player } from './Player.js'
import { TableResize } from './TableResize.js';
import { RenameSoundtrack } from './RenameSoundtrack.js'
import { Windows1251 } from './Windows1251.js'
import { Search } from './Search.js';

class Init{
  
  
  download = new Download()
  getUsers = new GetUsers()
  profile = new Profile()
  tableResize = new TableResize()
  getMusick = new GetMusick()
  player = new Player()
  windows1251 = new Windows1251()
  search = new Search()
  
  renameSoundtrack = new RenameSoundtrack( this.player, this.getMusick )
  upload = new Upload( this.player, this.getMusick, this.windows1251 )
  comment = new Comment( this.player, this.getMusick )

  keyboard = new Keyboard( this.upload, this.comment, this.renameSoundtrack )
  
  
  constructor(){

    document.addEventListener( 'DOMContentLoaded', this.init.bind( this ) );
    
  }
  
  
  init(){
    
    let index = 1
    
    while( index !== 12 ) {

      const delay = 50 * index

      if ( index === 1 ) setTimeout( this.profile.init.bind( this.profile ), delay ) 
      if ( index === 2 ) setTimeout( this.getUsers.init.bind( this.getUsers ), delay ) 
      if ( index === 3 ) setTimeout( this.getMusick.init.bind( this.getMusick, this.renameSoundtrack ), delay ) 
      
      if ( index === 4 ) setTimeout( this.tableResize.init.bind( this.tableResize ), delay ) 
      
      if ( index === 5 ) setTimeout( this.player.init.bind( this.player ), delay ) 
      if ( index === 6 ) setTimeout( this.keyboard.init.bind( this.keyboard ), delay ) 
      
      if ( index === 7 ) setTimeout( this.comment.init.bind( this.comment ), delay ) 
      if ( index === 8 ) setTimeout( this.download.init.bind( this.download ), delay ) 
      if ( index === 9 ) setTimeout( this.upload.init.bind( this.upload ), delay ) 
      
      if ( index === 10 ) setTimeout( this.renameSoundtrack.init.bind( this.renameSoundtrack ), delay ) 
      
      if ( index === 11 ) setTimeout( this.search.init.bind( this.search ), delay ) 

      index++

    }


  }


}

new Init()
