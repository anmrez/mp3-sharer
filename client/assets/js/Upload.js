export class Upload{

  // upload
  inputUpload = document.querySelector('#inputUpload')
  uploadWindow = document.querySelector('#uploadWindow')
  buttonInUploadWindow = document.querySelector( '#windowButtonUpload' )
  buttonInHomePage = document.querySelector( '#upload' )
  
  // in uploadWindow
  esc = this.uploadWindow.querySelector('#esc')
  title = this.uploadWindow.querySelector('#SongTitle')
  author = this.uploadWindow.querySelector('#SongAuthor')
  status = this.uploadWindow.querySelector('#status')

  // in status
  statusErr = this.status.querySelector('#err')
  statusLoad = this.status.querySelector('#load')

  // readers
  changeFileReader = new FileReader()
  sendFileReader = new FileReader()

  // music
  tableMusick = document.querySelector('#tableMusick')

  // temp
  titleWithAuthor = []
  
  constructor(player, getMusic, windows1251){
    this.playerService = player
    this.getMusicSercise = getMusic
    this.windows1251Service = windows1251    
  }
  
  
  init(){

    this.esc.addEventListener('click', this.closeWindow.bind(this))
    this.inputUpload.addEventListener('change', this._changeFile.bind(this))

    this.buttonInHomePage.addEventListener( 'click', function() {this.inputUpload.click()}.bind(this) )
    this.buttonInUploadWindow.addEventListener( 'click', this._sendFile.bind(this) )

    this._addEventOnChangeFileReader()
    this._addEventOnSendFileReader()

  }


  // EVENTS --- ---
  _addEventOnChangeFileReader(){

    this.changeFileReader.addEventListener( 'load', function( event ){

      const sound = new Uint8Array(event.target.result)
    
      const title = this._readData('TIT2', sound)
      if (title === null) this.title.value = 'undefined'
      else this.title.value = title
      
      const author = this._readData('TPE1', sound)
      if (author === null) this.author.value = 'undefined'
      else this.author.value = author

    }.bind( this ) )

    this.changeFileReader.addEventListener( 'error', function( event ){
      throw new Error( event )
    } )

  }
  

  _addEventOnSendFileReader(){

    this.sendFileReader.addEventListener( 'load', async function( event ) {

      this.statusErr.classList.add('opacity_0')
      this.statusLoad.classList.remove('opacity_0')
      
      const arr = new Uint8Array(event.target.result) 
      const body = new Uint8Array( [ ...this.titleWithAuthor, ...arr ] )
      
      await this._responseFile(body)

    }.bind( this ) )

    this.sendFileReader.addEventListener( 'error', function( event ) {
      throw new Error( event )
    } )

  }


  // BODY --- ---
  _changeFile(){

    let file = this.inputUpload.files[0]
    this.title.value = ''
    this.author.value = ''
    
    if (file.type !== 'audio/mpeg') throw 'ERROR: it is not MP3 file!'
    
    this.openWindow()

    this.changeFileReader.readAsArrayBuffer(file)

  }


  async _sendFile(){
    
    const file = this.inputUpload.files[0]
    
    if (file.type !== 'audio/mpeg') throw 'ERROR: this is not an MP3 file'

    const dataTitle = await this._fromStingToBinary(this.title.value)
    const dataAuthor = await this._fromStingToBinary(this.author.value)
    const separator = [45, 45, 45, 45] // ----
    this.titleWithAuthor = [ ...dataTitle, ...separator, ...dataAuthor, ...separator ]

    this.sendFileReader.readAsArrayBuffer( file )

  }


  async _responseFile(body){
    const response = await fetch('/upload', {method: 'POST', body: body})
    const responseBody = await response.text()

    if (response.status === 402) {
      this.statusLoad.classList.add('opacity_0'),
      this.statusErr.classList.remove('opacity_0')
      this.statusErr.innerHTML = 'This file has already been uploaded ID: ' + responseBody
      return;
    }
    
    if (response.status === 500) {
      this.statusLoad.classList.add('opacity_0'),
      this.statusErr.classList.remove('opacity_0')
      this.statusErr.innerHTML = responseBody
      return;
    }

    this.closeWindow()
    this.tableMusick.update()

  }


  async _fromStingToBinary(string){

    const blob = new Blob( [string] )
    const buffer = await blob.arrayBuffer()

    return new Uint8Array( buffer )

  }

  
  _readData(header, soundArr) {

    if (header !== 'TIT2' && header !== 'TPE1') throw 'ERROR: Incorrect header'
    
    let HEAD = 0
    let headerExists = false

    while(soundArr.length > HEAD){

      if (soundArr[HEAD] === header.charCodeAt(0) 
      && soundArr[HEAD + 1] === header.charCodeAt(1) 
      && soundArr[HEAD + 2] === header.charCodeAt(2) 
      && soundArr[HEAD + 3] === header.charCodeAt(3)) {
        headerExists = true
        break;
      }

      HEAD++ 

    }

    if (headerExists === false) return null;

    // skip 4 bytes: [TIT2] || [TPE1] 
    HEAD += 4

    const headerLength = soundArr[HEAD + 3]

    // skip headerLength
    HEAD += 4

    //skip 2 bytes [00 00]
    HEAD += 2

    const dataHeaderLength = headerLength + HEAD
    const dataHeaderArr = []
    let itIsUTF = false

    // skip 3 byte [00 FF FE] 
    if (soundArr[HEAD] === 1)
    if ( soundArr[HEAD + 1] === 255 )
    if ( soundArr[HEAD + 2] === 254) {
      itIsUTF = true
      HEAD += 3
    } 

    // save data of header in array
    while (dataHeaderLength > HEAD){
      dataHeaderArr.push(soundArr[HEAD])
      HEAD++
    }


    // convert`s data to symbols
    let index = 0
    const dataHeader = []

    if (itIsUTF) while (dataHeaderArr.length > index) {

      if (dataHeaderArr[index] !== 0 || dataHeaderArr[index + 1] !== 0){
  
        if (dataHeaderArr[index + 1] !== 0) {
          const hex1 = dataHeaderArr[index + 1].toString(16)
          let hex2 = dataHeaderArr[index].toString(16)
          if (hex2.length === 1) hex2 = '0' + hex2
          dataHeader.push(String.fromCharCode(parseInt(hex1 + hex2, 16)))
        }

        if (dataHeaderArr[index + 1] === 0){
          dataHeader.push(String.fromCharCode(dataHeaderArr[index]))
        }

      }  

      index += 2

    } else while (dataHeaderArr.length > index) { 
      dataHeader.push(this.windows1251Service.decode(dataHeaderArr[index]))
      index++
    }

    return dataHeader.join('')

  }



  // WINDOW === ===
  // OPEN === ===
  openWindow(){

    this._removeKeyboardEvents()
    this.uploadWindow.classList.remove( 'none' )
    
  }
  
  
  _removeKeyboardEvents(){
    
    this.playerService.removeEventOnSpace()
    this.playerService.removeEventFastForward()
    this.playerService.removeEventRewind()

    this.getMusicSercise.removeEventReloadOnR()

  }
  

  // CLOSE === ===
  closeWindow(){

    this._addKeyboardEvents()
    this.uploadWindow.classList.add( 'none' )

    this.statusLoad.classList.add( 'opacity_0' )
    this.statusErr.classList.add( 'opacity_0' )
    
  }
  
  
  _addKeyboardEvents(){
    
    this.playerService.addEventOnSpace()
    this.playerService.addEventFastForward()
    this.playerService.addEventRewind()

    this.getMusicSercise.addEventReloadOnR()

  }


}