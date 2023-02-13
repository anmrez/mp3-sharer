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


  async routes( req: Request ): Promise< Response >{

    const urlPath = new URL( req.url ).pathname
    
    console.log( '[' + urlPath + " | " + req.method + ']' )



    // TOTAL REQUEST === ==
    switch ( true ) {

      case urlPath === '/favicon.svg':
        return this.readStatic( urlPath )

      case urlPath === '/login' && req.method === 'POST':
        return this.authController.sendEmail( req )
      
      case new RegExp( '/login/' ).test( urlPath ) && req.method === 'GET':{
        const result = await this.authController.login( req )
        if ( result === '404' ) return await this.sendLoginHTML()
        else return result
      }

    }



    // IF USER UNDEFINED
    const user = await this.mySQLController.getUser( req )
    if ( user === null ){
      
      return await this.sendLoginHTML()
      
    }

    

    // REQUEST OF AUTH USER === ===
    switch ( true ) {

      case urlPath === '/': return this.homeController.get( req )


      case new RegExp( '/assets' ).test(urlPath) && req.method === 'GET':{

        const filePath = urlPath.substring( urlPath.indexOf( '/assets' ), urlPath.length )
        return await this.readAssets( filePath )
         
      }


      case urlPath === '/getProfile' && req.method === 'POST': 
        return this.profileController.get( req )


      case urlPath === '/getSounds' && req.method === 'GET':
        return this.mySQLController.getAllSounds()
      

      case urlPath === '/getSoundsInArchive' && req.method === 'GET':
        return this.mySQLController.getAllSoundsInArchive()


      case urlPath === '/getComment' && req.method === 'POST':
        return this.mySQLController.getComment( req )

      
      case urlPath === '/setComment' && req.method === 'POST':
        return this.mySQLController.addCommet( req )


      case new RegExp( '/static/' ).test( urlPath ):
        return this.readStatic( urlPath )


      case urlPath === '/upload' && req.method === 'POST':
        return this.uploadController.write( req )


      case urlPath === '/getUsers' && req.method === 'GET':
        return this.profileController.getAllUsers()


      default: return await this.send404()
      
    }


  }



  private async send404(): Promise< Response >{

    const file = await this.readerService.read( './client/404.html' )
    if ( file === undefined ) return new Response( '404', {
      status: 404
    } )

    return new Response( file.readable, {
      status: 404,
      headers: {
        'content-type': 'text/html'
      }
    } )

  }


  private async readStatic( filePath: string ): Promise<Response> {


    try {


      const staticPath = './client' + filePath
      const file = await this.readerService.read( staticPath )
      if ( file === undefined ) return new Response( '404', {
        status: 404
      })
  
      return new Response( file.readable, {
        status: 200,
      })

      
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

      return new Response( 'Error reading file', {
        status: 500,
      })


    }


  }


  private async readAssets( filePath: string ): Promise< Response > {

    const assentsPath = './client' + filePath
    const file = await this.readerService.read( assentsPath )

    if ( file === undefined ) return new Response( '404', {
      status: 404
    } )

    const headers = new Headers()

    switch (true){

      case new RegExp( '.js' ).test( filePath ):
        headers.append( 'content-type', 'application/javascript' ) 
      break;
      
      case new RegExp( '.css' ).test( filePath ):
        headers.append( 'content-type', 'text/css' ) 
      break;

    }

    return new Response( file.readable, {
      status: 200,
      headers: headers
    } )

  }


  private async sendLoginHTML(): Promise< Response >{

    const staticPath = './client/Login.html'
    const file = await this.readerService.read( staticPath )
    if ( file === undefined ) {

      return new Response( '404', {
        status: 404
      })

    }

    return new Response( file.readable, {
      status: 200,
    })

  }

}