// GLOBAL ================================================================================================================================
let player = 1
let board = [];

let lastPositionRow = ""
let lastPositionCol = ""

let timerCount = 30
let runningTimer ;

let bg = 1

let chatLog = `
[RULES]<br>
-----------------------------------------------------------------------------------<br>
First player to place 5 pieces in a row wins.<br>
Each player has 30 seconds to make a move. <br>
Players are allowed to request for a draw or undo a move.<br>
-----------------------------------------------------------------------------------<br>
Game has been initialized.<br>
Click on board to make the first move.<br>
-----------------------------------------------------------------------------------<br>
[CHAT]
`

const p1Log = {
  win: 0,
  loss: 0,
  tie: 0,
  points: 0,
}

const p2Log = {
  win: 0,
  loss: 0,
  tie: 0,
  points: 0,
}

// AUDIO =================================================================================================================================
const audioBgm1 = new Audio('./src/audio/bgm1.mp3');
audioBgm1.loop = true;
audioBgm1.volume = 0.4; 

const audioBgm2 = new Audio('./src/audio/bgm2.mp3');
audioBgm2.loop = true;
audioBgm2.volume = 0.4; 

const audioBgm3 = new Audio('./src/audio/bgm3.mp3');
audioBgm3.loop = true;
audioBgm3.volume = 0.4; 

const audioBgm4 = new Audio('./src/audio/bgm4.mp3');
audioBgm4.loop = true;
audioBgm4.volume = 0.4; 

const audioBgm5 = new Audio('./src/audio/bgm5.mp3');
audioBgm5.loop = true;
audioBgm5.volume = 0.4; 

const audioClickBtn = new Audio('./src/audio/click-button.wav');
const audioClickGame = new Audio('./src/audio/click-game.mp3');
const audioExit = new Audio('./src/audio/exit.wav');

const audioWin = new Audio('./src/audio/win.wav');
audioWin.volume = 0.4; 

const audioDraw = new Audio('./src/audio/draw.wav');
audioDraw.volume = 0.4; 

// DOM HELPER ============================================================================================================================
const createDiv = function (className) {
  const div = document.createElement("div")
  div.classList.add(className)  
  return div
}

const createImg = function (className, src, alt) {
  const img = document.createElement("img")
  img.classList.add(className) 
  img.setAttribute('src', src) 
  img.setAttribute('alt', alt) 
  return img
}

const createBtn = function (className, innerText, callback) {
  const btn = document.createElement("button")
  btn.classList.add(className) 
  btn.innerText = innerText
  btn.addEventListener("click", ()=>{audioClickBtn.play()});
  btn.addEventListener("click", callback);
  return btn
}

const createInput = function (className, placeholder, callback) {
  const input = document.createElement("input");
  input.classList.add(className) 
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", placeholder);
  input.addEventListener("keydown", callback);
  return input
}

const createText = function (target, text) {
  document.querySelector(target).innerHTML= text
}

const appendDiv = function (target, appendThis) {
  document.querySelector(target).appendChild(appendThis)  
}

// UPDATE GAME TEXT ======================================================================================================================
const updateScore = function() {  
  createText(".player-points", `${p1Log.points} POINT`)  
  createText(".player-record", `${p1Log.win} W<br> ${p1Log.loss} L<br> ${p1Log.tie} T`) 
  createText(".player-points-2", `${p2Log.points} POINT`)  
  createText(".player-record-2", `${p2Log.win} W<br> ${p2Log.loss} L<br> ${p2Log.tie} T`) 
}  

const updateChatBox = function(e) {  
  if (e.key === "Enter") {
    let msg = document.querySelector(".input-box").value  
    if (msg.length <= 30) {
      chatLog = `${chatLog}<br> Player${player}: ${msg}`
      document.querySelector(".chat-box").style.color = 'white';
      createText(".chat-box", `${chatLog}`)      
    } else {  
      let errorMsg = `[Error]<br>Exceeded 30 character limit.<br><br>[Player${player}]<br>Entered ${msg.length} characters.<br>Please try again!`
      document.querySelector(".chat-box").style.color = 'red';
      createText(".chat-box", `${errorMsg}`)       
    }
    document.querySelector(".input-box").value = ''
  }
}

// CHANGE BACKGROUND / BGM ===============================================================================================================
const changeBg = function() {  
  const bgContainer = document.querySelector(".background-container")
  const bg1 = "url('./src/img/bg1.jfif')"
  const bg2 = "url('./src/img/bg2.jfif')"
  const bg3 = "url('./src/img/bg3.jfif')"
  const bg4 = "url('./src/img/bg4.jfif')"
  const bg5 = "url('./src/img/bg5.jfif')"

  if (bg === 1) {
    bgContainer.style.backgroundImage = bg2
    bg = 2
    changeBgm()
  }
  else if (bg === 2) {
    bgContainer.style.backgroundImage = bg3
    bg = 3
    changeBgm()
  } 
  else if (bg === 3) {
    bgContainer.style.backgroundImage = bg4
    bg = 4
    changeBgm()
  } 
  else if (bg === 4) {
    bgContainer.style.backgroundImage = bg5
    bg = 5
    changeBgm()
  } 
  else if (bg === 5) {
    bgContainer.style.backgroundImage = bg1
    bg = 1
    changeBgm()
  } 
}

const changeBgm = function() {
  audioBgm1.pause()
  audioBgm1.currentTime = 0;
  audioBgm2.pause()
  audioBgm2.currentTime = 0;
  audioBgm3.pause()
  audioBgm3.currentTime = 0;
  audioBgm4.pause()
  audioBgm4.currentTime = 0;
  audioBgm5.pause()
  audioBgm5.currentTime = 0;

  if (bg === 1) {
    audioBgm1.play()
  }
  else if (bg === 2) {    
    audioBgm2.play()
  } 
  else if (bg === 3) {    
    audioBgm3.play()
  } 
  else if (bg === 4) {    
    audioBgm4.play()
  } 
  else if (bg === 5) {    
    audioBgm5.play()
  } 
}

// TIMER =================================================================================================================================
const timerCallback = function() {    
    timerCount--
    createText(".timer-text", `Time left : ${timerCount} sec.`)

    if (timerCount === 0) {
      if (player === 1) {
        player = 2    
      }
      else if (player === 2) { 
        player = 1    
      } 
      createText(".turn-text", `Its [Player${player}]'s turn.`)   
      timerCount = 30
    }    
  }

const startTimer = function(){
  clearInterval(runningTimer)
  timerCount = 30
  runningTimer = setInterval(timerCallback, 1000);
}  
    
const resetTimer = function(){
  clearInterval(runningTimer)
  timerCount = 30
  createText(".timer-text", `Time left : ${timerCount} sec.`)
}  

// GAME BUTTON CALLBACKS =================================================================================================================
const gameStart = function() {
  if (document.querySelector(".game-status")){
    document.querySelector(".game-status").remove()
    document.querySelector(".ready").style.background = `linear-gradient(310deg, rgb(88, 88, 88) 15%, rgb(187, 187, 187) 100%)`
    document.querySelector(".ready").style.color = "silver"    
    createBoard()
  } 
}

const gameGiveUp = function() {  
  if (document.querySelector(".game-status")) return
  if (player === 1) {
    player = 2
    isWin()
    player = 1
  }
  else if (player === 2) { 
    player = 1
    isWin()
    player = 2
  }  
}

const gameDraw = function() { 
  if (document.querySelector(".game-status")) return
  const text =  `Player${player} is requesting a draw!\n'OK' to accept\n'Cancel' to decline`  
  if (confirm(text)===true){
    audioDraw.play()
    p1Log.tie ++
    p2Log.tie ++
    updateScore()
    reset(`PLAYERS<br>DRAW!`)
  }
}

const gameRedo = function() { 
  if (!lastPositionRow || !lastPositionCol) {
    alert("No vaild moves to undo!\nYou can only redo your previous turn.")
  } else {
    if (player === 1) {
      player = 2    
    }
    else if (player === 2) { 
      player = 1    
    }  

    const text =  `Player${player} is requesting to undo a move!\n'OK' to accept\n'Cancel' to decline`
    if (confirm(text)===true){
      resetTimer()
      board[lastPositionRow][lastPositionCol] = 0     
      document.querySelector(`.game-square-${lastPositionRow}-${lastPositionCol}`).innerHTML = ""
      lastPositionRow = ""
      lastPositionCol = ""
      createText(".turn-text", `Its [Player${player}]'s turn.`) 
    } else {
      if (player === 1) {
        player = 2    
      }
      else if (player === 2) { 
        player = 1    
      }  
    }  
  }
}

const gameExit = function() { 
  const text =  `Are u sure u want to abandon the match?\n'OK' to leave\n'Cancel' to stay`  
  if (confirm(text)===true){
    audioExit.play()
    setInterval(()=>{location.reload()}, 1000)
  }  
}

// CREATE GAME BOARD / PLACE GAME PIECES =================================================================================================
const createBoard = function() {
  for (let i = 0; i < 19; i++) {
    const oneRow = new Array(19);
    oneRow.fill(0);
    board.push(oneRow);
  }

  for (let row = 0; row <= 18; row++){
    for (let col = 0; col <= 18; col++){    
      const square = createDiv(`game-square-${row}-${col}`)    
      square.classList.add("game-square")
      square.addEventListener('click', ()=>{ insertGamePiece(row, col) });      
      appendDiv(".game-board", square)
    }
  }
}

const insertGamePiece = function(row, col) {    
  if (board[row][col] === 0) { 

    startTimer()  
    lastPositionRow = row
    lastPositionCol = col

    if (player === 1) {
      audioClickGame.play()
      document.querySelector(`.game-square-${row}-${col}`).appendChild(createImg("game-piece-slime", "./src/img/slime.gif", "game-piece")) 
      board[row][col] = 1
        if (winCheck(row,col) === true) {
          isWin()
        } 
        else if (drawCheck(board) === true) {
          isDraw()
        }
      player = 2
      createText(".turn-text", `Its [Player${player}]'s turn.`)      
    }    
    else if (player === 2) {
      audioClickGame.play()
      document.querySelector(`.game-square-${row}-${col}`).appendChild(createImg("game-piece-mushroom", "./src/img/mushroom.gif", "game-piece"))
      board[row][col] = 2
        if (winCheck(row,col) === true) {
          isWin()
        } 
        else if (drawCheck(board) === true) {
          isDraw()
        }
      player = 1
      createText(".turn-text", `Its [Player${player}]'s turn.`)     
    }  
  }
}

// WIN / DRAW / RESET ====================================================================================================================
const reset = function(displayText) { 
  board = []
  lastPositionRow = ""
  lastPositionCol = ""
  resetTimer()
  document.querySelector(".game-board").remove()
  appendDiv(".board-container", createDiv("game-board"))
  appendDiv(".game-board", createDiv("game-status"))
  appendDiv(".game-status", createDiv("game-status-msg"))
  createText(".game-status-msg", displayText) 
  document.querySelector(".ready").style.background = `linear-gradient(310deg, rgb(255, 95, 0) 5%, rgb(245, 155, 20) 100%)`
  document.querySelector(".ready").style.color = "white"
}  

const isWin = function () {
  audioWin.play()
  if (player === 1) {
    p1Log.win ++
    p1Log.points += 100
    p2Log.loss ++    
    updateScore()
  }
  else if (player === 2) { 
    p2Log.win ++
    p2Log.points += 100
    p1Log.loss ++
    updateScore()
  }  
  reset(`PLAYER ${player}<br>WINS!`)
}

const isDraw = function () {
  audioDraw.play()
  p1Log.tie ++
  p2Log.tie ++
  updateScore()
  reset(`PLAYERS<br>DRAW!`)  
}  

// WIN & DRAW CHECK ======================================================================================================================
const winCheck = function (row,col) {

let rowCount = 0
let colCount = 0
let crossLeftCount = 0
let crossRightCount = 0

  if (board[row][col] === board[row][col-1] && col >= 1){
    rowCount ++
    if (board[row][col-1] === board[row][col-2] && col >= 2){
      rowCount ++
      if (board[row][col-2] === board[row][col-3] && col >= 3){
        rowCount ++
        if (board[row][col-3] === board[row][col-4] && col >= 4){
          rowCount ++
          if (rowCount === 4) return true
        }
      }      
    }
  }

  if (board[row][col] === board[row][col+1] && col <= 17){
    rowCount ++
    if (rowCount === 4) return true
      if (board[row][col+1] === board[row][col+2] && col <= 16){
      rowCount ++
      if (rowCount === 4) return true
        if (board[row][col+2] === board[row][col+3] && col <= 15){
        rowCount ++
        if (rowCount === 4) return true
          if (board[row][col+3] === board[row][col+4] && col <= 14){
          rowCount ++
          if (rowCount === 4) return true
        }
      }      
    }
  }  

  if (row >= 1 && board[row][col] === board[row-1][col]){
    colCount++
    if (row >= 2 && board[row-1][col] === board[row-2][col]){
      colCount++
      if (row >= 3 && board[row-2][col] === board[row-3][col]){
        colCount++
        if (row >= 4 && (board[row-3][col] === board[row-4][col])){
          colCount++      
          if (colCount === 4) return true
        }
      }
    }
  }

  if (row <= 17 && board[row][col] === board[row+1][col]){
    colCount++
    if (colCount === 4) return true
      if (row <= 16 && board[row+1][col] === board[row+2][col]){
      colCount++
      if (colCount === 4) return true
        if (row <= 15 && board[row+2][col] === board[row+3][col]){
        colCount++
        if (colCount === 4) return true
          if (row <= 14 && board[row+3][col] === board[row+4][col]){
          colCount++      
          if (colCount === 4) return true
        }
      }
    }
  }

  if (row >= 1 && col >= 1 && board[row][col] === board[row-1][col-1]){
    crossLeftCount++
    if (row >= 2 && col >= 2 && board[row-1][col-1] === board[row-2][col-2]){
      crossLeftCount++
      if (row >= 3 && col >= 3 && board[row-2][col-2] === board[row-3][col-3]){
        crossLeftCount++
        if (row >= 4 && col >= 4 && (board[row-3][col-3] === board[row-4][col-4])){
          crossLeftCount++      
          if (crossLeftCount === 4) return true
        }
      }
    }
  }

  if (row <= 17 && col <= 17 && board[row][col] === board[row+1][col+1]){
    crossLeftCount++
    if (crossLeftCount === 4) return true
    if (row <= 16 && col <= 16 && board[row+1][col+1] === board[row+2][col+2]){
      crossLeftCount++
      if (crossLeftCount === 4) return true
      if (row <= 15 && col <= 15 && board[row+2][col+2] === board[row+3][col+3]){
        crossLeftCount++
        if (crossLeftCount === 4) return true
        if (row <= 14 && col <= 14 && (board[row+3][col+3] === board[row+4][col+4])){
          crossLeftCount++      
          if (crossLeftCount === 4) return true
        }
      }
    }
  }

  if (row >= 1 && col <= 17 && board[row][col] === board[row-1][col+1]){
    crossRightCount++
    if (row >= 2 && col <= 16 && board[row-1][col+1] === board[row-2][col+2]){
      crossRightCount++
      if (row >= 3 && col <= 15 && board[row-2][col+2] === board[row-3][col+3]){
        crossRightCount++
        if (row >= 4 && col <= 14 && (board[row-3][col+3] === board[row-4][col+4])){
          crossRightCount++      
          if (crossRightCount === 4) return true
        }
      }
    }
  }

  if (row <= 17 && col >= 1 && board[row][col] === board[row+1][col-1]){
    crossRightCount++
    if (crossRightCount === 4) return true
    if (row <= 16 && col >= 2 && board[row+1][col-1] === board[row+2][col-2]){
      crossRightCount++
      if (crossRightCount === 4) return true
      if (row <= 15 && col >= 3 && board[row+2][col-2] === board[row+3][col-3]){
        crossRightCount++
        if (crossRightCount === 4) return true
        if (row <= 14 && col >= 4 && (board[row+3][col-3] === board[row+4][col-4])){
          crossRightCount++      
          if (crossRightCount === 4) return true
        }
      }
    }
  }
}

const drawCheck = (board) => {
  for (let i = 0; i < 19; i++) {    
    if (board[i].includes(0) === true) {      
      return false
    }   
  }  
  return true  
}	

// BUILD HTML ============================================================================================================================
const init = function () {
  appendDiv("body", createDiv("container"))
  appendDiv(".container", createDiv("background-container"))

  appendDiv(".background-container", createDiv("control-container"))
    appendDiv(".control-container", createBtn("control-btn", "PLAY BGM", changeBgm)) 
    appendDiv(".control-container", createBtn("control-btn", "SWAP MAP", changeBg)) 
    appendDiv(".control-container", createBtn("control1-btn", "NEW GAME", gameStart)) 
    appendDiv(".control-container", createBtn("control2-btn", "GIVE UP", gameGiveUp)) 
    appendDiv(".control-container", createBtn("control2-btn", "DRAW", gameDraw)) 
    appendDiv(".control-container", createBtn("control2-btn", "REDO", gameRedo)) 
    appendDiv(".control-container", createBtn("control3-btn", "EXIT", gameExit))   

  appendDiv(".background-container", createDiv("main-container"))
    appendDiv(".main-container", createDiv("game-container"))

      appendDiv(".game-container", createDiv("board-container"))
        appendDiv(".board-container", createDiv("game-board"))

      appendDiv(".game-container", createDiv("timer-container"))
        appendDiv(".timer-container", createDiv("turn-text"))
        appendDiv(".timer-container", createDiv("timer-text"))
        createText(".turn-text", `Its [Player${player}]'s turn.`)
        createText(".timer-text", "Time left : 30 sec.")
      
    appendDiv(".main-container", createDiv("info-container"))

      appendDiv(".info-container", createDiv("title-container"))
        appendDiv(".title-container", createDiv("minigame-text"))
        appendDiv(".title-container", createDiv("title-text"))  
        createText(".minigame-text", "MAPLE<BR>MINIGAME")
        createText(".title-text", "https://github.com/happymealseller")    

      appendDiv(".info-container", createDiv("player-container"))
        appendDiv(".player-container", createDiv("player-1"))
          appendDiv(".player-1", createDiv("player-img"))
          appendDiv(".player-1", createDiv("player-name"))
          appendDiv(".player-1", createDiv("player-points"))
          appendDiv(".player-1", createDiv("player-record"))

          appendDiv(".player-img", createImg("player1-img", "./src/img/player1.gif", "game-piece"))
          createText(".player-name", "PLAYER 1")  
          createText(".player-points", `${p1Log.points} POINT`)  
          createText(".player-record", `${p1Log.win} W<br> ${p1Log.loss} L<br> ${p1Log.tie} T`)  

        appendDiv(".player-container", createDiv("player-2"))
          appendDiv(".player-2", createDiv("player-img-2"))
          appendDiv(".player-2", createDiv("player-name-2"))
          appendDiv(".player-2", createDiv("player-points-2"))
          appendDiv(".player-2", createDiv("player-record-2"))

          appendDiv(".player-img-2 ", createImg("player2-img", "./src/img/player2.gif", "game-piece"))
          createText(".player-name-2", "PLAYER 2")  
          createText(".player-points-2", `${p2Log.points} POINT`)  
          createText(".player-record-2", `${p2Log.win} W<br> ${p2Log.loss} L<br> ${p2Log.tie} T`)  

        appendDiv(".player-container", createDiv("player-3"))
          appendDiv(".player-3", createDiv("player-img-3"))
          appendDiv(".player-3", createDiv("player-name-3"))
          appendDiv(".player-3", createDiv("player-points-3"))
          appendDiv(".player-3", createDiv("player-record-3"))

          appendDiv(".player-img-3", createImg("player0-img", "./src/img/player0.png", "game-piece"))
          createText(".player-name-3", "")  
          createText(".player-points-3", "")  
          createText(".player-record-3", "")  

        appendDiv(".player-container", createDiv("player-4"))
          appendDiv(".player-4", createDiv("player-img-4"))
          appendDiv(".player-4", createDiv("player-name-4"))
          appendDiv(".player-4", createDiv("player-points-4"))
          appendDiv(".player-4", createDiv("player-record-4"))

          appendDiv(".player-img-4", createImg("player0-img", "./src/img/player0.png", "game-piece"))
          createText(".player-name-4", "")  
          createText(".player-points-4", "")  
          createText(".player-record-4", "")  

      appendDiv(".info-container", createDiv("ready-container"))
          appendDiv(".ready-container", createDiv("ready-btn"))
          appendDiv(".ready-btn", createBtn("ready", "START !!", gameStart)) // add callbak as 3rd param        

      appendDiv(".info-container", createDiv("chat-container"))
          appendDiv(".chat-container", createDiv("chat-box"))
          createText(".chat-box", `${chatLog}`) 
          
      appendDiv(".info-container", createDiv("input-container"))
          appendDiv(".input-container", createInput("input-box", "Input text here, hit enter to submit... ", (e)=>{updateChatBox(e)}))       

      appendDiv(".info-container", createDiv("btn-container"))
        appendDiv(".btn-container", createDiv("btn-blue"))
        appendDiv(".btn-blue", createBtn("giveup", "GIVE UP", gameGiveUp))
        appendDiv(".btn-blue", createBtn("draw", "DRAW", gameDraw))
        appendDiv(".btn-blue", createBtn("redo", "REDO", gameRedo))

        appendDiv(".btn-container", createDiv("btn-red"))
        appendDiv(".btn-red", createBtn("exit", "EXIT", gameExit))

  createBoard()
}

// INIT GAME =============================================================================================================================
init()
