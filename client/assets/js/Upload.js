

export class Upload{


  uploadWindow = document.querySelector( '#uploadWindow' )
  title = document.querySelector( '#SongTitle' )
  author = document.querySelector( '#SongAuthor' )
  status = uploadWindow.querySelector( '#status' )

  constructor( player, getMusick, windows1251 ){

    this.playerService = player
    this.getMusickSercise = getMusick
    this.windows1251Service = windows1251
    
  }
  
  
  init(){
    
    this._addEvent()

  }


  _addEvent(){

    const homeButtonUpload = document.querySelector( '#upload' )
    const input = document.querySelector( '#inputUpload' )

    homeButtonUpload.addEventListener( 'click', function(){

      input.click()

    })

    input.addEventListener( 'change', this._changeFile.bind( this ) )

    const windowButtonUpload = document.querySelector( '#windowButtonUpload' )

    windowButtonUpload.addEventListener( 'click', this._sendFile.bind( this ))

  }


  _sendFile(  ){

    const input = document.querySelector( '#inputUpload' )
    const file = input.files[0]

    if ( file.type !== 'audio/mpeg' ) throw 'ERROR: this is not an MP3 file'

    const dataTitle = this._fromStingToBinary( this.title.value )
    const dataAuthor = this._fromStingToBinary( this.author.value )

    const separator = [45, 45, 45, 45 ] // ----
    const titleWithAuthor = [ ...dataTitle, ...separator, ...dataAuthor, ...separator ]

    const reader = new FileReader();
    reader.onload = async ( event ) => {

      const arr = new Uint8Array( event.target.result )
      const body = new Uint8Array( [ ...titleWithAuthor, ...arr,  ] )
      
      this.status.classList.remove( 'opacity_0' )
  
      const response = await fetch( '/upload', {
        method: 'POST',
        body: body
      })

  
      if ( response.status === 200 ) {

        this.closeWindow()
        
        document.querySelector( '#tableMusick' ).update()
        return;

      }

    }

    reader.readAsArrayBuffer( file )


  }



  _fromStingToBinary( string ){

    let arr = []
    let index = 0

    while( string.length > index ){

      const hex = string.charCodeAt( index ).toString(16)
      
      if ( hex.length <= 2 ){
        arr.push( parseInt( hex, 16 ) )
        arr.push( 0 )
      }

      if ( hex.length >= 3 ){

        arr.push( parseInt( hex.substring( 2,4 ), 16 ) )
        arr.push( parseInt( hex.substring( 0,2 ), 16 ) )

      }

      index++

    }

    return arr

  }


  _changeFile(  ){

    this.playerService.removeEventOnSpace()

    let file = document.querySelector( '#inputUpload' ).files[0]
    this.title.value = ''
    this.author.value = ''
    
    if ( file.type === 'audio/mpeg' ) {
      
      this.openWindow()
      this._reader( file )

    } else {
    
      throw 'ERROR: it is not MP3 file!'
  
    }
      

  }



  _reader( file ){

    const reader = new FileReader();
    reader.addEventListener( 'load', this._readerData.bind( this ) )
    reader.readAsArrayBuffer( file )

  }


  _readerData( e ){

    const sound = new Uint8Array( e.target.result )

    const title = this._readData( 'TIT2', sound )
    if ( title === null ) this.title.value = 'undefined'
    else this.title.value = title
    
    const author = this._readData( 'TPE1', sound )
    if ( author === null ) this.author.value = 'undefined'
    else this.author.value = author

  }

  
  _readData( header, soundArr ) {

    if ( header !== 'TIT2' && header !== 'TPE1' ) throw 'ERROR: Incorrect header'

    let HEAD = 0
    let isExistHeader = false
    const ID3Version = soundArr[3]

    const codeChar1 = header[0].charCodeAt()
    const codeChar2 = header[1].charCodeAt()
    const codeChar3 = header[2].charCodeAt()
    const codeChar4 = header[3].charCodeAt()

    while( soundArr.length > HEAD ){

      if ( soundArr[HEAD] === codeChar1 )
      if ( soundArr[HEAD + 1] === codeChar2 )
      if ( soundArr[HEAD + 2] === codeChar3 )
      if ( soundArr[HEAD + 3] === codeChar4 ){
        isExistHeader = true
        break;
      }

      HEAD++
      
    }

    if ( isExistHeader === false ) return null;


    // skip 4 byte: [TIT2] || [TPE1] 
    HEAD += 4
    let arrSize = []
    const sizeLength = HEAD + 4


    // get size
    while ( sizeLength > HEAD ){

      arrSize.push( soundArr[ HEAD ] )
      HEAD++

    }

  
    //skip 2 byte [00 00]
    HEAD += 2
    let dataHeaderLength = arrSize[3] + HEAD
    const dataHeaderArr = []


    // skip 3 byte [00 FF FE] 
    if ( soundArr[HEAD] === 1 )
    if ( soundArr[HEAD + 1] === 255 )
    if ( soundArr[HEAD + 2] === 254 ) HEAD +=3


    // save data of header in array
    while ( dataHeaderLength > HEAD ){

      dataHeaderArr.push( soundArr[HEAD] )
      HEAD++

    }


    // convert`s data in symbols
    let index = 0
    let dataHeader = []

    if ( ID3Version === 3 ) while ( dataHeaderArr.length > index ){


      if ( dataHeaderArr[index + 1] !== 0 ){

        let hex1 = dataHeaderArr[index + 1].toString(16)
        let hex2 = dataHeaderArr[index].toString(16)
        if ( hex2.length === 1 ) hex2 = '0' + hex2

        let hex = hex1 + hex2
        dataHeader.push( String.fromCharCode( parseInt( hex, 16) ) )

      }

      if ( dataHeaderArr[index + 1] === 0 ){
        dataHeader.push( String.fromCharCode( dataHeaderArr[index] ) )
      }

      index += 2


    } else if ( ID3Version === 4 ) while( dataHeaderArr.length > index ){


      dataHeader.push( this.windows1251Service.decode( dataHeaderArr[index] ) )

      index++


    }

    return dataHeader.join('')

  }



  // WINDOW === ===
  // CLOSE === ===
  openWindow(){

    this._removeKeyboardEvents()
    this.uploadWindow.classList.remove( 'none' )
    
  }
  
  
  _removeKeyboardEvents(){
    
    this.playerService.removeEventOnSpace()
    this.playerService.removeEventFastForward()
    this.playerService.removeEventRewind()

    this.getMusickSercise.removeEventReloadOnR()

  }
  

  // CLOSE === ===
  closeWindow(){

    this._addKeyboardEvents()
    this.uploadWindow.classList.add( 'none' )
    this.status.classList.add( 'opacity_0' )
    
  }
  
  
  _addKeyboardEvents(){
    
    this.playerService.addEventOnSpace()
    this.playerService.addEventFastForward()
    this.playerService.addEventRewind()

    this.getMusickSercise.addEventReloadOnR()

  }


}