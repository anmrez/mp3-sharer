import { CookieService } from "./cookie.service.ts";



export class CookieModule{

  public service: CookieService

  constructor(){
    this.service = new CookieService()
  }

}