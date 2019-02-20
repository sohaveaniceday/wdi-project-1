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
  let huntingMode = false
  let successfulHit = null
  let originalSuccessfulHit = null
  const compGuessArray = [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,100,101,102,103,104,105,106,107,108,109,110]
  let huntingTally = 0
  let compGuess = null
  const huntingModeHorizontalArray = [1,-1]
  const huntingModeVerticalArray = [10,-10]
  let huntingDirection = null
  let fixedHuntingDirection = null


  //Declaring Global DOM Variables

  const userGrid = document.querySelector('.user-grid')
  const compGrid = document.querySelector('.comp-grid')
  const userShips = document.querySelector('.user-ships')
  const compShips = document.querySelector('.comp-ships')
  const userInstructions = document.querySelector('.axis')
  const instructionsText = document.querySelector('.instructions-text')
  const instructions = document.querySelector('.instructions')
  const compInstructions = document.querySelector('.comp-instructions')

  //Contructors

  class Player {
    constructor(type, referenceName) {
      this.type = type
      this.ships = []
      this.grid = new Array(100).fill(null)
      this.totalHp = 17
      this.referenceName = referenceName
      Player.classification = 'player'
    }
  }

  class Ship {
    constructor(type, id, size, hp, maxHoriztonal, maxVertical, horizontalImage, verticalImage, numberInArray) {
      this.type = type
      this.id = id
      this.size = size
      this.hp = hp
      this.maxHoriztonal = maxHoriztonal
      this.maxVertical = maxVertical
      this.horiztonalImage = horizontalImage
      this.verticalImage = verticalImage
      this.position = []
      this.axis = null
      this.numberInArray = numberInArray
      Ship.classification = 'ship'
    }
    hit(e) {
      this.ships[e].hp -= 1
    }
  }

  //Setup Function: Player + Ship Construction + pushing into arrays

  function setup() {

    user = new Player('user', 'You')
    comp = new Player('comp', 'The Computer')

    players.push(user, comp)

    function shipBuilding() {
      for (let i = 0; i < players.length; i++) {
        const aircraftCarrier = new Ship('Aircraft Carrier', 'aircraft-carrier', 5, 5, 5, 59, 'images/aircraft-carrier-horizontal.png','images/aircraft-carrier-vertical.png', 0)
        const battleship = new Ship('Battleship', 'battleship', 4, 4, 6, 69, 'images/battleship-horizontal.png','images/battleship-vertical.png', 1)
        const submarine = new Ship('Submarine', 'submarine', 3, 3, 7, 79, 'images/submarine-horizontal.png','images/submarine-vertical.png', 2)
        const destroyer = new Ship('Destroyer', 'destroyer', 3, 3, 7, 79, 'images/destroyer-horizontal.png','images/destroyer-vertical.png', 3)
        const patrolBoat = new Ship('Patrol Boat', 'patrol-boat', 2, 2, 8, 89, 'images/patrol-boat-horizontal.png','images/patrol-boat-vertical.png', 4)
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
    for (let i = 0; i < player.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', `${player.type}-div ${player.type}-active-div grid-div`)
      newGridDiv[i].setAttribute('id', `${player.type}-${i}`)
      newGridDiv[i].setAttribute('data-id', i)
      newGridDiv[i].innerHTML = [i]
      grid.appendChild(newGridDiv[i])
    }
    const userDiv = document.querySelectorAll('.user-div')
    userDiv.forEach(div => div.addEventListener('click', positionSelection))
  }

  function addBoats(player, ships) {
    for (let i = 0; i < player.ships.length; i++) {
      newShipDiv[i] = document.createElement('div')
      newShipDiv[i].setAttribute('class', `ship-div ${player.ships[i].id}-div`)
      newShipDiv[i].innerHTML = `<img src="${player.ships[i].horiztonalImage}" class="${player.type}-ship ${player.ships[i].id}" data-id="${i}">`
      newShipDiv[i].addEventListener('click', userSelection)
      ships.appendChild(newShipDiv[i])
    }
    userInstructions.addEventListener('click', axisSelector)
  }

  // Boat Selections Functions

  function axisSelector() {
    if (userInstructions.innerHTML === 'Vertical') {
      userInstructions.innerHTML = 'Horizontal'
      userDirection = directionArray[0]
    } else {
      userInstructions.innerHTML = 'Vertical'
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
    if (direction === 'Horizontal' && e.substr(e.length - 1) !== '9' && e.substr(e.length - 1) <= playerType.ships[currentShip].maxHoriztonal && checkHoriztonalOccupied(e, playerType)) {
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
    document.querySelector(`#${playerType.type}-${playerType.grid.indexOf(playerType.ships[currentShip])}`).removeAttribute('data-shipid')
  }

  function clearExistingArrayPosition(playerType) {
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      playerType.grid[playerType.grid.indexOf(playerType.ships[currentShip])] = null
      // playerType.grid.splice(playerType.grid.indexOf(playerType.ships[currentShip]), 1, null)
    }
  }

  function addImageToGrid(e, playerType, position) {
    document.querySelector(`#${playerType.type}-${e}`).innerHTML = `<img id="image-${playerType.type}-${e}" src="images/${playerType.ships[currentShip].id}-${position}.png">`
    // const newImage = document.querySelector(`#image-${playerType.type}-${e}`)
    // newImage.setAttribute('class', `${playerType.type}-div ${playerType.type}-active-div ship`)
    // newImage.setAttribute('id', `image-${playerType.type}-${e}`)
    // newImage.setAttribute('data-id', e)
    // newImage.setAttribute('data-shipid', currentShip)
  }

  function addCompImageToGrid(e, playerType, position) {
    if (position === 'Horizontal') {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        document.querySelector(`#${playerType.type}-${parseInt(e) + i}`).style.background = 'black'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i}`).setAttribute('data-shipid', currentShip)
      }
      playerType.ships[parseInt(currentShip)].axis = 'Horizontal'
    } else {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10}`).style.background = 'black'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10}`).setAttribute('data-shipid', currentShip)
      }
      playerType.ships[parseInt(currentShip)].axis = 'Vertical'
    }
  }


  function addHoriztonalArrayData(e, playerType) {
    if (parseInt(e) % 10 === 0) {
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size}`).setAttribute('data-occupiedid', currentShip)
    } else if ((parseInt(e) + playerType.ships[currentShip].size -1) % 10 === 9) {
      playerType.grid[parseInt(e) - 1] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1}`).setAttribute('data-occupiedid', currentShip)
    } else {
      playerType.grid[parseInt(e) - 1] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1}`).setAttribute('data-occupiedid', currentShip)
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size}`).setAttribute('data-occupiedid', currentShip)
    }
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      if (parseInt(e) < 10) {
        playerType.grid[parseInt(e) + i+10] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i+10}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i+10}`).setAttribute('data-occupiedid', currentShip)
      } else if (parseInt(e) > 89) {
        playerType.grid[parseInt(e) + i-10] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i-10}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i-10}`).setAttribute('data-occupiedid', currentShip)
      } else {
        playerType.grid[parseInt(e) + i+10] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i+10}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i+10}`).setAttribute('data-occupiedid', currentShip)
        playerType.grid[parseInt(e) + i-10] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i-10}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i-10}`).setAttribute('data-occupiedid', currentShip)
      }
      playerType.ships[currentShip].position.push(parseInt(e) + i)
      playerType.grid[parseInt(e) + i] = playerType.ships[currentShip]
      document.querySelector(`#${playerType.type}-${parseInt(e) + i}`).setAttribute('data-shipid', currentShip)
    }
    playerType.ships[parseInt(currentShip)].axis = 'Horizontal'
  }

  function addVerticalArrayData(e, playerType) {
    console.log(parseInt(e) + (playerType.ships[currentShip].size - 1) * 10)
    if (parseInt(e) < 10) {
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size * 10] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size * 10}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size * 10}`).setAttribute('data-occupiedid', currentShip)
    } else if (parseInt(e) + (playerType.ships[currentShip].size - 1) * 10 > 89) {
      playerType.grid[parseInt(e) - 1 * 10] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1 * 10}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1 * 10}`).setAttribute('data-occupiedid', currentShip)
    } else {
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size * 10] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size * 10}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size * 10}`).setAttribute('data-occupiedid', currentShip)
      playerType.grid[parseInt(e) - 1 * 10] = 'occupied'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1 * 10}`).style.background = 'white'
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1 * 10}`).setAttribute('data-occupiedid', currentShip)
    }
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      if (parseInt(e) % 10 === 0) {
        playerType.grid[parseInt(e) + i * 10 + 1] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 + 1}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 + 1}`).setAttribute('data-occupiedid', currentShip)
      } else if (parseInt(e) % 10 === 9) {
        playerType.grid[parseInt(e) + i * 10 - 1] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 - 1}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 - 1}`).setAttribute('data-occupiedid', currentShip)
      } else {
        playerType.grid[parseInt(e) + i * 10 + 1] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 + 1}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 + 1}`).setAttribute('data-occupiedid', currentShip)
        playerType.grid[parseInt(e) + i * 10 - 1] = 'occupied'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 - 1}`).style.background = 'white'
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 - 1}`).setAttribute('data-occupiedid', currentShip)
      }
      playerType.ships[currentShip].position.push(parseInt(e) + i * 10)
      playerType.grid[parseInt(e) + i * 10] = playerType.ships[currentShip]
      document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10}`).setAttribute('data-shipid', currentShip)
    }
    playerType.ships[parseInt(currentShip)].axis = 'Vertical'
  }



  // User Boat Selection Uber Function

  function positionSelection(e) {
    if (currentShip) {
      instructionsText.innerHTML = 'Pick Your Boat'
      if (checkAcceptableHorizontal(e.target.dataset.id, user, userDirection)) {
        // clearCurrentObjectPositionArray(user)
        // if (checkIfAlreadyOnMap(user)) {
        //   clearImageAlreadyOnMap(user)
        // }
        addImageToGrid(e.target.dataset.id, user, 'Horizontal')
        // clearExistingArrayPosition(user)
        addHoriztonalArrayData(e.target.dataset.id, user)
        document.querySelector(`.${user.ships[currentShip].id}-div`).removeEventListener('click', userSelection)
      } else if (checkAcceptableVertical(e.target.dataset.id, user, userDirection)) {
        clearCurrentObjectPositionArray(user)
        // if (checkIfAlreadyOnMap(user)) {
        //   clearImageAlreadyOnMap(user)
        // }
        addImageToGrid(e.target.dataset.id, user, 'Vertical')
        // clearExistingArrayPosition(user)
        addVerticalArrayData(e.target.dataset.id, user)
        document.querySelector(`.${user.ships[currentShip].id}-div`).removeEventListener('click', userSelection)
      } else {
        instructionsText.innerHTML = 'Invalid Placement. Select Boat Again.'
      }
    }
    currentShip = null
    console.log(user.grid)
    changeInstructions()
  }


  // // Change Instructions Function

  function changeInstructions() {
    if (user.ships[0].position.length > 0 && user.ships[1].position.length > 0 && user.ships[2].position.length > 0 && user.ships[3].position.length > 0 && user.ships[4].position.length > 0) {
      instructionsText.innerHTML = 'Play Game!'
      instructions.style.cursor = 'pointer'
      instructions.addEventListener('click', playerTurn)
      console.log(user.grid)
    }
  }

  // Comp Boat Selection Uber Function

  function compSelection() {
    for (let i = 0; i < user.ships.length; i++) {
      const compDirection = directionArray[Math.floor(Math.random() * 2)]
      currentShip = i
      if (compDirection === 'Horizontal') {
        do {
          compGridPosition = (Math.floor(Math.random() * 100)).toString()
        }
        while (checkAcceptableHorizontal(compGridPosition, comp, compDirection) === undefined)
        addHoriztonalArrayData(compGridPosition, comp)
        // addImageToGrid(compGridPosition, comp, compDirection)
        addCompImageToGrid(compGridPosition, comp, 'Horizontal')
      } else if (compDirection === 'Vertical') {
        do {
          compGridPosition = (Math.floor(Math.random() * 100)).toString()
        }
        while (checkAcceptableVertical(compGridPosition, comp, compDirection) === undefined)
        addVerticalArrayData(compGridPosition, comp, 'Vertical')
        // addImageToGrid(compGridPosition, comp, compDirection)
        addCompImageToGrid(compGridPosition, comp)
      }
    }
    currentShip = null
  }

  // Game logic

  function shipDown(currentShip, playerType) {
    if (playerType.ships[parseInt(currentShip)].axis === 'Horizontal') {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        const currentShipDown = document.querySelector(`#${playerType.type}-${playerType.grid.indexOf(playerType.ships[currentShip]) + i}`)
        currentShipDown.style.background = 'red'
      }
    } else {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        const currentShipDown = document.querySelector(`#${playerType.type}-${playerType.grid.indexOf(playerType.ships[currentShip]) + i * 10}`)
        currentShipDown.style.background = 'red'
      }
    }
  }

  function gameOver(playerType) {
    instructionsText.innerHTML = `${playerType.referenceName} Won the Game!`
    compInstructions.innerHTML = `${playerType.referenceName} Won!`
    userInstructions.innerHTML = `${playerType.referenceName} Won!`
  }

  function hittingShip(e, playerType, position) {
    playerType.ships[parseInt(e)].hp -= 1
    playerType.totalHp -= 1
    document.querySelector(`#${playerType.type}-${position}`).style.border = '2px solid red'
  }

  function playerTurn() {
    userInstructions.removeEventListener('click', axisSelector)
    if (userInstructions.innerHTML === 'Horizontal' || userInstructions.innerHTML === 'Vertical') {
      userInstructions.innerHTML = 'Waiting'
      compInstructions.innerHTML = 'Waiting'
    }
    const userDiv = document.querySelectorAll('.user-div')
    userDiv.forEach(div => div.removeEventListener('click', positionSelection))
    instructions.removeEventListener('click', playerTurn)
    instructionsText.innerHTML = 'Select Enemy Square'
    const compActiveDiv = document.querySelectorAll('.comp-active-div')
    compActiveDiv.forEach(div => div.addEventListener('click', playerGuess))
  }
  function playerGuess(e) {
    userInstructions.innerHTML = 'Waiting'
    const compDiv = document.querySelectorAll('.comp-div')
    compDiv.forEach(div => div.removeEventListener('click', playerGuess))
    compDiv[parseInt(e.target.dataset.id)].setAttribute('class', 'comp-div comp-dead-div grid-div')
    compDiv[parseInt(e.target.dataset.id)].style.border = '2px solid pink'
    if (e.target.dataset.shipid !== undefined) {
      compInstructions.innerHTML = 'Hit!'
      hittingShip(e.target.dataset.shipid, comp, parseInt(e.target.dataset.id))
      if (comp.ships[parseInt(e.target.dataset.shipid)].hp === 0) {
        compInstructions.innerHTML = `You sunk their ${comp.ships[parseInt(e.target.dataset.shipid)].type}!`
        shipDown(e.target.dataset.shipid, comp)
        if (comp.totalHp === 0) {
          return gameOver(user)
        }
      }
      return playerTurn()
    } else {
      compInstructions.innerHTML = 'Miss!'
      instructionsText.innerHTML = 'Computer\'s turn'
      instructions.addEventListener('click', computerGuess)
    }
  }

  function computerGuess() {
    compInstructions.innerHTML = 'Waiting'
    instructions.removeEventListener('click', computerGuess)
    if (huntingMode === true) {
      do {
        if (fixedHuntingDirection) {
          const compSuggestionsArray = []
          if (fixedHuntingDirection === 'Horizontal') {
            for (let i = 0; i < 2; i++) {
              compGuess = successfulHit + huntingModeHorizontalArray[i]
              if (i === 1 && parseInt(compGuess) % 10 !== 9) {
                compSuggestionsArray.push(compGuess)
              }
              if (i === 0 && parseInt(compGuess) % 10 !== 0) {
                compSuggestionsArray.push(compGuess)
              }
            }
            if ((compSuggestionsArray.every(r=> compGuessArray.indexOf(r) >= 0))) {
              compGuess = originalSuccessfulHit + huntingModeHorizontalArray[Math.floor(Math.random() * 2)]
            } else {
              do {
                if (compSuggestionsArray.length > 1) {
                  compGuess = successfulHit + huntingModeHorizontalArray[Math.floor(Math.random() * 2)]
                } else {
                  compGuess = compSuggestionsArray[0]
                }
              } while (compGuessArray.includes(compGuess))
            }
          } else {
            for (let i = 0; i < 2; i++) {
              compGuess = successfulHit + huntingModeVerticalArray[i]
              compSuggestionsArray.push(compGuess)
              if ((compSuggestionsArray.every(r=> compGuessArray.indexOf(r) >= 0))) {
                compGuess = originalSuccessfulHit + huntingModeVerticalArray[Math.floor(Math.random() * 2)]
              } else {
                do {
                  compGuess = successfulHit + huntingModeVerticalArray[Math.floor(Math.random() * 2)]
                } while (compGuessArray.includes(compGuess))
              }
            }
          }
        } else {
          huntingDirection = directionArray[Math.floor(Math.random() * 2)]
          if (huntingDirection === 'Horizontal') {
            compGuess = successfulHit + huntingModeHorizontalArray[Math.floor(Math.random() * 2)]
            if (parseInt(successfulHit) % 10 === 0) {
              compGuess = successfulHit + huntingModeHorizontalArray[0]
            }
            if (parseInt(successfulHit) % 10 === 9) {
              compGuess = successfulHit + huntingModeHorizontalArray[1]
            }
          } else {
            compGuess = successfulHit + huntingModeVerticalArray[Math.floor(Math.random() * 2)]
          }
        }
      }  while (compGuessArray.includes(compGuess))
    } else {
      do {
        compGuess = (Math.floor(Math.random() * 100))
      }
      while (compGuessArray.includes(compGuess))
    }
    compGuessArray.push(compGuess)
    const userDiv = document.querySelectorAll('.user-div')
    userDiv[parseInt(compGuess)].style.border = '2px solid pink'
    console.log(`comp guess ${compGuess}`)
    if (userDiv[parseInt(compGuess)].getAttribute('data-shipid')) {
      userInstructions.innerHTML = 'Hit!'
      const currentHitShip = user.grid[parseInt(compGuess)].numberInArray
      hittingShip(currentHitShip, user, parseInt(compGuess))
      huntingMode = true
      successfulHit = compGuess
      huntingTally += 1
      if (huntingTally === 1) {
        originalSuccessfulHit = compGuess
      }
      if (huntingTally > 1) {
        fixedHuntingDirection = huntingDirection
      }
      console.log('hit')
      if (user.ships[currentHitShip].hp === 0) {
        userInstructions.innerHTML = `They sunk your ${user.ships[currentHitShip].type}!`
        shipDown(currentHitShip, user)
        huntingMode = false
        huntingTally = 0
        fixedHuntingDirection = null
        if (user.totalHp === 0) {
          return gameOver(comp)
        }
      }
      return setTimeout(computerGuess, 3000)
    } else {
      userInstructions.innerHTML = 'Miss!'
      console.log('miss')
    }
    playerTurn()
  }

  //Function calling

  setup()
  compSelection()



})
