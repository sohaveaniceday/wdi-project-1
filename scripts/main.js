window.addEventListener('DOMContentLoaded', () => {

  //Declaring Global Variables

  const newGridDiv = []
  const newShipDiv = []

  const players = []
  const directionArray = ['horizontal', 'vertical']

  let user = null
  let comp = null

  let currentShip = null
  let userDirection = directionArray[0]
  let compGridPosition = null
  let huntingMode = false
  let successfulHit = null
  let originalSuccessfulHit = null
  let compGuessArray = [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,100,101,102,103,104,105,106,107,108,109,110]
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
  let instructionsText = null
  const instructions = document.querySelector('.instructions')
  const compInstructions = document.querySelector('.comp-instructions')

  //Constructors

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
      this.occupiedSpaces = []
      Ship.classification = 'ship'
    }
    hit(e) {
      this.ships[e].hp -= 1
    }
  }

  //Setup Function: Player + Ship Construction + pushing into arrays

  function setup() {

    user = new Player('user', 'You')
    comp = new Player('comp', 'The White Walkers')

    players.push(user, comp)

    function shipBuilding() {
      for (let i = 0; i < players.length; i++) {
        const aircraftCarrier = new Ship('Fort', 'fort', 5, 5, 5, 59, 'images/fort-horizontal.png','images/fort-vertical.png', 0)
        const battleship = new Ship('Dragon', 'dragon', 4, 4, 6, 69, 'images/dragon-horizontal.png','images/dragon-vertical.png', 1)
        const submarine = new Ship('Archers', 'archers', 3, 3, 7, 79, 'images/archers-horizontal.png','images/archers-vertical.png', 2)
        const destroyer = new Ship('Knights', 'knights', 3, 3, 7, 79, 'images/knights-horizontal.png','images/knights-vertical.png', 3)
        const patrolBoat = new Ship('Wolves', 'wolves', 2, 2, 8, 89, 'images/wolves-horizontal.png','images/wolves-vertical.png', 4)
        players[i].ships.push(aircraftCarrier, battleship, submarine, destroyer, patrolBoat)
      }
    }

    shipBuilding()
    buildGrid(userGrid, user)
    buildGrid(compGrid, comp)
    addBoats(user, userShips)
    addBoats(comp, compShips)

    introPageDiv()
  }

  //Intro page

  function introPageDiv() {
    const intro = document.querySelector('.intro')
    const introPage = document.createElement('div')
    introPage.setAttribute('class', 'intro-div box has-text-centered is-vcentered')
    introPage.innerHTML = '"Night gathers, and now my watch begins..." <br><br>You are the Lord Commander of the Night\'s Watch. Help Jon Snow from the terrors beyond the wall by strategically placing your defences. Make sure they are not touching and there is enough space in the battle area. If you manage to strike down all your enemy\'s defences you will live to see another day. <br><br>Prepare. <span class="winter animated fadeInUp">Winter is coming...</span>'
    intro.appendChild(introPage)
    document.querySelector('.winter').addEventListener('click', removeIntroDiv)
  }

  function removeIntroDiv() {
    const introPage = document.querySelector('.intro-div')
    const intro = document.querySelector('.intro')
    intro.removeChild(introPage)
    document.querySelector('.character-images').innerHTML = '<img class="figure night-king-figure animated slideInRight" src="images/night-king.png"><img class="figure jon-snow-figure animated slideInLeft" src="images/jon-snow.png">'
    instructions.innerHTML = '<div class="instructions-text box title is-3 has-text-centered animated slideInUp">Choose Your Defence</div>'
    instructionsText = document.querySelector('.instructions-text')
  }

  // Build Grid and Ship Functions

  function buildGrid(grid, player) {
    for (let i = 0; i < player.grid.length; i++) {
      newGridDiv[i] = document.createElement('div')
      newGridDiv[i].setAttribute('class', `${player.type}-div ${player.type}-active-div grid-div`)
      newGridDiv[i].setAttribute('id', `${player.type}-${i}`)
      newGridDiv[i].setAttribute('data-id', i)
      grid.appendChild(newGridDiv[i])
    }
    const userDiv = document.querySelectorAll('.user-div')
    userDiv.forEach(div => div.addEventListener('click', positionSelection))
  }

  function addBoats(player, ships) {
    for (let i = 0; i < player.ships.length; i++) {
      newShipDiv[i] = document.createElement('div')
      newShipDiv[i].setAttribute('class', `ship-div ${player.ships[i].id}-div ${player.type}-${player.ships[i].id}-div`)
      newShipDiv[i].innerHTML = `<img src="${player.ships[i].horiztonalImage}" class="${player.type}-ship ${player.ships[i].id}" data-id="${i}" title="${player.ships[i].id}" draggable="true">`
      newShipDiv[i].addEventListener('click', userSelection)
      ships.appendChild(newShipDiv[i])
    }
    userInstructions.addEventListener('click', axisSelector)
  }

  // Boat Selections Functions

  function axisSelector() {
    if (userInstructions.innerHTML === 'vertical') {
      userInstructions.innerHTML = 'horizontal'
      userDirection = directionArray[0]
    } else {
      userInstructions.innerHTML = 'vertical'
      userDirection = directionArray[1]
    }
    const userDiv = document.querySelectorAll('.user-div')
    if (currentShip && user.ships[currentShip].id === 'fort') {
      userDiv.forEach(div => div.style.cursor = `url('images/${user.ships[currentShip].id}-${userDirection}-cursor.png') 10 25, auto`)
    } else if (currentShip) {
      userDiv.forEach(div => div.style.cursor = `url('images/${user.ships[currentShip].id}-${userDirection}.png') 10 25, auto`)
    } else {
      return
    }
  }

  function userSelection(e) {
    if (e.target.classList.contains('user-ship')) {
      currentShip = e.target.dataset.id
      instructionsText.innerHTML = `Place Your ${user.ships[currentShip].type}`
      const userDiv = document.querySelectorAll('.user-div')
      if (currentShip && user.ships[currentShip].id === 'fort') {
        userDiv.forEach(div => div.style.cursor = `url('images/${user.ships[currentShip].id}-${userDirection}-cursor.png') 10 25, auto`)
      } else if (currentShip) {
        userDiv.forEach(div => div.style.cursor = `url('images/${user.ships[currentShip].id}-${userDirection}.png') 10 25, auto`)
      } else {
        return
      }
    }
  }

  function checkAcceptableHorizontal(e, playerType, direction) {
    if (direction === 'horizontal' && e.substr(e.length - 1) !== '9' && e.substr(e.length - 1) <= playerType.ships[currentShip].maxHoriztonal && checkHoriztonalOccupied(e, playerType)) {
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
    if (direction === 'vertical' && e <= playerType.ships[currentShip].maxVertical && checkVerticalOccupied(e, playerType)) {
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

  function addImageToGrid(e, playerType, position) {
    document.querySelector(`#${playerType.type}-${e}`).innerHTML = `<img id="image-${playerType.type}-${e}" src="images/${playerType.ships[currentShip].id}-${position}.png">`
    const userDiv = document.querySelectorAll('.user-div')
    userDiv.forEach(div => div.style.cursor = 'pointer')
    document.querySelector(`.user-${user.ships[currentShip].id}-div`).innerHTML = `<img src="images/${user.ships[currentShip].id}-horizontal-black.png">`
  }

  function addCompImageToGrid(e, playerType, position) {
    if (position === 'horizontal') {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        document.querySelector(`#${playerType.type}-${parseInt(e) + i}`).setAttribute('data-shipid', currentShip)
      }
      playerType.ships[parseInt(currentShip)].axis = 'horizontal'
    } else {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10}`).setAttribute('data-shipid', currentShip)
      }
      playerType.ships[parseInt(currentShip)].axis = 'vertical'
    }
  }


  function addHoriztonalArrayData(e, playerType) {
    if (parseInt(e) % 10 === 0) {
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + playerType.ships[currentShip].size)
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size}`).setAttribute('data-occupiedid', currentShip)
    } else if ((parseInt(e) + playerType.ships[currentShip].size -1) % 10 === 9) {
      playerType.grid[parseInt(e) - 1] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) - 1)
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1}`).setAttribute('data-occupiedid', currentShip)
    } else {
      playerType.grid[parseInt(e) - 1] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) - 1)
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1}`).setAttribute('data-occupiedid', currentShip)
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + playerType.ships[currentShip].size)
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size}`).setAttribute('data-occupiedid', currentShip)
    }
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      if (parseInt(e) < 10) {
        playerType.grid[parseInt(e) + i+10] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i + 10)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i+10}`).setAttribute('data-occupiedid', currentShip)
      } else if (parseInt(e) > 89) {
        playerType.grid[parseInt(e) + i-10] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i - 10)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i-10}`).setAttribute('data-occupiedid', currentShip)
      } else {
        playerType.grid[parseInt(e) + i+10] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i + 10)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i+10}`).setAttribute('data-occupiedid', currentShip)
        playerType.grid[parseInt(e) + i-10] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i - 10)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i-10}`).setAttribute('data-occupiedid', currentShip)
      }
      playerType.ships[currentShip].position.push(parseInt(e) + i)
      playerType.grid[parseInt(e) + i] = playerType.ships[currentShip]
      document.querySelector(`#${playerType.type}-${parseInt(e) + i}`).setAttribute('data-shipid', currentShip)
    }
    playerType.ships[parseInt(currentShip)].axis = 'horizontal'
  }


  function addVerticalArrayData(e, playerType) {
    if (parseInt(e) < 10) {
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size * 10] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + playerType.ships[currentShip].size * 10)
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size * 10}`).setAttribute('data-occupiedid', currentShip)
    } else if (parseInt(e) + (playerType.ships[currentShip].size - 1) * 10 > 89) {
      playerType.grid[parseInt(e) - 1 * 10] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) - 1 * 10)
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1 * 10}`).setAttribute('data-occupiedid', currentShip)
    } else {
      playerType.grid[parseInt(e) + playerType.ships[currentShip].size * 10] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + playerType.ships[currentShip].size * 10)
      document.querySelector(`#${playerType.type}-${parseInt(e) + playerType.ships[currentShip].size * 10}`).setAttribute('data-occupiedid', currentShip)
      playerType.grid[parseInt(e) - 1 * 10] = 'occupied'
      playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) - 1 * 10)
      document.querySelector(`#${playerType.type}-${parseInt(e) - 1 * 10}`).setAttribute('data-occupiedid', currentShip)
    }
    for (let i = 0; i < playerType.ships[currentShip].size; i++) {
      if (parseInt(e) % 10 === 0) {
        playerType.grid[parseInt(e) + i * 10 + 1] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i * 10 + 1)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 + 1}`).setAttribute('data-occupiedid', currentShip)
      } else if (parseInt(e) % 10 === 9) {
        playerType.grid[parseInt(e) + i * 10 - 1] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i * 10 - 1)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 - 1}`).setAttribute('data-occupiedid', currentShip)
      } else {
        playerType.grid[parseInt(e) + i * 10 + 1] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i * 10 + 1)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 + 1}`).setAttribute('data-occupiedid', currentShip)
        playerType.grid[parseInt(e) + i * 10 - 1] = 'occupied'
        playerType.ships[currentShip].occupiedSpaces.push(parseInt(e) + i * 10 - 1)
        document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10 - 1}`).setAttribute('data-occupiedid', currentShip)
      }
      playerType.ships[currentShip].position.push(parseInt(e) + i * 10)
      playerType.grid[parseInt(e) + i * 10] = playerType.ships[currentShip]
      document.querySelector(`#${playerType.type}-${parseInt(e) + i * 10}`).setAttribute('data-shipid', currentShip)
    }
  }

  // User Boat Selection Uber Function

  function positionSelection(e) {
    if (currentShip) {
      instructionsText.innerHTML = 'Choose Your Defence'
      if (checkAcceptableHorizontal(e.target.dataset.id, user, userDirection)) {
        addImageToGrid(e.target.dataset.id, user, 'horizontal')
        addHoriztonalArrayData(e.target.dataset.id, user)
        document.querySelector(`.${user.ships[currentShip].id}-div`).removeEventListener('click', userSelection)
      } else if (checkAcceptableVertical(e.target.dataset.id, user, userDirection)) {
        clearCurrentObjectPositionArray(user)
        addImageToGrid(e.target.dataset.id, user, 'vertical')
        addVerticalArrayData(e.target.dataset.id, user)
        document.querySelector(`.${user.ships[currentShip].id}-div`).removeEventListener('click', userSelection)
      } else {
        instructionsText.innerHTML = 'Invalid Placement'
        const userDiv = document.querySelectorAll('.user-div')
        userDiv.forEach(div => div.style.cursor = 'pointer')
      }
    }
    currentShip = null
    changeInstructions()
  }

  // Change Instructions Function

  function changeInstructions() {
    if (user.ships[0].position.length > 0 && user.ships[1].position.length > 0 && user.ships[2].position.length > 0 && user.ships[3].position.length > 0 && user.ships[4].position.length > 0) {
      instructionsText.style.color = '#AA0000'
      instructionsText.innerHTML = 'Play Game!'
      instructions.style.cursor = 'pointer'
      instructions.addEventListener('click', playerTurn)
      for (let i = 0; i < user.ships.length; i++) {
        const shipDiv = document.querySelector(`.user-${user.ships[i].id}-div`)
        userShips.removeChild(shipDiv)
      }
      addBoats(user, userShips)
    }
  }

  // Comp Boat Selection Uber Function

  function compSelection() {
    for (let i = 0; i < user.ships.length; i++) {
      const compDirection = directionArray[Math.floor(Math.random() * 2)]
      currentShip = i
      if (compDirection === 'horizontal') {
        do {
          compGridPosition = (Math.floor(Math.random() * 100)).toString()
        }
        while (checkAcceptableHorizontal(compGridPosition, comp, compDirection) === undefined)
        addHoriztonalArrayData(compGridPosition, comp)
        addCompImageToGrid(compGridPosition, comp, 'horizontal')
      } else if (compDirection === 'vertical') {
        do {
          compGridPosition = (Math.floor(Math.random() * 100)).toString()
        }
        while (checkAcceptableVertical(compGridPosition, comp, compDirection) === undefined)
        addVerticalArrayData(compGridPosition, comp, 'vertical')
        addCompImageToGrid(compGridPosition, comp)
      }
    }
    currentShip = null
  }

  // Game logic 

  function shipDown(currentShip, playerType) {
    document.querySelector(`.${playerType.type}-${playerType.ships[currentShip].id}-div`).innerHTML = `<img src="images/${playerType.ships[currentShip].id}-horizontal-black.png">`
    if (playerType.ships[parseInt(currentShip)].axis === 'horizontal') {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        const currentShipDown = document.querySelector(`#${playerType.type}-${playerType.grid.indexOf(playerType.ships[currentShip]) + i}`)
        currentShipDown.style.removeProperty('background-color')
        currentShipDown.innerHTML = '<img src="images/fire.png" class="animated shake">'
      }
    } else {
      for (let i = 0; i < playerType.ships[currentShip].size; i++) {
        const currentShipDown = document.querySelector(`#${playerType.type}-${playerType.grid.indexOf(playerType.ships[currentShip]) + i * 10}`)
        currentShipDown.style.removeProperty('background-color')
        currentShipDown.innerHTML = '<img src="images/fire.png" class="animated shake">'
      }
    }
  }

  function gameOver(playerType) {
    userInstructions.style.color = '#AA0000'
    compInstructions.style.color = '#AA0000'
    instructionsText.style.color = '#AA0000'
    instructionsText.innerHTML = 'Play Again?'
    compInstructions.innerHTML = `${playerType.referenceName} Won!`
    userInstructions.innerHTML = `${playerType.referenceName} Won!`
    instructions.addEventListener('click', () => window.location.reload())
  }

  function hittingShip(e, playerType, position) {
    playerType.ships[parseInt(e)].hp -= 1
    playerType.totalHp -= 1
    document.querySelector(`#${playerType.type}-${position}`).style.background = '#AA0000'
  }

  //Player logic 

  function playerTurn() {
    instructionsText.style.color = 'black'
    userInstructions.removeEventListener('click', axisSelector)
    if (userInstructions.innerHTML === 'horizontal' || userInstructions.innerHTML === 'vertical') {
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
    userInstructions.style.color = 'black'
    userInstructions.innerHTML = 'Waiting'
    const compDiv = document.querySelectorAll('.comp-div')
    compDiv.forEach(div => div.removeEventListener('click', playerGuess))
    compDiv[parseInt(e.target.dataset.id)].setAttribute('class', 'comp-div comp-dead-div grid-div')
    if (e.target.dataset.shipid !== undefined) {
      compInstructions.innerHTML = '<div class="animated shake hit">Hit!</div>'
      hittingShip(e.target.dataset.shipid, comp, parseInt(e.target.dataset.id))
      if (comp.ships[parseInt(e.target.dataset.shipid)].hp === 0) {
        compInstructions.style.color = '#AA0000'
        compInstructions.innerHTML = `You destroyed their ${comp.ships[parseInt(e.target.dataset.shipid)].type}!`
        shipDown(e.target.dataset.shipid, comp)
        if (comp.totalHp === 0) {
          return gameOver(user)
        }
      }
      return playerTurn()
    } else {
      compInstructions.style.color = 'black'
      compInstructions.innerHTML = 'Miss!'
      instructionsText.innerHTML = 'Enemy\'s turn'
      compDiv[parseInt(e.target.dataset.id)].style.background = '#D3D3D3'
      setTimeout(computerGuess, 2000)
    }
  }

  //Comp logic

  function computerGuess() {
    compInstructions.style.color = 'black'
    compInstructions.innerHTML = 'Waiting'
    instructions.removeEventListener('click', computerGuess)
    if (huntingMode === true) {
      do {
        if (fixedHuntingDirection) {
          const compSuggestionsArray = []
          if (fixedHuntingDirection === 'horizontal') {
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
          if (huntingDirection === 'horizontal') {
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
    if (userDiv[parseInt(compGuess)].getAttribute('data-shipid')) {
      userInstructions.innerHTML = '<div class="animated shake hit">Hit!</div>'
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
      if (user.ships[currentHitShip].hp === 0) {
        userInstructions.style.color = '#AA0000'
        userInstructions.innerHTML = `They destroyed your ${user.ships[currentHitShip].type}!`
        compGuessArray = compGuessArray.concat(user.ships[currentHitShip].occupiedSpaces)
        shipDown(currentHitShip, user)
        huntingMode = false
        huntingTally = 0
        fixedHuntingDirection = null
        if (user.totalHp === 0) {
          return gameOver(comp)
        }
      }
      return setTimeout(computerGuess, 2000)
    } else {
      userInstructions.style.color = 'black'
      userInstructions.innerHTML = 'Miss!'
      userDiv[parseInt(compGuess)].style.background = '#D3D3D3'
    }
    playerTurn()
  }

  //Function calling

  setup()
  compSelection()
})
