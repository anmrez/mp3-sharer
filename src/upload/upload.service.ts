import { MySQLService } from '../mysql/mysql.service.ts';


export class UploadService{


  constructor(
    private readonly mySQLService: MySQLService
  ){}



  async write( req: Request, res: any ){


    try {


      const body = new Uint8Array( await req.arrayBuffer() )
      
      let frame = this.getFrame( body, 0 )
      const title = this.decoder( frame.data )

      frame = this.getFrame( body, frame.index )
      const author = this.decoder( frame.data )

      console.log( '\n' )
      console.log( author + ' – ' + title )
      console.log( '\n' )

      const sound = body.slice( frame.index, body.length )
      const duration = this.getDuration( sound )

      const lastId = await this.mySQLService.setSound( title, author, duration )
      if ( lastId === null ) {
        res( new Response( 'Ошибка при записи в БД', { status: 500 } ) )
        return;
      } 
      await this.mySQLService.addComment( lastId, 1, 10, '' )

      await Deno.writeFile( './client/static/mp3/' + lastId + '.mp3', sound )

      res( new Response( undefined, { status: 200 } ) )


    } catch ( err ) {


      console.log( '\n\n' )
      console.log( new Date() )
      console.log( err )
      console.log( '\n\n' )

      res( new Response( undefined, { status: 500 } ) )      
      

    }


  }


  // PRIVATE === ===


  private getFrame( data: Uint8Array, startIndex: number ): { data: Uint8Array, index: number } {
  
  
    const result: number[] = []

    let index = startIndex
    while ( data.length > index ){

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


  private decoder( array: Uint8Array ): string {

    let result =''
    let index = 0

    while ( array.length > index ){
      
      if ( array[index + 1] === 0 ) result += String.fromCharCode( array[index] )
      if ( array[index + 1] !== 0 ) {
        
        const item1 = array[index].toString()
        const str1 = parseInt( item1, 10 ).toString(16)
        
        const item2 = array[index + 1].toString()
        let str2 = parseInt( item2, 10 ).toString(16)
        if ( str2.length === 1 ) str2 = '0' + str2
        
        const str = str1 + str2
        result += String.fromCharCode( parseInt( str, 16 ) )

      }

      index += 2

    }

    return result

  }


  private getDuration( sound: Uint8Array ){

    const lengthID3 = this.getID3length( sound )

    const header = this.getAudioFrameHeader( sound, lengthID3 )

    const mpegVersion = this.getMPEGVersion( header )
    const layer = this.getLayer( header )
    const bitrate = this.getBitrate( header, mpegVersion, layer )

    const duration = ( sound.length - lengthID3 ) / bitrate / 1000 * 8

    return Math.floor( duration )

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



}