"use strict";
import { Login } from './Login.js'
import { Profile } from './Profile.js';
import { GetMusick } from './GetMusick.js'
import { Upload } from './Upload.js';
import { Keyboard } from './Keyboard.js';
import { Player } from './Player.js'
import { GetUsers } from './GetUsers.js';
import { Download } from './Download.js';


// load Data
new Profile()
new GetMusick()

// add events
new Keyboard()
new Player()

new Login()
new Upload()

new GetUsers()
new Download()
