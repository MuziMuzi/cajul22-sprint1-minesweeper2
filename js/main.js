'use strict'
var gIdx = 1
var gBoard
const MINE = '💣'
var gIsGameOn = true
var gIsWin = false
var gLives = 3
const FLAG = '🚩'
const WINSMILEY = '😎'
const LOSESMILEY = '🤯'
const SMILEY = '🤠'
var gFirstMove = false
var gTimeInterval
var timeTrack
var gDifficulty = { size: 4, mineCount: 2 }
var gHintsLeft
var gIsHint
var gDiff = null
var gFlagCount
var gIsCustom
var gIsCustomGame
var gSavedTurns
var gSafeClick


function initGame() {
    gSafeClick = 3
    gIsCustom = false
    if (!gDiff) gDiff = 'easy'
    if (!gFlagCount) gFlagCount = 2
    gIsHint = false
    gHintsLeft = 3
    gLives = 3
    gFirstMove = false
    gIsGameOn = true
    gIsWin = false
    timeTrack = 0
    resetCustomButton()
    renderFlagCount()
    renderBestScore()
    resetHints()
    updateLives()
    runTime()
    gBoard = makeBoard(gDifficulty)
    gSavedTurns = [copyMat(gBoard)]
    printMat(gBoard, '.game-board')
    renderSmiley()
    upDateSafeClickCount()
}
function upDateSafeClickCount(){
    var elSpan = document.querySelector('.safe-container span')
    elSpan.innerText = gSafeClick
}
function showSafeCell() {
    if (gSafeClick < 1) return
    gSafeClick--
    upDateSafeClickCount()
    var safeSpots = []
    // var RandomRowIdx = getRandomIntInt(0, gBoard.length)
    // var RandomColIdx = getRandomIntInt(0, gBoard.length)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.content === MINE) continue
            if (currCell.isShown) continue
            safeSpots.push(currCell.location)

        }
    }
    console.log(safeSpots)
    var safeSpot = safeSpots[getRandomIntInt(0, safeSpots.length)]
    console.log(safeSpot)
    var elCell = document.querySelector(`.cell-${safeSpot.i}-${safeSpot.j}`)
    elCell.style.backgroundColor = "rgb(164 217 103)"
    setTimeout(() => { elCell.style.backgroundColor = 'rgba(216, 216, 218, 0.856)' }, 2000)


}
function customModeModal() {
    var elModal = document.querySelector('.custom-modal')
    elModal.style.display = 'block'
    setTimeout(() => { elModal.style.display = 'none' }, 1500)
}
function customMode(elBtn) {
    if (gFirstMove) {
        customModeModal()
        return
    }
    if (!gIsCustom) {
        elBtn.innerText = 'Click here again to stop placing Bombs'
        gIsCustom = true
        gFlagCount = 0
    } else {
        elBtn.innerText = 'All done,you\'re ready to play'
        addNumbers(gBoard)
        printMat(gBoard, '.game-board')
        gIsCustom = false
        gIsCustomGame = true
    }

}
function resetCustomButton() {
    var elBtn = document.querySelector('.custom-mode')
    elBtn.innerText = 'Click Here to place the bombs yourself!'
}

function renderFlagCount() {
    var elFlag = document.querySelector('.flag-counter')
    if (gFlagCount >= 0) {
        elFlag.querySelector('span').innerText = gFlagCount
    } else {
        elFlag.innerText = 'You\'ve put too many flags!!'
    }
}
function renderBestScore() {
    var elScoreTrack = document.querySelector('.score-container span')
    elScoreTrack.innerText = localStorage[gDiff]
}
function resetHints() {
    for (var i = 1; i < 4; i++) {
        var elHint = document.querySelector(`.hint${i}`)
        elHint.style.display = 'inline'
    }

}
function useHint() {
    gIsHint = true
}
function closeHint() {
    var elHint = document.querySelector(`.hint${gHintsLeft}`)
    elHint.style.display = 'none'
    gHintsLeft--
}

function changeDiff(elBtn) {
    if (elBtn.className === 'easy') {
        gDifficulty = { size: 4, mineCount: 2 }
        gDiff = 'easy'
        gFlagCount = gDifficulty.mineCount
        initGame()
    } else if (elBtn.className === 'medium') {
        gDifficulty = { size: 8, mineCount: 12 }
        gDiff = 'medium'
        gFlagCount = gDifficulty.mineCount
        initGame()
    } else if (elBtn.className === 'hard') {
        gDifficulty = { size: 12, mineCount: 30 }
        gDiff = 'hard'
        gFlagCount = gDifficulty.mineCount
        initGame()
    }
}
function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isShown) return
            if (currCell.content === MINE && !currCell.isFlagged) return
        }
    }
    gIsWin = true
    renderSmiley()
}

function renderSmiley() {
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = SMILEY
    if (gIsWin) elSmiley.innerText = WINSMILEY
    if (!gIsGameOn) elSmiley.innerText = LOSESMILEY

}

function printMat(mat, selector) {

    var strHTML = ''
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = (mat[i][j].isShown) ? mat[i][j].content : ''
            if (mat[i][j].isFlagged) cell = FLAG
            var className = 'cell cell-' + i + '-' + j
            if (mat[i][j].isShown) className += ` shown`
            strHTML += `<td><button id="${mat[i][j].id}" class="${className}" onmousedown="clickCell(this,event)">${cell}</button></td>`
        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}
function showNeighbors(rIdx, cIdx) {
    for (var i = rIdx - 1; i <= rIdx + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue
        for (var j = cIdx - 1; j <= cIdx + 1; j++) {
            if (j > gBoard[i].length - 1 || j < 0) continue
            if (i === rIdx && j === cIdx) continue
            if (gBoard[i][j].isShown) {
                continue
            } else if (gBoard[i][j].content !== MINE) {
                gBoard[i][j].isShown = true
            }
            if (gBoard[i][j].content === ' ' && gFirstMove) {
                showNeighbors(i, j)
            }
        }
    }

}
function flashNeighbors(rIdx, cIdx) {
    var flashedLocations = []
    for (var i = rIdx - 1; i <= rIdx + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue
        for (var j = cIdx - 1; j <= cIdx + 1; j++) {
            if (j > gBoard[i].length - 1 || j < 0) continue
            if (gBoard[i][j].isShown) continue
            gBoard[i][j].isShown = true
            flashedLocations.push({ i, j })

        }
    }
    console.log(flashedLocations)
    setTimeout(unFlashNeighbors, 1000, flashedLocations)
}
function unFlashNeighbors(locations) {
    console.log('hey')
    for (var i = 0; i < locations.length; i++) {
        gBoard[locations[i].i][locations[i].j].isShown = false
        console.log(gBoard[locations[i].i][locations[i].j])
    }
    printMat(gBoard, '.game-board')
}
// function unFlashNeighbors(rIdx, cIdx) {
//     for (var i = rIdx - 1; i <= rIdx + 1; i++) {
//         if (i > gBoard.length - 1 || i < 0) continue
//         for (var j = cIdx - 1; j <= cIdx + 1; j++) {
//             if (j > gBoard[i].length - 1 || j < 0) continue
//             gBoard[i][j].isShown = false

//         }
//     }
//     printMat(gBoard, '.game-board')

// }
function showAllBombs() {
    var timeout = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isShown && gBoard[i][j].content === MINE) {
                setTimeout(showCell, timeout, i, j)
                timeout += 25
            }
        }
    }
}
function showCell(i, j) {
    gBoard[i][j].isShown = true
    printMat(gBoard, '.game-board')
}

function popUpLiveUsing() {
    const elModal = document.querySelector('.modal-lives')
    elModal.style.display = 'block'
    setTimeout(() => { elModal.style.display = 'none' }, 1500)
}
function updateLives() {
    var elLives = document.querySelector('.lives-counter span')
    elLives.innerText = gLives
}
function changeMineToFlag(rIdx, cIdx) {
    gBoard[rIdx][cIdx].isFlagged = true
    printMat(gBoard, '.game-board')
    checkWin()
}
function mineStepped(rIdx, cIdx) {
    if (gLives > 0) {
        gLives--
        setTimeout(changeMineToFlag, 1500, rIdx, cIdx)
        updateLives()
        popUpLiveUsing()
        return
    }
    gIsGameOn = false
    renderSmiley()
    showAllBombs()

    //change all the board to isshown slowly with a fast running interval 
    //that runs through the whole board and changes each cell to isshown 
    // make a modal of gameover that stays for 2 sec
}
function setTimer() {
    gTimeInterval = setInterval(runTime, 1000)

}
function runTime() {
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = timeTrack
    if (!gFirstMove || gIsWin || !gIsGameOn) {
        clearInterval(gTimeInterval)
    }
    if (gIsWin && typeof (Storage) !== "undefined") {
        if (gDiff === 'easy') {
            if (timeTrack < +localStorage.easy || !localStorage.easy) {
                localStorage.easy = timeTrack
            } console.log(localStorage.easy)
        } else if (gDiff === 'medium') {
            if (timeTrack < +localStorage.medium || !localStorage.medium) {
                localStorage.medium = timeTrack
            }
        } else if (gDiff === 'hard') {
            if (timeTrack < +localStorage.hard || !localStorage.hard) {
                localStorage.hard = timeTrack
            }
        }
        console.log(localStorage)
        renderBestScore()
    }
    timeTrack++
}
function updateBoard(board, mineCount, i, j) {
    addMines(board, mineCount, i, j) // both should happen after the first click on the board
    addNumbers(board)
}
function placeBomb(elCell) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.id === +elCell.id) {
                if (currCell.content === MINE) {
                    currCell.content = ' '
                    currCell.isShown = false
                    gFlagCount--
                    renderFlagCount()
                    printMat(gBoard, '.game-board')
                } else {
                    currCell.content = MINE
                    currCell.isShown = true
                    gFlagCount++
                    renderFlagCount()
                    printMat(gBoard, '.game-board')
                }
            }
        }
    }
}
function undoButton() {
    if (gSavedTurns.length > 1) {
        gBoard = gSavedTurns.pop()
    } else {
        gBoard = makeBoard(gDifficulty)
        gFirstMove = false
    }
    printMat(gBoard, '.game-board')

}
function clickCell(elCell, event) {
    if (gIsCustom) {
        placeBomb(elCell)
        return
    }
    var rIdx
    var cIdx
    if (gIsWin || !gIsGameOn) return
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.id === +elCell.id) {
                rIdx = currCell.location.i
                cIdx = currCell.location.j
                if (gIsHint) {
                    flashNeighbors(i, j)
                    closeHint()
                    gIsHint = false
                    break
                }
                if (event.which === 3) {
                    document.addEventListener('contextmenu', event => event.preventDefault())
                    if (!currCell.isFlagged && !currCell.isShown) {
                        if (!gFirstMove) {
                            gFirstMove = true
                            updateBoard(gBoard, gDifficulty.mineCount, rIdx, cIdx)
                            setTimer()
                        }
                        currCell.isFlagged = true
                        currCell.isShown = true
                        gFlagCount--
                        renderFlagCount()
                        break
                    } else if (currCell.isFlagged) {
                        currCell.isFlagged = false
                        currCell.isShown = false
                        gFlagCount++
                        renderFlagCount()
                        break
                    }
                } else if (!currCell.isFlagged && !currCell.isShown) {
                    currCell.isShown = true
                    if (currCell.content === MINE) {
                        mineStepped(i, j)
                        break
                    } else if (currCell.content === ' ') {
                        if (!gFirstMove) break
                        showNeighbors(i, j)
                        break
                    }
                }
            }
        }
    }
    if (!gFirstMove && !gIsCustomGame) {
        gFirstMove = true
        gBoard[rIdx][cIdx].content = ' '
        updateBoard(gBoard, gDifficulty.mineCount, rIdx, cIdx)
        setTimer()
        showNeighbors(rIdx, cIdx)
    } else if (!gFirstMove && gIsCustomGame) {
        gFirstMove = true
        setTimer()
        showNeighbors(rIdx, cIdx)
    }
    gSavedTurns.push(copyMat(gBoard))
    checkWin()
    printMat(gBoard, '.game-board')

}
function makeBoard(diff) {
    var size = diff.size
    var mineCount = diff.mineCount
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i].push(makeCell(i, j))
        }
    }
    // addMines(board, mineCount) // both should happen after the first click on the board
    // addNumbers(board)            //while putting a mine only on a not shown cell
    return board
}

function addNumbers(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].content === MINE) board[i][j].isShown = false
            var mineCounted = countMinesAround(board, i, j)
            if (mineCounted > 0 && board[i][j].content !== MINE) {
                board[i][j].content = `${mineCounted}`
            }
        }
    }
}
function addMines(board, mineCount, i, j) {
    while (mineCount > 0) {
        var RandomRowIdx = getRandomIntInt(0, board.length)
        var RandomColIdx = getRandomIntInt(0, board.length)
        var currCell = board[RandomRowIdx][RandomColIdx]
        if (currCell.content !== MINE && !currCell.isShown) {
            if ((currCell.location.i >= i - 1 && currCell.location.i <= i + 1) && (currCell.location.j >= j - 1 && currCell.location.j <= j + 1)) continue
            currCell.content = MINE
            mineCount--
        }
    }


}
function makeCell(i, j) {
    return {
        id: gIdx++,
        location: { i, j },
        isShown: false,
        content: ' ',
        isFlagged: false
    }
}
function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
function countMinesAround(board, rIdx, cIdx) {
    var mineCounter = 0
    for (var i = rIdx - 1; i <= rIdx + 1; i++) {
        if (i > board.length - 1 || i < 0) continue
        for (var j = cIdx - 1; j <= cIdx + 1; j++) {
            if (j > board[i].length - 1 || j < 0) continue
            if (i === rIdx && j === cIdx) continue
            if (board[i][j].content === MINE) mineCounter++
        }
    }
    return mineCounter
    //empty template ready to search numbers or anything else in the area of neighborhood
}
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = {
                id: mat[i][j].id,
                location: mat[i][j].location,
                isShown: mat[i][j].isShown,
                content: mat[i][j].content,
                isFlagged: mat[i][j].isFlagged
            }
        }
    }
    return newMat;
}
