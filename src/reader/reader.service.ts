

export class ReaderService{


  async read( filePath: string ){

    let file;

    file = await Deno.open( filePath, { read: true } );

    return file

  }


}