



export class ReaderService{



  async read( filePath: string ){

    let file;

    try {

      file = await Deno.open( filePath, { read: true });

    } catch ( err ) {

      console.log( '[Reader service]  - error:' )
      console.log( err )
      return undefined

    }

    return file

  }



}