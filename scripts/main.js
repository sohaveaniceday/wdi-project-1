window.addEventListener('DOMContentLoaded', () => {

  //Declaring Global Variabkes

  const newGridDiv = []
  const players = []
  const directionArray = ['Vertical','Horizontal']

  //Contructors

  class Player {
    constructor(type) {
      this.type = type
      this.ships = []
      this.grid = new Array(100)
      Player.classification = 'player'
    }
  }

  class Ship {
    constructor(name, length, hp, maxHoriztonal, maxVertical) {
      this.name = name
      this.length = length
      this.hp = hp
      this.maxHoriztonal = maxHoriztonal
      this.maxVertical = maxVertical
      Ship.classification = 'ship'
    }

    hit() {
      this.hp--
    }

  }

  //Player + Ship Construction + pushing into arrays

  const user = new Player('user')
  const comp = new Player('comp')

  const aircraftCarrier = new Ship('Aircraft Carrier', 5, 5, 6, 60)
  const battleship = new Ship('Battleship', 4, 4, 7, 70)
  const submarine = new Ship('Submarine', 3, 3, 8, 80)
  const destroyer = new Ship('Destroyer', 3, 3, 8, 80)
  const patrolBoat = new Ship('Patrol Boat', 2, 2, 9, 90)

  user.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
  comp.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
  players.push(user, comp)

  console.log(players)

  //Declaring DOM Variables

  const userGrid = document.querySelector('.user-grid')
  const compGrid = document.querySelector('.comp-grid')

  //Build User Grid

  function buildUserGrid() {
    for (let i = 1; i <= user.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', 'gridDiv')
      newGridDiv[i].innerHTML = [i]
      userGrid.appendChild(newGridDiv[i])
    }
  }

  //Build Comp Grid

  function buildCompGrid() {
    for (let i = 1; i <= comp.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', 'gridDiv')
      newGridDiv[i].innerHTML = [i]
      compGrid.appendChild(newGridDiv[i])
    }
  }

  //Build Grid functions
  
  function buildCompGrid() {
    for (let i = 1; i <= comp.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', 'gridDiv')
      newGridDiv[i].innerHTML = [i]
      compGrid.appendChild(newGridDiv[i])
    }
  }

  // Boat Selections

  function compSelction() {
    const direction = directionArray[Math.floor(Math.random() * 2)]
    if (direction === 'Vertical') {
      compArray.splice(7, 1, aircraftCarrier)
    }
  }

  //Function declarations

  buildUserGrid()
  buildCompGrid()
  compSelction()




  // const ship1 = 'ship 1'
  //
  // userArray.splice(7, 1, ship1)
  //
  // console.log(userArray[7])

  // new Game(number calls amount of div's in grid)

  //Calling functions



})
