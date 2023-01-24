



export class HomeService{


  constructor(){}


  getDeviceType( req: Request ): 'mobile' | 'pc' {

    const useragent = req.headers.get( 'user-agent' )
    if ( useragent === null ) return 'pc'

    const reg = new RegExp( 'Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', 'gi' )
    
    if ( reg.test( useragent ) ) return 'mobile'

    return 'pc'

  }



}