"use strict";
import { Login } from './Login.js'
import { Profile } from './Profile.js';
import { GetMusick } from './GetMusick.js'
import { Upload } from './Upload.js';
import { Keyboard } from './Keyboard.js';


// load Data
new Profile()
new GetMusick()

// add events
new Login()
new Upload()

new Keyboard()




