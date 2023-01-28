

export class GetMusick{

  testData = [
    { 
      number: 1,
      date: '11.11',
      duration: 300,
      title: 'Always Wishing You Were Somewhere Else ',
      author: 'Hammock',
      users: [
        {
          status: 3,
          message: ''
        },
        {
          status: 2,
          message: 'Мне очень понравилось'
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: 1,
          message: 'Фигня какая та'
        },
      ]
    },
    { 
      number: 2,
      date: '01.11',
      duration: 166,
      title: 'Iris',
      author: 'Nyarons',
      users: [
        {
          status: 1,
          message: 'Мусор'
        },
        {
          status: 3,
          message: 'Это круто!'
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
      ]
    },
    { 
      number: 3,
      date: '01.11',
      duration: 364,
      title: 'Borrowing the Past',
      author: 'Rhian Sheehan',
      users: [
        {
          status: 0,
          message: ''
        },
        {
          status: 3,
          message: 'Мне очень понравилос'
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
      ]
    },
    { 
      number: 4,
      date: '01.11',
      duration: 243,
      title: 'My Shoulder Covered With Stars',
      author: 'Rhian Sheehan',
      users: [
        {
          status: 3,
          message: ''
        },
        {
          status: -1,
          message: 'Мне очень понравилос'
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
        {
          status: -1,
          message: ''
        },
      ]
    },
    { 
      number: 5,
      date: '02.11',
      duration: 59,
      title: 'No Agenda',
      author: 'Rhian Sheehan'
    },
    { 
      number: 6,
      date: '02.05',
      duration: 66,
      title: 'watashi igai watashi ja naino',
      author: 'gesunokiwamiotome'
    },
    { 
      number: 7,
      date: '02.05',
      duration: 174,
      title: 'ikenai dance',
      author: 'gesunokiwamiotome'
    },
    { 
      number: 8,
      date: '02.05',
      duration: 145,
      title: 'Longer Nights',
      author: 'Prithvi, Trix.'
    },
    { 
      number: 9,
      date: '02.05',
      duration: 166,
      title: 'Nightscapes',
      author: 'Prithvi'
    },
  ]

  constructor(){


    let dataArray = this.get()

    // const json = JSON.stringify( dataArray[0] )
    // console.log( 'length json = ' + json.length )

    this.set( dataArray )

  }



  get(){

    return this.testData

  }


  set( dataArray ){

    const table = document.querySelector( '#musickTable' )

    table.replaceChildren()

    dataArray.forEach( ( item, index ) => {
      
      setTimeout( this._addItem.bind( this ), 50 + index * 40, table, item )

    });

  }


  _addItem( table, item ){


    const tr = document.createElement( 'tr' );

    tr.classList.add( 'table_row' )
    tr.align = 'center'

    const tdID = this._createTDID( item )
    const tdDate = this._createTDDate( item )
    const tdDuration = this._createTDDuration( item )
    const tdPlay = this._createTDPlay( item )
    const tdTitle = this._createTDTitle( item )
    const tdAuthor = this._createTDAuthor( item )
    const arrayTDUsers = this._createTDUsers( item )

    tr.append( tdID )
    tr.append( tdDate )
    tr.append( tdDuration )
    tr.append( tdPlay )
    tr.append( tdTitle )
    tr.append( tdAuthor )


    arrayTDUsers.forEach( item => {
      tr.append( item )
    })


    table.append( tr )

  }


  _createTDID( item ){

    const td = document.createElement( 'td' );

    td.innerHTML = item.number

    td.classList.add( 'padding_x_1' )
    td.classList.add( 'text_0_75' )
    td.classList.add( 'color_dark' )

    return td

  }


  _createTDDate( item ){

    const td = document.createElement( 'td' );

    td.innerHTML = item.date

    return td

  }
  

  _createTDDuration( item ){

    const td = document.createElement( 'td' );

    let minute = Math.floor( item.duration / 60 )
    let sercond = item.duration - minute * 60

    if ( minute.toString().length === 1 ) minute = '0' + minute
    if ( sercond.toString().length === 1 ) sercond = '0' + sercond


    td.innerHTML = minute + ':' + sercond

    return td

  }


  _createTDPlay( item ){

    const td = document.createElement( 'td' );

    td.classList.add( 'pointer' )
    // td.innerHTML = '►'


    return td

  }


  _createTDTitle( item ){

    const td = document.createElement( 'td' );

    td.classList.add( 'padding_x_1' )

    if ( item.title.length > 30 ) {

      let sub = item.title.substring( 0, 30 )
      td.innerHTML = sub + '...'
      return td
      
    }
    
    td.innerHTML = item.title
    return td

  }


  _createTDAuthor( item ){

    const td = document.createElement( 'td' );

    td.classList.add( 'padding_x_1' )
    td.innerHTML = item.author

    return td

  }


  _createTDUsers( item ){

    let tdUsers = []
    let index = 0

    while ( 6 > index ) {

      const td = document.createElement( 'td' );
      const span = document.createElement( 'span' )
      span.classList.add( 'round_status' )

      if ( item.users ){
        if ( item.users[index].status === 0 ) span.style.background = '#ff000077'
        if ( item.users[index].status === 1 ) span.style.background = '#ffff0077'
        if ( item.users[index].status === 2 ) span.style.background = '#00ff0077'
        if ( item.users[index].status === 3 ) span.style.background = '#8b00ff77'
        if ( item.users[index].message ) { 

          span.text = item.users[index].message
          span.addEventListener( 'mousemove', this._addStatusHover )
          span.addEventListener( 'mouseout', this._addStatusOut, item.users[index].message )

        }
      }

      td.append( span )
      tdUsers.push( td )

      index++

    }

    return tdUsers

  }


  _addStatusHover( event ) {

    // console.log( event.target.text ) 
    let tooltip = document.querySelector( '#tooltip' )
    let X = event.clientX
    let Y = event.clientY
    let text = event.target.text

    tooltip.classList.remove( 'none' )
    tooltip.style.left = X + 'px'
    tooltip.style.top = Y + 'px'
    tooltip.innerHTML = text

  }


  _addStatusOut(){

    document.querySelector( '#tooltip' ).classList.add( 'none' )

  }


}