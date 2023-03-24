import { ResponseService } from '../response/response.service.ts';
import { LoggerService } from '../logger/logger.service.ts';


type callback = ( req: Request ) => Response | Promise< Response >


export class Router{


  private routes = new Map< string, callback >()
  private routesStatic = new Map< string, callback >()


  constructor(
    private readonly responseService: ResponseService,
    private readonly LoggerService: LoggerService
  ){}


  get( path: string, callback: callback ): void {

    if ( path.includes( '/**' ) ){
      this.createRouteStatic( path, callback, 'GET' )
      return
    } 

    const key = path + ' | GET'
    this.createRoute( key, callback )

  }


  post( path: string, callback: callback ){

    const key = path + ' | POST'
    this.createRoute( key, callback )

  }


  use( req: Request ): Response | Promise< Response >{

    const path = new URL( req.url ).pathname
    const method = req.method
    const key = path + ' | ' + method
    this.LoggerService.log( 'Router', 'request on ' + key )

    const callback = this.getRouting( key )
    if ( callback ) return callback( req )

    return this.responseService.response404()

  }


  // PRIVATE === ===
  private checkRoute( key: string ): boolean {

    return this.routes.has( key )

  }


  private createRoute( key: string, callback: callback ){

    if ( this.checkRoute( key ) ) throw '[Router] - key - (' + key + ') is exist'

    this.routes.set( key, callback )
    this.LoggerService.log( 'Router', 'route add (' + key + ')' )

  }


  private createRouteStatic( path: string, callback: callback, method: string ){

    const key = path.substring( 0, path.length - 2 ) + ' | ' + method
    this.routesStatic.set( key, callback )
    this.LoggerService.log( 'Router', 'static route add (' + key + ')' )

  }


  private getRouting( key: string ): callback | undefined {

    let callback = this.routes.get( key )
    if ( callback ) return callback

    const staticIterator = this.routesStatic.keys()
    let index = 0

    while ( this.routesStatic.size !== index ){

      const statickKey = staticIterator.next().value

      const statickPath = statickKey.split( ' | ' )[0]
      const statickMethod = statickKey.split( ' | ' )[1]

      const requestPath = key.split( ' | ' )[0]
      const requestMethod = key.split( ' | ' )[1]


      if ( requestPath.startsWith( statickPath ) )
      if ( requestMethod === statickMethod )
        callback = this.routesStatic.get( statickKey )

      index++

    }

    // if ( callback ) return callback
    return callback

  }


}