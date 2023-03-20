import { MySQLServiceSoundtrack } from '../mysql/mysql.service.soundtrack.ts';
import { MySQLServiceComment } from '../mysql/mysql.service.comment.ts';
import { MySQLServiceUser } from '../mysql/mysql.service.user.ts';
import { ConfigModule } from '../config/config.module.ts';
import { HashService } from '../hash/hash.service.ts';

export class UploadService{


  constructor(
    private readonly mySQLServiceSoundtrack: MySQLServiceSoundtrack,
    private readonly mySQLServiceComment: MySQLServiceComment,
    private readonly mySQLServiceUser: MySQLServiceUser,
    private readonly config: ConfigModule,
    private readonly hashService: HashService
  ){}


  async write( req: Request ): Promise< Response > {

    const user = await this.mySQLServiceUser.getUser( req )
    if ( user === null ) return new Response( null, { status: 403 })

    try {


      const body = new Uint8Array( await req.arrayBuffer() )
      const file = this.separateFile( body )

      const hash = this.hashService.generateHash( file.sound )
      
      const response = await this.checkSoundtrackExists( file.title, file.author, hash )
      if ( response !== null ) return response

      const duration = this.getDuration( file.sound )
      await this.checkSize( file.sound.length )

      const lastId = await this.mySQLServiceSoundtrack.setSound( file.title, file.author, duration, hash )
      if ( lastId === null ) return new Response( 'Error writing to the database', { status: 500 } )

      await this.mySQLServiceComment.addComment( lastId, user.id )
      await Deno.writeFile( './client/static/mp3/' + lastId + '.mp3', file.sound )

      return new Response( undefined, { status: 200 } ) 


    } catch ( err ) {


      const currentdate = new Date();
      const datetime = "Error: " 
        + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

      console.log( '\n' )
      console.log( datetime )
      console.log( err )
      console.log( '\n' )

      return new Response( 'Error writing/reading file', { status: 500 } ) 

      
    }


  }


  // PRIVATE === ===
  private separateFile( body: Uint8Array )  {

    let frame = this.getFrame( body, 0 )
    let title = this.decoder( frame.data )
    title = title.substring( 0, 60 )
    title = title.split(`'`).join('`')

    frame = this.getFrame( body, frame.index )
    let author = this.decoder( frame.data )
    author = author.substring( 0, 60 )
    author = author.split(`'`).join('`')

    const sound = body.slice( frame.index, body.length )

    return {
      title: title,
      author: author,
      sound: sound
    }

  }
  

  private getFrame( data: Uint8Array, startIndex: number ): { data: Uint8Array, index: number } {
  
    const result: number[] = []

    let index = startIndex
    while ( data.length > index ){

      // find separate
      if ( data[index] === 45 )
      if ( data[index + 1] === 45 )
      if ( data[index + 2] === 45 )
      if ( data[index + 3] === 45 ) break;

      result.push( data[index] )

      index++

    }

    return {
      data: new Uint8Array( result ),
      index: index + 4
    } 

  }


  private async checkSoundtrackExists( title: string, author: string, hash: string ): Promise< Response | null > {

    const soundByHash = await this.mySQLServiceSoundtrack.findByHash( hash )
    if ( soundByHash !== null ) 
      return new Response( 'This file has already been uploaded ID: ' + soundByHash.id, { status: 402 } )

    const soundByTitleAndAuthor = await this.mySQLServiceSoundtrack.findByTitleAndAuthor( title, author )
    if ( soundByTitleAndAuthor !== null ) 
      return new Response( 'The song with that name already exists ID: ' + soundByTitleAndAuthor.id, { status: 402 } ) 

    return null

  }


  private async checkSize( sizeUploadFile: number ){

    const sizeUploadFileInMB = sizeUploadFile / 1024 / 1024
    const path = './client/static/mp3'
    
    const sounds = await this.mySQLServiceSoundtrack.getAllSounds()
    if ( sounds === null ) throw 'ERROR: limit exceeded'
    
    let index = 0
    while ( sounds.length > index ){
      
      const totalSize = await this.getSize( path )
      if ( totalSize + sizeUploadFileInMB < this.config.server.maxSize ) break;
      
      const soundID = sounds[index].id
      await this.removeOldSoundtrack( soundID, path )
      index++
      
    }
    
  }


  private async getSize( path: string ){

    let totalSize = 0
    for await ( const file of Deno.readDir( path ) ) {

      const dataFile = await Deno.stat( path + '/' + file.name )
      totalSize += dataFile.size / 1024 / 1024 // in MB

    }

    return totalSize

  }


  private async removeOldSoundtrack( soundID: number, path: string ){

    await Deno.remove( path + '/' + soundID + '.mp3' )
    await this.mySQLServiceSoundtrack.removeSoundtrack( soundID )

  }


  private decoder( array: Uint8Array ): string {

    let result = ''
    let index = 0

    while ( array.length > index ){
      
      if ( array[index] === 0 ) {

        const temp = array[index + 1]
        
        array[index + 1] = array[index]
        array[index] = temp
        
        const item = array[index].toString()
        const str = parseInt( item, 10 ).toString(16) + '0'
        result += String.fromCharCode( parseInt( str, 16 ) )
        
      } else {

        if ( array[index + 1] === 0 ) {
  
          result += String.fromCharCode( array[index] )
  
        }  
        
        if ( array[index + 1] !== 0 ) {
          
          const item1 = array[index + 1].toString()
          const str1 = parseInt( item1, 10 ).toString(16)
          
          const item2 = array[index].toString()
          let str2 = parseInt( item2, 10 ).toString(16)
          if ( str2.length === 1 ) str2 = '0' + str2
          
          const str = str1 + str2
          result += String.fromCharCode( parseInt( str, 16 ) )
  
        }

      }


      index += 2

    }

    return result

  }


  private getDuration( sound: Uint8Array ): number {

    const lengthID3 = this.getID3length( sound )
    const header = this.getAudioFrameHeader( sound, lengthID3 )
    
    const mpegVersion = this.getMPEGVersion( header )
    const layer = this.getLayer( header )
    const bitrate = this.getBitrate( header, mpegVersion, layer )

    const samplingRate = this.getSamplingRate( header, mpegVersion )
    const samplesPerFrame = this.getSamplesPerFrame( layer, mpegVersion )
    
    let duration = 0
    
    const Xing = this.findXingHeader( sound, lengthID3 )
    if ( Xing === null ) {
      
      duration = ( sound.length - lengthID3 ) / bitrate / 1000 * 8
      
    } else {
      
      const numberofFrames = this.getNumberofFrames( sound, Xing )
      duration = numberofFrames * samplesPerFrame / samplingRate

    } 

    if ( isNaN( duration ) ) duration = 0
    return Math.floor( duration )

  }


  private findXingHeader( sound: Uint8Array , lengthID3: number ): number | null {

    let index = 0

    while( sound.length > index ){

      const soundIndex = lengthID3 + index

      // find [Xing]
      if ( sound[soundIndex] === 88 )
      if ( sound[soundIndex + 1] === 105 )
      if ( sound[soundIndex + 2] === 110 )
      if ( sound[soundIndex + 3] === 103 ) return soundIndex

      index++

    }

    return null

  }


  private getNumberofFrames( sound: Uint8Array, XingPosition: number ): number {

    let HEAD = XingPosition

    // skip [Xing]
    HEAD += 4
    
    // skip [00 00 00]
    HEAD += 3

    const flags = sound[HEAD].toString(2)
    if ( flags[3] !== '1' ) return 0

    // skip byte of flags
    HEAD ++

    let index = 0
    const numberofFramesArr = []
    while( 4 > index ){

      const byte = sound[HEAD].toString(16)
      if ( byte !== '0' ) numberofFramesArr.push( byte )

      HEAD++
      index++
    }

    return  parseInt( numberofFramesArr.join(''), 16 )

  }


  private getAudioFrameHeader( sound: Uint8Array, lengthID3: number ): number[] {

    let index = 0
    const header: number[] = []
    let headerIndex = lengthID3

    while( 4 > index ){

      header.push( sound[ headerIndex ] )

      headerIndex++
      index++

    }

    return header 

  }


  private getID3length( sound: Uint8Array ): number {

    const lengthID3Arr: number[] = []
    let index = 6

    while( 10 > index ){

      lengthID3Arr.push( sound[index] )
      index ++

    }

    let lengthID3 = lengthID3Arr[0] << 21 | lengthID3Arr[1] << 14 | lengthID3Arr[2] << 7 | lengthID3Arr[3]
    lengthID3 += 10 // 9 byte ID3 header

    return lengthID3

  }


  private getMPEGVersion( header: number[] ): string {

    const mpegBite = header[1].toString(2).substring( 3, 5 )
    
    let mpegVersion = ''
    if ( mpegBite === '00' ) mpegVersion = 'V2.5'
    if ( mpegBite === '01' ) mpegVersion = 'reserved'
    if ( mpegBite === '10' ) mpegVersion = 'V2'
    if ( mpegBite === '11' ) mpegVersion = 'V1'

    if ( mpegVersion === '' ) throw 'ERROR: не удалось распознать mpeg'

    return mpegVersion

  }


  private getLayer( header: number[] ): string {

    const layerBite = header[1].toString(2).substring( 5, 7 )

    let layer = ''
    if ( layerBite === '00' ) layer = 'reserved'
    if ( layerBite === '01' ) layer = '3'
    if ( layerBite === '10' ) layer = '2'
    if ( layerBite === '11' ) layer = '1'

    if ( layer === '' ) throw 'ERROR: не удалось определить layer'

    return layer

  }


  private getBitrate( header: number[], mpegVersion: string, layer: string ): number {

    const bitrateBite = header[2].toString(2).substring( 0, 4 )
    const bitrateIndex = parseInt( bitrateBite, 2 ) - 1

    let bitrate = 0
    let startBitrate = 0
    let step: number[] = []

    if ( mpegVersion === 'V1' ) {
      
      if ( layer === '1' ) { startBitrate = 32; step = [ 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32 ] }
      if ( layer === '2' ) { startBitrate = 32; step = [ 16,  8,  8, 16, 16, 16, 16, 32, 32, 32, 32, 64, 64 ] }
      if ( layer === '3' ) { startBitrate = 32; step = [  8,  8,  8,  8, 16, 16, 16, 16, 32, 32, 32, 32, 64 ] }

    }

    if ( mpegVersion === 'V2' || mpegVersion === 'V2.5' ){

      if ( layer === '1' ) { startBitrate = 32; step = [ 16,  8,  8, 16, 16, 16, 16, 16, 16, 16, 16, 32, 32 ] }
      if ( layer === '2' ) { startBitrate = 8; step =  [  8,  8,  8,  8,  8,  8,  8, 16, 16, 16, 16, 16, 16 ] }
      if ( layer === '3' ) { startBitrate = 8; step =  [  8,  8,  8,  8,  8,  8,  8, 16, 16, 16, 16, 16, 16 ] }
      
    }

    bitrate = startBitrate
    let index = 0

    while( bitrateIndex > index ){

      bitrate += step[ index ]
      index++

    }
    
    return bitrate

  }


  private getSamplingRate( header: number[], mpegVersion: string ) : number {

    const byte = header[2].toString(2)
    const index = byte.substring( 4, 6)

    if ( index === '00' ){

      if ( mpegVersion === 'V1' ) return 44_100
      if ( mpegVersion === 'V2' ) return 22_050
      if ( mpegVersion === 'V2.5' ) return 11_025 

    }
    
    if ( index === '01' ){

      if ( mpegVersion === 'V1' ) return 48_000 
      if ( mpegVersion === 'V2' ) return 24_000 
      if ( mpegVersion === 'V2.5' ) return 12_000  

    }
    
    if ( index === '10' ){

      if ( mpegVersion === 'V1' ) return 32_000  
      if ( mpegVersion === 'V2' ) return 16_000  
      if ( mpegVersion === 'V2.5' ) return 8_000   

    }

    return 0

  }


  private getSamplesPerFrame( layer: string, mpegVersion: string ): number {

    if ( layer === '1' ){

      if ( mpegVersion === 'V1' ) return 384
      if ( mpegVersion === 'V2' ) return 384
      if ( mpegVersion === 'V2.5' ) return 384

    }
    
    if ( layer === '2' ){

      if ( mpegVersion === 'V1' ) return 1152
      if ( mpegVersion === 'V2' ) return 1152
      if ( mpegVersion === 'V2.5' ) return 1152

    }
    
    if ( layer === '3' ){

      if ( mpegVersion === 'V1' ) return 1152
      if ( mpegVersion === 'V2' ) return 576
      if ( mpegVersion === 'V2.5' ) return 576

    }

    return 0

  }


}