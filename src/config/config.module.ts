import { ConfigService } from "./config.service.ts";


export interface IServerConfig{
  port: number,
  address: string,
  maxSize: number,
  logger: boolean
}


export interface ISMTPConfig{
  hostname: string
  port: number
  username: string
  password: string
}


export interface IMySQLConfig{
  hostname: string,
  username: string,
  db: string,
  password: string,
  port: number
}

export interface IUser{
  username: string,
  email: string,
  image: string
}


export class ConfigModule{

  private service: ConfigService
  public readonly server: IServerConfig
  public readonly smtp: ISMTPConfig
  public readonly mysql: IMySQLConfig
  public readonly users: IUser[] = []

  constructor( env: Record<string, string> ){

    this.service = new ConfigService( env )

    this.server = this.service.server
    this.smtp = this.service.smtp
    this.mysql = this.service.mysql
    this.users = this.service.users

  }


}