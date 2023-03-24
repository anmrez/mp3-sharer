import { ResponseService } from '../response/response.service.ts';
import { MySQLServiceSoundtrack } from '../mysql/mysql.service.soundtrack.ts';
import { soundtrackDTO } from "../mysql/dto/soundtrack.dto.ts";


export class HomeService{


  constructor(
    private readonly responseService: ResponseService,
    private readonly mySQLServiceSoundtrack: MySQLServiceSoundtrack
  ){}


  async searchHandler( req: Request ): Promise< Response > {

    const search = await req.text()

    const searchResult = await this.mySQLServiceSoundtrack.searchByTitleORAuthorORID( search )
    if ( searchResult === null ) return new Response( null, { status: 404 } )
    
    if ( searchResult.length > 10 ) {
      
      let newSearchResult: any = searchResult.slice( 0,10 )
      newSearchResult.push( searchResult.length - 10 )

      return new Response( JSON.stringify( newSearchResult ) )

    }
    
    return new Response( JSON.stringify( searchResult ) )

  }

  gethomepage( req: Request ): Promise< Response > {

    const device = this.getDeviceType( req )
    if ( device === 'mobile' ) return this.responseService.readFile( './client/Mobile.html' )

    return this.responseService.readFile( './client/PC.html' )

  }


  // PRIVATE --- ---
  private getDeviceType( req: Request ): 'mobile' | 'pc' {

    const useragent = req.headers.get( 'user-agent' )
    if ( useragent === null ) return 'pc'

    const reg = new RegExp( 'Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', 'gi' )
    
    if ( reg.test( useragent ) ) return 'mobile'

    return 'pc'

  }



}