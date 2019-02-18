window.addEventListener('DOMContentLoaded', () => {

  //Declaring Global Variabkes

  const newGridDiv = []
  const newShipDiv = []

  const players = []
  const directionArray = ['Horizontal', 'Vertical']

  let user = null
  let comp = null

  let currentShip = null
  let userDirection = directionArray[0]
  let compGridPosition = null

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
    constructor(type, id, size, hp, maxHoriztonal, maxVertical, horizontalImage, verticalImage) {
      this.type = type
      this.id = id
      this.size = size
      this.hp = hp
      this.maxHoriztonal = maxHoriztonal
      this.maxVertical = maxVertical
      this.horiztonalImage = horizontalImage
      this.verticalImage = verticalImage
      this.position = []
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

    players.push(user, comp)

    function shipBuilding() {
      for (let i = 0; i < players.length; i++) {
        const aircraftCarrier = new Ship('Aircraft Carrier', 'aircraft-carrier', 5, 5, 6, 60, 'images/aircraft-carrier-horizontal.png','images/aircraft-carrier-vertical.png')
        const battleship = new Ship('Battleship', 'battleship', 4, 4, 7, 70, 'images/battleship-horizontal.png','images/battleship-vertical.png')
        const submarine = new Ship('Submarine', 'submarine', 3, 3, 8, 80, 'images/submarine-horizontal.png','images/submarine-vertical.png')
        const destroyer = new Ship('Destroyer', 'destroyer', 3, 3, 8, 80, 'images/destroyer-horizontal.png','images/destroyer-vertical.png')
        const patrolBoat = new Ship('Patrol Boat', 'patrol-boat', 2, 2, 9, 90, 'images/patrol-boat-horizontal.png','images/patrol-boat-vertical.png')
        players[i].ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
      }
    }

    shipBuilding()
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
      newShipDiv[i].innerHTML = `<img src="${player.ships[i].horiztonalImage}" class="${player.type}-ship ${player.ships[i].id}" data-id="${i}">`
      newShipDiv[i].addEventListener('click', userSelection)
      ships.appendChild(newShipDiv[i])
    }
    axis.addEventListener('click', axisSelector)
  }

  // Boat Selections Functions

  function axisSelector() {
    if (axis.innerHTML === 'Vertical') {
      axis.innerHTML = 'Horizontal'
      userDirection = directionArray[0]
    } else {
      axis.innerHTML = 'Vertical'
      userDirection = directionArray[1]
    }
  }

  function userSelection(e) {
    if (e.target.classList.contains('user-ship')) {
      currentShip = e.target.dataset.id
      instructionsText.innerHTML = `Place Your ${user.ships[currentShip].type}`
    }
  }

  function checkAcceptableHorizontal(e, playerType, direction) {
    if (direction === 'Horizontal' && e.substr(e.length - 1) !== '0' && e.substr(e.length - 1) <= playerType.ships[currentShip].maxHoriztonal && checkHoriztonalOccupied(e, playerType)) {
      return true
    }
  }

  function checkHoriztonalOccupied(e, playerType) {
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      if(playerType.grid[parseInt(e) + i]) {
        return false
      }
    }
    return true
  }

  function checkAcceptableVertical(e, playerType, direction) {
    if (direction === 'Vertical' && e <= playerType.ships[currentShip].maxVertical && checkVerticalOccupied(e, playerType)) {
      return true
    }
  }

  function checkVerticalOccupied(e, playerType) {
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      if(playerType.grid[parseInt(e) + i * 10]) {
        return false
      }
    }
    return true
  }

  function clearCurrentObjectPositionArray(playerType) {
    playerType.ships[currentShip].position = []
  }

  function checkIfAlreadyOnMap(playerType) {
    if (playerType.grid.indexOf(playerType.ships[currentShip]) !== -1) {
      return true
    }
  }

  function clearImageAlreadyOnMap(playerType) {
    document.querySelector(`#${playerType.type}-${playerType.grid.indexOf(playerType.ships[currentShip])}`).innerHTML = `${playerType.grid.indexOf(playerType.ships[currentShip])}`
  }

  function clearExistingArrayPosition(playerType) {
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      playerType.grid.splice(playerType.grid.indexOf(playerType.ships[currentShip]), 1, null)
    }
  }

  function addImageToGrid(e, playerType, position) {
    console.log(`#${playerType.type}-${e}`)
    console.log(`<img src="images/${playerType.ships[currentShip].id}-${position}.png">`)
    document.querySelector(`#${playerType.type}-${e}`).innerHTML = `<img src="images/${playerType.ships[currentShip].id}-${position}.png">`
  }

  function addHoriztonalArrayData(e, playerType) {
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      playerType.ships[currentShip].position.push(parseInt(e) + i)
      playerType.grid.splice(parseInt(e) + i, 1, playerType.ships[currentShip])
    }
  }

  function addVerticalArrayData(e, playerType) {
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      playerType.ships[currentShip].position.push(parseInt(e) + i * 10)
      playerType.grid.splice(parseInt(e) + i * 10, 1, playerType.ships[currentShip])
    }
  }

  // User Boat Selection Uber Function

  function positionSelection(e) {
    if (currentShip) {
      instructionsText.innerHTML = 'Pick Your Boat'
      if (checkAcceptableHorizontal(e.target.dataset.id, user, userDirection)) {
        clearCurrentObjectPositionArray(user)
        if (checkIfAlreadyOnMap(user)) {
          clearImageAlreadyOnMap(user)
        }
        addImageToGrid(e.target.dataset.id, user, 'horizontal')
        clearExistingArrayPosition(user)
        addHoriztonalArrayData(e.target.dataset.id, user)
      } else if (checkAcceptableVertical(e.target.dataset.id, user, userDirection)) {
        clearCurrentObjectPositionArray(user)
        if (checkIfAlreadyOnMap(user)) {
          clearImageAlreadyOnMap(user)
        }
        addImageToGrid(e.target.dataset.id, user, 'vertical')
        clearExistingArrayPosition(user)
        addVerticalArrayData(e.target.dataset.id, user)
      } else {
        instructionsText.innerHTML = 'Invalid Placement'
      }
    }
    console.log(user.ships[1].position.length)
    changeInstructions()
  }


  // // Change Instructions Function

  function changeInstructions() {
    if (user.ships[0].position.length > 0 && user.ships[1].position.length > 0 && user.ships[2].position.length > 0 && user.ships[3].position.length > 0 && user.ships[4].position.length > 0) {
      instructionsText.innerHTML = 'Play Game!'
    }
  }

  // Comp Boat Selection Uber Function

  function compSelection() {
    for (let i = 0; i < user.ships.length; i++) {
      const compDirection = directionArray[Math.floor(Math.random() * 2)]
      currentShip = i
      if (compDirection === 'Horizontal') {
        do {
          compGridPosition = (Math.floor(Math.random() * 100) + 1).toString()
        }
        while (checkAcceptableHorizontal(compGridPosition, comp, compDirection) === undefined)
        addHoriztonalArrayData(compGridPosition, comp)
        addImageToGrid(compGridPosition, comp, compDirection)
      } else if (compDirection === 'Vertical') {
        do {
          compGridPosition = (Math.floor(Math.random() * 100) + 1).toString()
        }
        while (checkAcceptableVertical(compGridPosition, comp, compDirection) === undefined)
        addVerticalArrayData(compGridPosition, comp)
        addImageToGrid(compGridPosition, comp, compDirection)
      }
    }
  }

  // Game logic

  

  //Function calling

  setup()
  compSelection()


})
