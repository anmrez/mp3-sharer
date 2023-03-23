import { ConfigModule } from "../config/config.module.ts"



export class LoggerService{


  constructor(
    private readonly config: ConfigModule
  ){}


  log( module: string, message: string ){

    if ( ! this.config.server.logger ) return; // exit

    const log = '[' + module + '] – ' + message
    console.log( log )

  }


  async logError( message: string, responseMessage: string ): Promise< Response > {

    const log = '\n\n' + this.getCurrentTime() + '\n' + message + '\n--- --- --- \n'
    
    await this.writeIntoLogFile( log )
    console.log( log )

    return new Response( responseMessage, { status: 500 } )

  }


  // PRIVATE --- ---
  private getCurrentTime(): string {

    const date = new Date()

    const year = date.getFullYear()
    let month: number | string = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    let second: number | string = date.getSeconds()

    if ( month < 10 ) month = '0' + month
    if ( second < 10 ) second = '0' + second

    const currentDate = `--- ${ year }.${ month }.${ day } - ${ hour }:${ minute }:${ second } ---`

    return currentDate

  }


  private async writeIntoLogFile( message: string ){

    const projectPath = Deno.cwd() + '/error.log'

    // message in uint8
    const messageBlob = new Blob( [ message ] )
    const messageBuffer = await messageBlob.arrayBuffer()
    const messageUint8 = new Uint8Array( messageBuffer )
    
    try {

      // write data
      const dataLogFile = await Deno.readFile( projectPath )
      const newDataLogFile = new Uint8Array( [ ...messageUint8, ...dataLogFile ] )
      await Deno.writeFile( projectPath, newDataLogFile )
      
      
    } catch {

      // create file
      await Deno.create( projectPath )

      // write data
      const dataLogFile = await Deno.readFile( projectPath )
      const newDataLogFile = new Uint8Array( [ ...messageUint8, ...dataLogFile ] )
      await Deno.writeFile( projectPath, newDataLogFile )
      
    } finally {

      console.log( 'Не удалось записать ошибку в файл' )

    }

  }

}