import { ReaderModule } from "../reader/reader.module.ts";
import { HomeController } from "./home.controller.ts";
import { HomeService } from "./home.service.ts";



export class HomeModule{

  service: HomeService
  contoller: HomeController

  constructor(
    private readonly readerModule: ReaderModule
  ){

    this.service = new HomeService()
    this.contoller = new HomeController(
      this.service,
      this.readerModule.service
    )

  }


}