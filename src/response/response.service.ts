

export class ResponseService{


  async readFile( filePath: string, status: number = 200 ): Promise< Response > {

    let file: Deno.FsFile | undefined

    try{

      file = await Deno.open( filePath, { read: true } );

    } catch {

      return new Response( 'error reading file: ' + filePath, { status: 500 } )

    }

    if ( !file ) return new Response( 'error reading file: ' + filePath, { status: 500 } ) 

    const readableStream = file.readable;

    const headers = new Headers()
    if ( filePath.includes( '.js' ) ) headers.set('content-type', 'application/javascript')
    
    return new Response( readableStream, { 
      status: status,
      headers: headers
    } )

  }


  readFileStatic( req: Request ): Promise< Response > {

    const path = new URL( req.url ).pathname
    return this.readFile( './client/' + path )

  }


  response404(): Response {

    return new Response( JSON.stringify({status: 404, message: 'not found'}), {
      status: 404,
      headers:{
        'content-type': 'application/json'
      }
    })

  }


  logout( status = 200 ): Response {

    return new Response( null, {
      status: status,
      headers: {
        'Set-cookie': 'token=0;max-age=-1'
      }
    } )

  }


  redirect( path: string ): Response {

    return new Response( null, {
      status: 301,
      headers: {
        'Location' : path
      }
    } )

  }
  

}