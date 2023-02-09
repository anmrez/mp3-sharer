

export class Upload{


  uploadWindow = document.querySelector( '#uploadWindow' )
  title = document.querySelector( '#SongTitle' )
  author = document.querySelector( '#SongAuthor' )

  constructor( player, getMusick ){

    this.playerService = player
    this.getMusickSercise = getMusick
    
  }
  
  
  init(){
    
    console.log( '[Upload] - inited.' )
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

    if ( file.type !== 'audio/mpeg' ) {

      console.log( 'Это не MP3' )
      return

    }

    const dataTitle = this._fromStingToBinary( this.title.value )
    const dataAuthor = this._fromStingToBinary( this.author.value )

    const separator = [45, 45, 45, 45 ] // ----
    const titleWithAuthor = [ ...dataTitle, ...separator, ...dataAuthor, ...separator ]

    const reader = new FileReader();
    reader.onload = async ( event ) => {

      const arr = new Uint8Array( event.target.result )
      const body = new Uint8Array( [ ...titleWithAuthor, ...arr,  ] )
  
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

        arr.push( parseInt( hex.substring( 0,2 ), 16 ) )
        arr.push( parseInt( hex.substring( 2,4 ), 16 ) )

      }

      index++

    }

    return arr

  }


  _changeFile(  ){

    this.playerService.removeEventOnSpace()

    let file = document.querySelector( '#inputUpload' ).files[0]
    const inputsSection = document.querySelector( '#uploadWindowInputs' )
    this.title.value = ''
    this.author.value = ''
    
    if ( file.type === 'audio/mpeg' ) {
      
      // this.uploadWindow.classList.remove( 'none' )
      this.openWindow()
      inputsSection.classList.remove( 'none' )
      this._reader( file )

    } else {
    
      inputsSection.classList.add( 'none' )
  
    }
      

  }



  _reader( file ){

    const reader = new FileReader();
    reader.addEventListener( 'load', this._readerData.bind( this ) )
    reader.readAsArrayBuffer( file )

  }


  _readerData( e ){

    const arr = new Uint8Array( e.target.result )

    // === === === === === ===
    // === ===  Title  === ===
    // === === === === === ===

    let indexTitleHEAD = 0
    let isExistTitle = false
    while( arr.length > indexTitleHEAD ){

      // TIT2
      if ( arr[indexTitleHEAD] === 84 )
      if ( arr[indexTitleHEAD + 1] === 73 )
      if ( arr[indexTitleHEAD + 2] === 84 )
      if ( arr[indexTitleHEAD + 3] === 50 ){
        isExistTitle = true
        break;
      }

      indexTitleHEAD++
      
    }

    if ( isExistTitle === false ){

      this.title.value = 'undefined'
      
    } else {

      //skip 4 byte
      indexTitleHEAD += 4
      let indexTitleSize = 0

      let arrTitleSize = []
      while ( indexTitleSize !== 4 ){

        arrTitleSize.push( arr[indexTitleHEAD] )
        
        indexTitleSize++
        indexTitleHEAD++

      }

      // set length data
      let titleLengthData = arrTitleSize[ arrTitleSize.length - 1 ]

      // skip 2 byte (00 00)
      indexTitleHEAD += 2
      indexTitleSize += 2
      
      // skip 3 byte ( 01 FF FE )
      let indexTitleData = 3
      indexTitleHEAD += 3

      // get title in array
      let arrTitleData = []
      while( titleLengthData > indexTitleData ){

        if ( arr[indexTitleHEAD + 1] !== 0 ){
          
          let hex1 = arr[indexTitleHEAD + 1].toString(16)
          let hex2 = arr[indexTitleHEAD ].toString(16)

          let hex = hex1 + hex2
          arrTitleData.push( String.fromCharCode( parseInt( hex, 16) ) )

        }

        if ( arr[indexTitleHEAD + 1] === 0 ){
          arrTitleData.push( String.fromCharCode( arr[indexTitleHEAD] ) )
        }

        indexTitleData += 2
        indexTitleHEAD += 2

      }

      // set title into input
      arrTitleData.forEach( item => {
        document.querySelector( '#SongTitle' ).value += item
      } )

    }

    // === === === === === ===
    // === ===  Author === ===
    // === === === === === ===

    let indexAuthorHEAD = 0
    let isExistAuthor = false
    while( arr.length > indexAuthorHEAD ){

      // TPE1
      if ( arr[indexAuthorHEAD] === 84 )
      if ( arr[indexAuthorHEAD + 1] === 80 )
      if ( arr[indexAuthorHEAD + 2] === 69 )
      if ( arr[indexAuthorHEAD + 3] === 49 ){
        isExistAuthor = true
        break;
      }

      indexAuthorHEAD++
      
    }

    if ( isExistAuthor === false ){

      this.author.value = 'undefined'
      return;

    }

    // skip 4 byte (TPE1)
    indexAuthorHEAD += 4
    let indexAuthorSize = 0

    let arrsize = []
    while ( indexAuthorSize !== 4 ){

      arrsize.push( arr[indexAuthorHEAD] )
      
      indexAuthorSize++
      indexAuthorHEAD++

    }

    // set length data
    let authorlengthData = arrsize[ arrsize.length - 1 ]

    // skip 2 byte (00 00)
    indexAuthorHEAD += 2
    indexAuthorSize += 2
    
    // skip 3 byte ( 01 FF FE )
    let indexAuthorData = 3
    indexAuthorHEAD += 3

    // get author in array
    let arrAuthorData = []
    while( authorlengthData > indexAuthorData ){

      if ( arr[indexAuthorHEAD + 1] === 0 ){
        arrAuthorData.push( String.fromCharCode( arr[indexAuthorHEAD] ) )
      }

      if ( arr[indexAuthorHEAD + 1] !== 0 ){
        
        let hex1 = arr[indexAuthorHEAD + 1].toString(16)

        let hex2 = arr[indexAuthorHEAD ].toString(16)
        if ( hex2.length === 1 ) hex2 = '0' + hex2

        let hex = hex1 + hex2
        arrAuthorData.push( String.fromCharCode( parseInt( hex, 16) ) )

      }

      indexAuthorData += 2
      indexAuthorHEAD += 2

    }

    // set author into input
    arrAuthorData.forEach( item => {
      this.author.value += item
    } )


  }



  // CLOSE === ===
  openWindow(){

    this._removeKeyboardEvents()
    this.uploadWindow.classList.remove( 'none' )
    
  }
  
  
  _removeKeyboardEvents(){
    
    this.playerService.removeEventOnSpace()
    this.getMusickSercise.removeEventReloadOnR()

  }
  

  // CLOSE === ===
  closeWindow(){

    this._addKeyboardEvents()
    this.uploadWindow.classList.add( 'none' )
    
  }
  
  
  _addKeyboardEvents(){
    
    this.playerService.addEventOnSpace()
    this.getMusickSercise.addEventReloadOnR()


  }


}