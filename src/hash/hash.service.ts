import hash from "https://deno.land/x/object_hash@2.0.3.1/mod.ts";

export class HashService{


  constructor(){}


  generateHash( data: Uint8Array ): string {

    const stringData = data.join('')
    const hashResult = hash.sha1( stringData )
    
    return hashResult.slice( 0, 40 )

  }


}