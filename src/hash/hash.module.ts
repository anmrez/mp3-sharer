import { HashService } from "./hash.service.ts";



export class HashModule{

  public readonly service: HashService

  constructor(){

    this.service = new HashService()

  }



}