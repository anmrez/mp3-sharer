

export class Upload{


  constructor(){

    this.addEvent()

  }



  addEvent(){

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

    // console.log( file )
    if ( file.type !== 'audio/mpeg' ) {
      console.log( 'Это не MP3' )
      return
    }

    const songTitle = document.querySelector( '#SongTitle' ).value
    const songAuthor = document.querySelector( '#SongAuthor' ).value

    // console.log( 'autho: ' + songAuthor )
    const dataTitle = this._fromStingToBinary( songTitle )
    const dataAuthor = this._fromStingToBinary( songAuthor )

    const separator = [45, 45, 45, 45 ] // ----
    const titleWithAuthor = [ ...dataTitle, ...separator, ...dataAuthor, ...separator ]

    const reader = new FileReader();
    reader.readAsArrayBuffer( file )
    reader.onload = async function( e ){

      // const binary = e.target.result
      const arr = new Uint8Array( e.target.result )

      const response = await fetch( '/upload', {
        method: 'POST',
        headers: {
          'content-type': 'application/octet-stream'
        },
        body: new Uint8Array( [ ...titleWithAuthor, ...arr,  ] )
      })

      console.log( response )

      // Обработка ошибок

    }


  }


  _fromStingToBinary( string ){

    let arr = []
    let index = 0

    while( string.length > index ){

      const code = string.charCodeAt( index )

      if ( code < 256 ){
        arr.push( code )
        arr.push( 0 )
      }

      if ( code > 256 ){
        arr.push( Number( code.toString().substring( 0,3 ) ) )
        arr.push( Number( code.toString().substring( 3,6 ) ) )
      }

      index++

    }

    return arr

  }


  _changeFile(  ){

    
    let file = document.querySelector( '#inputUpload' ).files[0]
    const inputsSection = document.querySelector( '#uploadWindowInputs' )
    document.querySelector( '#SongTitle' ).value = ''
    document.querySelector( '#SongAuthor' ).value = ''
    
    if ( file.type === 'audio/mpeg' ) {
      
      document.querySelector( '#uploadWindow' ).classList.remove( 'none' )
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

    console.log( 'title exist? ' + isExistTitle )

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

    // console.log( arrTitleData )
    // set title into input
    arrTitleData.forEach( item => {
      document.querySelector( '#SongTitle' ).value += item
    } )
    

    // === === === === === ===
    // === ===  Author === ===
    // === === === === === ===

    let indexAuthorHEAD = 0
    while( arr.length > indexAuthorHEAD ){

      // TPE1
      if ( arr[indexAuthorHEAD] === 84 )
        if ( arr[indexAuthorHEAD + 1] === 80 )
          if ( arr[indexAuthorHEAD + 2] === 69 )
            if ( arr[indexAuthorHEAD + 3] === 49 ){
              break;
            }

      indexAuthorHEAD++
      
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

      if ( arr[indexAuthorHEAD + 1] !== 0 ){
        
        let hex1 = arr[indexAuthorHEAD + 1].toString(16)
        let hex2 = arr[indexAuthorHEAD ].toString(16)

        let hex = hex1 + hex2
        arrAuthorData.push( String.fromCharCode( parseInt( hex, 16) ) )

      }

      if ( arr[indexAuthorHEAD + 1] === 0 ){
        arrAuthorData.push( String.fromCharCode( arr[indexAuthorHEAD] ) )
      }

      indexAuthorData += 2
      indexAuthorHEAD += 2

    }

    // set author into input
    arrAuthorData.forEach( item => {
      document.querySelector( '#SongAuthor' ).value += item
    } )


  }


}