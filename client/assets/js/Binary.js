

export class Binary{


  constructor(){}


  decodeArrayInValue( array = [0] ) {

    const basicArray = []

    array.forEach( item => {
      basicArray.push( item )
    } )

    let result = 0
    let index = 0
    while ( index !== basicArray.length ){

      if ( index === basicArray.length - 1 ) result += basicArray[index]
      else 
        if ( basicArray[index] > 0 ) basicArray[index + 1] += basicArray[index] * 255

      index++

    }

    return result

  }


  // COVER --- ---
  /** ```ts 
   * readCoverInSoundtrack.bind( this: Player ) 
   * input: new Uint8Array( soundtrackBuffer )
   * output: new File( cover ) || null
   * ```
  */
  readCoverInSoundtrack( soundtrack ){

    console.log( 'readCoverInSoundtrack' )
    let HEAD = 0

    // find - image/
    while ( HEAD !== soundtrack.length ){

      if ( soundtrack[HEAD] === 105 
        && soundtrack[HEAD + 1] === 109 
        && soundtrack[HEAD + 2] === 97 
        && soundtrack[HEAD + 3] === 103 
        && soundtrack[HEAD + 4] === 101 
        && soundtrack[HEAD + 5] === 47 
      ) break; 

      HEAD++

    }

    if ( HEAD === soundtrack.length ) {

      this.coverEmpty.classList.remove( 'none' )
      this.cover.classList.add( 'none' )
      return;

    }

    this.cover.classList.remove( 'none' )
    this.coverEmpty.classList.add( 'none' )

    // skip 'image/' - 6 byte
    HEAD += 6

    let mimeType = 'image/'
    let type = 'png'

    if ( soundtrack[HEAD] === 106  // is jpg
      && soundtrack[HEAD + 1] === 112
      && soundtrack[HEAD + 2] === 103
    ) type = 'jpeg'
    else if ( soundtrack[HEAD] === 106  // is jpeg
      && soundtrack[HEAD + 1] === 112
      && soundtrack[HEAD + 2] === 101
      && soundtrack[HEAD + 3] === 103
    ) type = 'jpg'

    // skip type
    HEAD += type.length
    mimeType += type
    
    // find end cover
    let endCover = -1
    if ( type === 'png' ) {

      HEAD += 3 // skip [00 03 00]
      endCover = this.binaryService.getIEND( HEAD, soundtrack )

    } 
    if ( type === 'jpeg' ) HEAD += 2 // skip [00 03]
    if ( type === 'jpg' ) {

      while( soundtrack[HEAD] !== 255 ) HEAD++ // skip title
      
      endCover = HEAD
      while( endCover !== soundtrack.length ) {
        
        // find EOI
        if ( soundtrack[endCover] === 255 && soundtrack[endCover + 1] === 217 ) {
          endCover += 2
          break;
        } 

        endCover++

      }

    } 

    let coverData = []
    if ( endCover !== -1 && endCover !== soundtrack.length ) coverData = soundtrack.slice( HEAD, endCover )
    else coverData = soundtrack.slice( HEAD, 909090 )

    return new File( [coverData], this.player.title + '.' + type , { type: mimeType } )

  }


  getIEND( HEAD, soundtrack ){

    while ( HEAD !== soundtrack.lenght ) {

      if ( soundtrack[HEAD] === 73
        && soundtrack[HEAD + 1] === 69
        && soundtrack[HEAD + 2] === 78
        && soundtrack[HEAD + 3] === 68
      ) break;
      HEAD ++

    }

    if ( HEAD === soundtrack.lenght ) throw 'END PNG not found'

    HEAD += 4
    return HEAD

  }


}