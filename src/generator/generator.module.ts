import { GeneratorService } from "./generator.service.ts"


export class GeneratorModule{

  service: GeneratorService


  constructor(){

    this.service = new GeneratorService()

  }


}