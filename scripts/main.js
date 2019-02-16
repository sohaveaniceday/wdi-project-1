window.addEventListener('DOMContentLoaded', () => {

  //Declaring Global Variabkes

  const newGridDiv = []
  const players = []
  const directionArray = ['Vertical','Horizontal']
  let user = null
  let comp = null
  let aircraftCarrier = null
  let battleship = null
  let submarine = null
  let destroyer = null
  let patrolBoat = null

  //Declaring Global DOM Variables

  const userGrid = document.querySelector('.user-grid')
  const compGrid = document.querySelector('.comp-grid')

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
    constructor(name, size, hp, maxHoriztonal, maxVertical) {
      this.name = name
      this.size = size
      this.hp = hp
      this.maxHoriztonal = maxHoriztonal
      this.maxVertical = maxVertical
      Ship.classification = 'ship'
    }

    hit() {
      this.hp--
    }

  }

  //Setup Function: Player + Ship Construction + pushing into arrays

  function setup() {

    user = new Player('user')
    comp = new Player('comp')

    aircraftCarrier = new Ship('Aircraft Carrier', 5, 5, 6, 60)
    battleship = new Ship('Battleship', 4, 4, 7, 70)
    submarine = new Ship('Submarine', 3, 3, 8, 80)
    destroyer = new Ship('Destroyer', 3, 3, 8, 80)
    patrolBoat = new Ship('Patrol Boat', 2, 2, 9, 90)

    user.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
    comp.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
    players.push(user, comp)

    console.log(players)

    buildGrid(userGrid, user)
    buildGrid(compGrid, comp)

  }

  // Build Grid Function

  function buildGrid(grid, player) {
    for (let i = 1; i <= player.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', `${player.type}-div grid-div`)
      newGridDiv[i].setAttribute('data-id', i)
      newGridDiv[i].innerHTML = [i]
      // newGridDiv[i].addEventListener('click', () => console.log(newGridDiv[i].classList))
      newGridDiv[i].addEventListener('click', userSelection)
      grid.appendChild(newGridDiv[i])
    }
  }





  // Boat Selections Functions

  // function compSelection() {
  //   for (let i = 0; i <= comp.ships.length; i++) {
  //     const direction = directionArray[Math.floor(Math.random() * 2)]
  //     if (direction === 'Vertical') {
  //       console.log(comp.ships[i].maxVertical)
  //       // comp.grid.splice(Math.floor(Math.random() * comp.ships[i].maxVertical), 1, comp.ships[i])
  //     }
  //   }
  // }

  function userSelection(e) {
    if (e.target.classList.contains('user-div') && parseInt(e.target.dataset.id) <= aircraftCarrier.maxVertical) {
      for (let i = 0; i < aircraftCarrier.size; i++) {
        user.grid.splice(parseInt(e.target.dataset.id) + i * 10, 1, aircraftCarrier)

        // console.log(typeof(parseInt(e.target.dataset.id)))
      }
      console.log(user.grid)
    }
  }






  //Function calling

  setup()




  // const ship1 = 'ship 1'
  //
  // userArray.splice(7, 1, ship1)
  //

  // new Game(number calls amount of div's in grid)




})
