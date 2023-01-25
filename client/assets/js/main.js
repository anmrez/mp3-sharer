"use strict";
import { WindowLogin } from './WindowLogin.js'
import { Login } from './Login.js'

// const login = new Login()
const windowLogin = new WindowLogin()
const login = new Login()



const buttonLogin = document.querySelector( '#buttonLogin' )
windowLogin.addEventView( buttonLogin )
windowLogin.addEventClose( )


const windowButtonLogin = document.querySelector( '#windowButtonLogin' )
login.addEventSend( windowButtonLogin )


