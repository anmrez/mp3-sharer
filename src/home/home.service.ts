import { ResponseService } from '../response/response.service.ts';




export class HomeService{


  constructor(
    private readonly responseService: ResponseService
  ){}


  gethomepage( req: Request ): Promise< Response > {

    const device = this.getDeviceType( req )
    if ( device === 'mobile' ) return this.responseService.readFile( './client/Mobile.html' )

    return this.responseService.readFile( './client/PC.html' )

  }


  private getDeviceType( req: Request ): 'mobile' | 'pc' {

    const useragent = req.headers.get( 'user-agent' )
    if ( useragent === null ) return 'pc'

    const reg = new RegExp( 'Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', 'gi' )
    
    if ( reg.test( useragent ) ) return 'mobile'

    return 'pc'

  }



}