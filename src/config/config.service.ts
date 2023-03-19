import { IMySQLConfig, IServerConfig, ISMTPConfig, IUser } from "./config.module.ts";


export class ConfigService{

  public readonly server: IServerConfig
  public readonly smtp: ISMTPConfig
  public readonly mysql: IMySQLConfig
  public readonly users: IUser[] = []

  constructor( 
    private readonly env: Record< string, string >,
  ){

    this.server = this.readServerData()
    this.smtp = this.readSMTPData()
    this.mysql = this.readMySQLData()
    this.users = this.readUsersData()

  }


  readServerData(): IServerConfig {

    let port: number | string | undefined = this.env['PORT']
    this.isDefined( port, 'PORT' )
    port = this.inNumber( port, 'PORT' )
    
    const address: string | undefined = this.env['ADDRESS']
    this.isDefined( address, 'ADDRESS' )
    
    
    let maxSize: number | string | undefined = this.env['MAXSIZE']
    this.isDefined( maxSize, 'MAXSIZE' )
    maxSize = this.inNumber( maxSize, 'MAXSIZE' )
    

    let logger: boolean | string | undefined = this.env['LOGGER']
    logger = this.inBoolean( logger )
    // maxSize = this.inNumber( logger, 'MAXSIZE' )


    return {
      port: port,
      address: address,
      maxSize: maxSize,
      logger: logger
    }

  }

  
  readSMTPData(): ISMTPConfig {

    const hostname: string | undefined = this.env['SMTP_HOSTNAME']
    this.isDefined( hostname, 'SMTP_HOSTNAME' )
    
    let port: number | string | undefined = this.env['SMTP_PORT']
    this.isDefined( port, 'SMTP_PORT' )
    port = this.inNumber( port, 'SMTP_PORT' )
    
    const username: string | undefined = this.env['SMTP_USERNAME']
    this.isDefined( username, 'SMTP_USERNAME' )


    const password: string | undefined = this.env['SMTP_PASSWORD']
    this.isDefined( password, 'SMTP_PASSWORD' )


    return {
      hostname: hostname,
      port: port,
      username: username,
      password: password,
    }

  }


  readMySQLData(): IMySQLConfig {

    const hostname: string | undefined = this.env['MYSQL_HOSTNAME']
    this.isDefined( hostname, 'MYSQL_HOSTNAME' )
    
    const username: string | undefined = this.env['MYSQL_USERNAME']
    this.isDefined( username, 'MYSQL_USERNAME' )
    
    const db: string | undefined = this.env['MYSQL_DB']
    this.isDefined( db, 'MYSQL_DB' )
    
    const password: string | undefined = this.env['MYSQL_PASSWORD']
    this.isDefined( password, 'MYSQL_PASSWORD' )
    
    let port: number | string | undefined = this.env['MYSQL_PORT']
    this.isDefined( port, 'MYSQL_PORT' )
    port = this.inNumber( port, 'MYSQL_PORT' )

    return {
      hostname: hostname,
      username: username,
      db: db,
      password: password,
      port: port
    }

  }


  readUsersData(): IUser[] {

    const result: IUser[] = []
    let index = 1
    while( index !== 6 ){

      const user = this.readUser( index )
      if ( user ) result.push( user )

      index++

    }

    return result

  }


  // PRIVATE === ===
  private isDefined( value: string, param: string ): void {

    if ( value === undefined ) throw '[.env] - ' + param + ' undefined'

  }


  private inNumber( value: string, param: string ): number {

    if ( isNaN( Number( value ) ) ) throw '[.env] - ' + param + ' not number'
    return Number( value )

  }


  private inBoolean( value: string ): boolean {

    if ( value === 'true' ) return true
    return false

  }


  private readUser( id: number ): undefined | IUser {

    const key = 'USER' + id

    const username: string | undefined = this.env[ key + '_NAME']
    if ( username === undefined || username === '' ) return undefined
    
    const email: string | undefined = this.env[ key + '_EMAIL']
    if ( email === undefined || email === '' ) throw '[.env] - ' + key + '_EMAIL undefined'
    
    let image: string | undefined = this.env[ key + '_ICON']
    if ( image === undefined ) image = 'default.png'


    return {
      username: username,
      email: email,
      image: image
    }

  }


}