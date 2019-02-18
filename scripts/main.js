window.addEventListener('DOMContentLoaded', () => {

  //Declaring Global Variabkes

  const newGridDiv = []
  const newShipDiv = []

  const players = []
  const directionArray = ['Horizontal', 'Vertical']

  let user = null
  let comp = null

  let currentShip = null
  let direction = directionArray[0]

  //Declaring Global DOM Variables

  const userGrid = document.querySelector('.user-grid')
  const compGrid = document.querySelector('.comp-grid')
  const userShips = document.querySelector('.user-ships')
  const compShips = document.querySelector('.comp-ships')
  const axis = document.querySelector('.axis')
  const instructionsText = document.querySelector('.instructions-text')
  const instructions = document.querySelector('.instructions')

  //Contructors

  class Player {
    constructor(type) {
      this.type = type
      this.ships = []
      this.grid = new Array(100).fill(null)
      Player.classification = 'player'
    }
  }

  class Ship {
    constructor(type, id, size, hp, maxHoriztonal, maxVertical, image, vertImage) {
      this.type = type
      this.id = id
      this.size = size
      this.hp = hp
      this.maxHoriztonal = maxHoriztonal
      this.maxVertical = maxVertical
      this.image = image
      this.vertImage = vertImage
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

    const aircraftCarrier = new Ship('Aircraft Carrier', 'aircraft-carrier', 5, 5, 6, 60, 'images/aircraft-carrier.png','images/aircraft-carrier-vert.png')
    const battleship = new Ship('Battleship', 'battleship', 4, 4, 7, 70, 'images/battleship.png','images/battleship-vert.png')
    const submarine = new Ship('Submarine', 'submarine', 3, 3, 8, 80, 'images/submarine.png','images/submarine-vert.png')
    const destroyer = new Ship('Destroyer', 'destroyer', 3, 3, 8, 80, 'images/destroyer.png','images/destroyer-vert.png')
    const patrolBoat = new Ship('Patrol Boat', 'patrol-boat', 2, 2, 9, 90, 'images/patrol-boat.png','images/patrol-boat-vert.png')

    user.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
    comp.ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
    players.push(user, comp)

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
      newGridDiv[i].setAttribute('id', `${player.type}-${i}`)
      newGridDiv[i].setAttribute('data-id', i)
      newGridDiv[i].innerHTML = [i]
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

  function axisSelector() {
    if (axis.innerHTML === 'Vertical') {
      axis.innerHTML = 'Horizontal'
      direction = directionArray[0]
    } else {
      axis.innerHTML = 'Vertical'
      direction = directionArray[1]
    }
  }

  function userSelection(e) {
    if (e.target.classList.contains('user-ship')) {
      instructionsText.innerHTML = 'Place Your Boat'
      currentShip = e.target.dataset.id
    }
  }

  function checkAcceptableHorizontal(e) {
    if (direction === 'Horizontal' && e.target.dataset.id.substr(e.target.dataset.id.length - 1) !== '0' && e.target.dataset.id.substr(e.target.dataset.id.length - 1) <= user.ships[currentShip].maxHoriztonal && checkHoriztonalOccupied(e)) {
      return true
    }
  }

  function checkHoriztonalOccupied(e) {
    for (let i = 0; i < user.ships[currentShip].size; i++) {
      if(user.grid[parseInt(e.target.dataset.id) + i]) {
        return false
      }
    }
    return true
  }

  function checkAcceptableVertical(e) {
    if (axis.innerHTML === 'Vertical' && e.target.dataset.id <= user.ships[currentShip].maxVertical  && user.grid[e.target.dataset.id] === null && checkVerticalOccupied(e)) {
      return true
    }
  }

  function checkVerticalOccupied(e) {
    for (let i = 0; i < user.ships[currentShip].size; i++) {
      if(user.grid[parseInt(e.target.dataset.id) + i * 10]) {
        return false
      }
    }
    return true
  }

  function clearCurrentObjectPositionArray() {
    user.ships[currentShip].position = []
  }

  function checkIfAlreadyOnMap() {
    if (user.grid.indexOf(user.ships[currentShip]) !== -1) {
      return true
    }
  }

  function clearImageAlreadyOnMap() {
    document.querySelector(`#user-${user.grid.indexOf(user.ships[currentShip])}`).innerHTML = `${user.grid.indexOf(user.ships[currentShip])}`
  }

  function clearExistingArrayPosition() {
    for (let i = 0; i < user.ships[currentShip].size; i++) {
      user.grid.splice(user.grid.indexOf(user.ships[currentShip]), 1, null)
    }
  }

  function addHorizontalImage(e) {
    document.querySelector(`#user-${e.target.dataset.id}`).innerHTML = `<img src="${user.ships[currentShip].image}">`
  }

  function addVerticalImage(e) {
    document.querySelector(`#user-${e.target.dataset.id}`).innerHTML = `<img class='vert-image' src="${user.ships[currentShip].vertImage}">`
  }

  function addHoriztonalArrayData(e) {
    for (let i = 0; i < user.ships[currentShip].size; i++) {
      user.ships[currentShip].position.push(parseInt(e.target.dataset.id) + i)
      user.grid.splice(parseInt(e.target.dataset.id) + i, 1, user.ships[currentShip])
    }
  }

  function addVerticalArrayData(e) {
    for (let i = 0; i < user.ships[currentShip].size; i++) {
      user.ships[currentShip].position.push(parseInt(e.target.dataset.id) + i * 10)
      user.grid.splice(parseInt(e.target.dataset.id) + i * 10, 1, user.ships[currentShip])
    }
  }



  function positionSelection(e) {
    if (currentShip) {
      instructionsText.innerHTML = 'Pick Your Boat'
      if (checkAcceptableHorizontal(e)) {
        clearCurrentObjectPositionArray()
        if (checkIfAlreadyOnMap()) {
          clearImageAlreadyOnMap()
        }
        addHorizontalImage(e)
        clearExistingArrayPosition()
        addHoriztonalArrayData(e)
      } else if (checkAcceptableVertical(e)) {
        clearCurrentObjectPositionArray()
        if (checkIfAlreadyOnMap()) {
          clearImageAlreadyOnMap()
        }
        addVerticalImage(e)
        clearExistingArrayPosition()
        addVerticalArrayData(e)
      } else {
        instructionsText.innerHTML = 'Invalid Placement'
      }
    }
    changeInstructions()
  }





  function compSelection() {
    for (let i = 0; i <= comp.ships.length; i++) {
      const direction = directionArray[Math.floor(Math.random() * 2)]

      console.log(direction)
      // if (direction === 'Vertical') {
      //   console.log(comp.ships[i].maxVertical)
      //   // comp.grid.splice(Math.floor(Math.random() * comp.ships[i].maxVertical), 1, comp.ships[i])
      // }
    }
  }

  compSelection()

  // Change Instructions Function

  function changeInstructions() {
    if (user.ships[0].position && user.ships[1].position && user.ships[2].position && user.ships[3].position && user.ships[4].position) {
      instructionsText.innerHTML = 'Play Game!'
    }
  }




  // ${user.ships[e.target.dataset.id]}

  // function positionSelection(e) {
  //   if (e.target.classList.contains('user-div') && parseInt(e.target.dataset.id) <= aircraftCarrier.maxVertical) {
  //     for (let i = 0; i < aircraftCarrier.size; i++) {
  //       user.grid.splice(parseInt(e.target.dataset.id) + i * 10, 1, aircraftCarrier)
  //     }
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
