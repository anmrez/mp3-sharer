import { HomeController } from "./home/home.controller.ts";
import { ReaderService } from "./reader/reader.service.ts";



export class Router{


  constructor(
    private readonly homeController: HomeController,
    private readonly readerService: ReaderService
  ){}


  async routes( req: Request, res: any ){

    const urlPath = new URL( req.url ).pathname
    
    console.log( '[Router]  - request (' + req.method, urlPath + ')' )

    switch ( true ) {
      case urlPath === '/' :
        this.homeController.get( req, res )
      break;


      case new RegExp( '/assets' ).test(urlPath):
        await this.readAssets( res, urlPath )
      break;


      case urlPath === '/favicon.ico':
        //1
        res( new Response( undefined, {
          status: 200
        } ) )
      break;


      default:
        await this.send404( res )
      break;
    }


  }



  private async send404( res: any ){

    const file = await this.readerService.read( './client/404.html' )
    if ( file === undefined ) {

      res( new Response( '404', {
        status: 404
      }))
      return;

    }

    res( new Response( file.readable, {
      status: 404,
      headers: {
        'content-type': 'text/html'
      }
    }))

  }



  private async readAssets( res: any, filePath: string ){

    const assentsPath = './client' + filePath
    const file = await this.readerService.read( assentsPath )

    if ( file === undefined ) {

      res( new Response( '404', {
        status: 404
      }))
      return;

    }

    const headers = new Headers()


    switch (true){

      case new RegExp( '.js' ).test( filePath ):
        headers.append( 'content-type', 'application/javascript' ) 
      break;
      
      case new RegExp( '.css' ).test( filePath ):
        headers.append( 'content-type', 'text/css' ) 
      break;

    }

    res( new Response( file.readable, {
      status: 200,
      headers: headers
    }))

  }




}