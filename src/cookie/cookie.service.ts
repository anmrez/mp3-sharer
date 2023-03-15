


export class CookieService{


  constructor(){}


  get( req: Request, find: string ): string | null {

    const cookie = req.headers.get( 'cookie' )
    if ( cookie === null ) return null

    const findItem = this.parser( cookie, find )
    if ( findItem ) return findItem

    return null

  }


  private parser( cookie: string, find: string ): string | null {

    const arrItmes = cookie.split('; ')

    let index = 0
    while ( arrItmes.length !== index ){

      const item = arrItmes[index]
      if ( item.startsWith( find + '=' ) ) return item.split('=')[1]

      index++

    }

    return null

  }


}