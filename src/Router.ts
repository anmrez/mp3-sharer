// deno-lint-ignore-file no-explicit-any
import { AuthController } from "./auth/auth.controller.ts";
import { HomeController } from "./home/home.controller.ts";
import { ReaderService } from "./reader/reader.service.ts";
import { ProfileController } from './profile/profile.controller.ts';
import { UploadController } from './upload/upload.controller.ts';
import { MySQLController } from './mysql/mysql.controller.ts';



export class Router{


  constructor(
    private readonly homeController: HomeController,
    private readonly readerService: ReaderService,
    private readonly authController: AuthController,
    private readonly profileController: ProfileController,
    private readonly uploadController: UploadController,
    private readonly mySQLController: MySQLController
  ){}


  async routes( req: Request, res: any ){

    const urlPath = new URL( req.url ).pathname
    
    // console.log( '[Router]  - request (' + req.method, urlPath + ')' )

    switch ( true ) {
      case urlPath === '/' :
        this.homeController.get( req, res )
      break;


      case new RegExp( '/assets' ).test(urlPath) && req.method === 'GET':
        await this.readAssets( res, urlPath.substring( urlPath.indexOf( '/assets' ), urlPath.length ) )
      break;


      case urlPath === '/getProfile' && req.method === 'POST': 
        this.profileController.get( req, res )
      break;


      case urlPath === '/getSounds' && req.method === 'GET':
        this.mySQLController.getAllSounds( req, res )
      break;


      case new RegExp( '/static/' ).test( urlPath ):
        console.log( 'get file: ' + urlPath )
        this.readStatic( res, urlPath )
      break;


      case urlPath === '/upload' && req.method === 'POST':
        this.uploadController.write( req, res )
      break;


      case urlPath === '/login' && req.method === 'POST':
        this.authController.sendEmail( req, res )
        break;
        
        
      case new RegExp( '/login/' ).test( urlPath ) && req.method === 'GET':
        if ( await this.authController.login( req, res ) === '404' ) this.send404( res )
      break;
      

      case urlPath === '/favicon.ico':
        res( new Response( undefined, {
          status: 200
        } ) )
      break;



      case urlPath === '/getUsers':
        this.authController.getAllUsersInConsole()
        await this.send404( res )
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


  private async readStatic( res: any, filePath: string ){

    const staticPath = './client' + filePath
    const file = await this.readerService.read( staticPath )
    if ( file === undefined ) {

      res( new Response( '404', {
        status: 404
      }))
      return;

    }

    res( new Response( file.readable, {
      status: 200,
      // headers: headers
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