window.addEventListener('DOMContentLoaded', () => {

  //Declaring Global Variabkes

  const newGridDiv = []
  const newShipDiv = []

  const players = []
  const directionArray = ['Vertical','Horizontal']

  let user = null
  let comp = null

  let aircraftCarrier = null
  let battleship = null
  let submarine = null
  let destroyer = null
  let patrolBoat = null

  let currentShip = null

  //Declaring Global DOM Variables

  const userGrid = document.querySelector('.user-grid')
  const compGrid = document.querySelector('.comp-grid')
  const userShips = document.querySelector('.user-ships')
  const compShips = document.querySelector('.comp-ships')
  const axis = document.querySelector('.axis')
  const instructionsText = document.querySelector('.instructions-text')

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
    constructor(type, id, size, hp, maxHoriztonal, maxVertical, image) {
      this.type = type
      this.id = id
      this.size = size
      this.hp = hp
      this.maxHoriztonal = maxHoriztonal
      this.maxVertical = maxVertical
      this.image = image
      this.position = null
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

    aircraftCarrier = new Ship('Aircraft Carrier', 'aircraft-carrier', 5, 5, 6, 60, 'images/aircraft-carrier.png')
    battleship = new Ship('Battleship', 'battleship', 4, 4, 7, 70, 'images/battleship.png')
    submarine = new Ship('Submarine', 'submarine', 3, 3, 8, 80, 'images/submarine.png')
    destroyer = new Ship('Destroyer', 'destroyer', 3, 3, 8, 80, 'images/destroyer.png')
    patrolBoat = new Ship('Patrol Boat', 'patrol-boat', 2, 2, 9, 90, 'images/patrol-boat.png')

    user.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
    comp.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
    players.push(user, comp)

    console.log(players)

    buildGrid(userGrid, user)
    buildGrid(compGrid, comp)

    addBoats(user, userShips)
    addBoats(comp, compShips)

  }

  // Build Grid and Ship Functions

  function buildGrid(grid, player) {
    for (let i = 1; i <= player.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', `${player.type}-div grid-div`)
      newGridDiv[i].setAttribute('data-id', i)
      newGridDiv[i].innerHTML = [i]
      newGridDiv[i].setAttribute('onmouseover', '')
      newGridDiv[i].setAttribute('onmouseout', '')
      // newGridDiv[i].addEventListener('click', () => console.log(newGridDiv[i].classList))
      newGridDiv[i].addEventListener('click', positionSelection)
      grid.appendChild(newGridDiv[i])
    }
  }

  function addBoats(player, ships) {
    for (let i = 0; i < player.ships.length; i++) {
      newShipDiv[i] = document.createElement('div')
      newShipDiv[i].setAttribute('class', 'ship-div')
      newShipDiv[i].innerHTML = `<img src="${player.ships[i].image}" class="${player.type}-ship ${player.ships[i].id}" data-id="${i}">`
      newShipDiv[i].addEventListener('click', userSelection)
      ships.appendChild(newShipDiv[i])
    }
    axis.addEventListener('click', axisSelector)
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

  function axisSelector() {
    if (axis.innerHTML === 'Vertical') {
      axis.innerHTML = 'Horizontal'
    } else {
      axis.innerHTML = 'Vertical'
    }
  }

  function userSelection(e) {
    if (e.target.classList.contains('user-ship')) {
      console.log(e.target)
      // userGrid.style.cursor = 'url(images/patrol-boat.png) 4 12, auto'
      currentShip = e.target.dataset.id
    }
  }

  function positionSelection(e) {
    if (currentShip) {
      user.ships[currentShip].position = []
      if (axis.innerHTML === 'Horizontal' && e.target.dataset.id.substr(e.target.dataset.id.length - 1) <= user.ships[currentShip].maxHoriztonal) {
        for (let i = 0; i < user.ships[currentShip].size; i++) {
          user.ships[currentShip].position.push(parseInt(e.target.dataset.id) + i)
        }
        console.log(user.ships[currentShip])
        console.log(e.target.dataset.id.substr(e.target.dataset.id.length - 1))
        console.log(user.ships.position)
        changeInstructions()
      }
    }
  }

  // Change Instructions Function

  function changeInstructions() {
    if (user.ships[0].position && user.ships[1].position && user.ships[2].position && user.ships[3].position && user.ships[4].position) {
      instructionsText.innerHTML = 'Play Game'
    }
  }


  // ${user.ships[e.target.dataset.id]}

  // function positionSelection(e) {
  //   if (e.target.classList.contains('user-div') && parseInt(e.target.dataset.id) <= aircraftCarrier.maxVertical) {
  //     for (let i = 0; i < aircraftCarrier.size; i++) {
  //       user.grid.splice(parseInt(e.target.dataset.id) + i * 10, 1, aircraftCarrier)
  //     }
  //     console.log(user.grid)
  //   }
  // }






  //Function calling

  setup()




  // const ship1 = 'ship 1'
  //
  // userArray.splice(7, 1, ship1)
  //

  // new Game(number calls amount of div's in grid)

  //e.target.dataset.id.includes('6')




})
