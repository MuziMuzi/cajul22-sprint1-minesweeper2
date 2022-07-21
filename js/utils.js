'use strict'

function printMat(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function showModal() {
    const elModal = document.querySelector()// just put the modal name 
    elModal.style.display = 'block'
}
function hideModal() {
    const elModal = document.querySelector() //just put the modal name
    elModal.style.display = 'none'
}

function findCell(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            if (board[i][j] === 'what you want to find') { }// then do something with it
        }
    }

}
function returnEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === 'whatever you actually want to find') emptyCells.push({ i, j })
        }   // can be not empty ofcourse, just a template
    }
    var emptyCell = emptyCells[getRandomIntInt(0, emptyCells.length)]
    return emptyCell
}

function findNeighbors(board, rIdx, cIdx) {
    for (var i = rIdx - 1; i <= rIdx + 1; i++) {
        if (i > board.length - 1 || i < 0) continue
        for (var j = cIdx - 1; j <= cIdx + 1; j++) {
            if (j > board[i].length - 1 || j < 0) continue
            if (i === rIdx && j === cIdx) continue
        }
    }
    //empty template ready to search numbers or anything else in the area of neighborhood
}