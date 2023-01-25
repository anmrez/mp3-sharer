import { GeneratorModule } from "../generator/generator.module.ts";
import { UserDBServices } from "./userdb.services.ts";




export class UserDBModule{


  service: UserDBServices
  

  constructor(
    private readonly generatorModule: GeneratorModule
  ){

    this.service = new UserDBServices( this.generatorModule.service )

  }


}