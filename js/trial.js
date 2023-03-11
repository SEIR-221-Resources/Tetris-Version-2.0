/*----- constants -----*/
const shapes = ['T', 'L', 'J', 'S', 'Z', 'O', 'I']
const colors = {
    'p': '#F283A0',
    'q': '#8888FC',
    'r': '#93E6C6',
    's': '#FFFD6E',
    't': '#FAAA70',
    'u': '#F2D0B1',
    'v': '#DBB8FC',
    'b': '#000000'
}
const shapeMatrices = {
    'T': [
        ['b', 'p'],
        ['p', 'p'],
        ['b', 'p']    
    ],
    'L': [
        ['q','q'],
        ['b','q'],
        ['b','q']
    ],
    'J': [
        ['b', 'r'],
        ['b', 'r'],
        ['r', 'r']
    ],
    'S': [
        ['s', 'b'], 
        ['s', 's'], 
        ['b', 's']
    ],
    'Z': [
        ['b', 't'], 
        ['t', 't'], 
        ['t', 'b']
    ],
    'O': [
        ['u', 'u'],
        ['u', 'u']
    ],
    'I': [
        ['v'],
        ['v'],
        ['v'],
        ['v']
    ]    
}
const originRow = 0
const originCol = 4
const rowIndex = 1
const columnIndex = 0
const boardHeight = 20
const boardWidth = 10
const boardLeftEnd = 0
const boardRightEnd = 9
const boardBottom = 19
const boardTop = 0

/*----- state variables -----*/
let gameOver = false
let board
let block
let isPrevBlockDone = true
let currentColumn = 0
let currentRow = 0
let nOfRowsInBlock
let nOfColsInBlock
let blockArray
let bottomCells = []
let leftCells = []
let rightCells = []
let blockCorners = { 'topLeft': [], 'topRight': [], 'bottomRight': [], 'bottomLeft': [] }

/*----- cached elements  -----*/

const boardEl = document.querySelector("#board")
const messageEl = document.querySelector("#message")
const playAgainEl = document.querySelector("#playAgain")


/*----- event listeners -----*/

playAgainEl.addEventListener('click', init)
document.addEventListener('keyup', keyBehavior)

/*----- functions -----*/
function init() {
    board = [
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']
    ]
    gameOver = false
    render()
    blockGenerator()

}
function render() {
    renderBoard()
    renderMessage()
    renderControls()
}
function renderBoard() {
    board.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            let cellId = `r${rowIdx}c${colIdx}`
            let cellEl = document.getElementById(cellId)
            cellEl.style.backgroundColor = colors[cellVal]
        })
    })
}
function renderMessage() {
    if (gameOver === true) {
        messageEl.innerText = "GAME OVER!!!"
    }
    else{
        isPrevBlockDone = true
        messageEl.innerText=""   
    }
}
function renderControls() {
    playAgainEl.style.visibility
        = gameOver ? 'visible' : 'hidden'
}
function keyBehavior(evt) {
    if (evt.key === "ArrowDown") {
        //moves the block down the board

        //finds the cell values below the block
        findBottomCells()
        
        if(bottomCells.every(el=>el==='b') && blockCorners.bottomLeft[rowIndex]!==19){
            cornerCalculator()
            currentColumn = blockCorners.topLeft[columnIndex]
            currentRow = blockCorners.topLeft[rowIndex]

            let tempBoard = []
            for(let c = currentColumn; c<nOfColsInBlock+currentColumn ; c++){
                let tempColumn = board[c].map(cl=>cl)
                tempBoard.push(tempColumn)
            }
            
            
            for(let r = currentRow+nOfRowsInBlock; r>=currentRow; r--){
                for(let c = 0; c<tempBoard.length; c++ ){
                    if(r===0){
                        tempBoard[c][r]= 'b'
                    }
                    else{
                        tempBoard[c][r] = tempBoard[c][r-1]
                    }
                    
                }                
                
            }
            board.splice(currentColumn, nOfColsInBlock, ...tempBoard)  
            currentRow++
            cornerCalculator()
                    
            render()
        }
        else{
            isPrevBlockDone = true
            if(currentRow === boardTop){
                gameOver = true
                render()
            }else{
                blockGenerator()
            }
        }
        
    }
    else if (evt.key === "ArrowLeft") {
        currentColumn = blockCorners.topLeft[columnIndex]
        currentRow = blockCorners.topLeft[rowIndex]

        findBottomCells()

        //finding cells on the left side of the block and the cells on the left end of the block
        let leftCells = []
        let cells = []
        let c = currentColumn
        
        for(let r = currentRow; r<nOfRowsInBlock+currentRow; r++){
            cells.push(board[c][r])
            leftCells.push(board[c-1][r])
        }
        //move left
        if(leftCells.every(cl=>cl==='b') && blockCorners.topLeft[columnIndex] !== boardLeftEnd && bottomCells.every(cl=>cl==='b') && blockCorners.bottomLeft[rowIndex] !== boardBottom){
            for(let c = currentColumn; c<currentColumn+nOfColsInBlock; c++){
                for(let r = currentRow; r<currentRow+nOfRowsInBlock; r++){
                    if(c>boardLeftEnd){
                        board[c-1][r] = board[c][r]
                        board[c][r] = 'b'
                    }
                }
            }         
            currentColumn--
            cornerCalculator()
            render() 
        }
        else{
            isPrevBlockDone = true
            if(currentRow === boardTop && bottomCells.every(cl=>cl==='b')){
                gameOver = true
                render()
            }else{
                blockGenerator()
            }
        }              

    } else if (evt.key === "ArrowRight") {
        currentColumn = blockCorners.topLeft[columnIndex]
        currentRow = blockCorners.topLeft[rowIndex]

        findBottomCells()

        //finding cells on the right side of the block and the cells on the right end of the block
        let rightCells = []
        let cells = []
        let c = currentColumn + nOfColsInBlock
        
        for(let r = currentRow; r<nOfRowsInBlock+currentRow; r++){
            if(c<boardRightEnd){
                cells.push(board[c][r])
                rightCells.push(board[c+1][r])
            }            
        }
        //move right
        if(rightCells.every(cl=>cl==='b') && blockCorners.topRight[columnIndex] !== boardRightEnd && bottomCells.every(cl=>cl==='b') && blockCorners.bottomRight[rowIndex] !== boardBottom){
            for(let c = currentColumn+nOfColsInBlock-1 ; c>=currentColumn; c--){
                for(let r = currentRow; r<currentRow+nOfRowsInBlock; r++){
                    if(c>=boardLeftEnd){
                        board[c+1][r] = board[c][r]
                        board[c][r] = 'b'
                    }
                }
            }         
            currentColumn++
            cornerCalculator()
            render()   
        }
        else{
            isPrevBlockDone = true
            if(currentRow === boardTop && bottomCells.every(cl=>cl==='b')){
                gameOver = true
                render()
            }else{
                blockGenerator()
            }
        }    
                 
    }
}

function isRowFilled() {
    //checks if any rows on board are filled. If yes, then they get deleted.
    for(let r=0; r<=19; r++){
        let rw = board.map(c=>c[r])
        if(!rw.includes('b')){
            board.forEach(col=>{
                col.splice(r, 1)
                col.unshift('b')
            })
        }
    }
}
function cornerCalculator() {
    blockCorners.topLeft = [currentColumn, currentRow]
    blockCorners.topRight = [currentColumn + nOfColsInBlock - 1, currentRow]
    blockCorners.bottomRight = [currentColumn + nOfColsInBlock - 1, currentRow + nOfRowsInBlock - 1]
    blockCorners.bottomLeft = [currentColumn, currentRow + nOfRowsInBlock - 1]
}
function randomBlockGenerator() {
    //generates a random block 
    let randomNumber = Math.floor(Math.random() * 7)
    let blockShape = shapes[randomNumber]
    blk = shapeMatrices[blockShape]
    
    return blk
}
function blockGenerator() {
    //generates a block and places it on board

    block = randomBlockGenerator()
    nOfRowsInBlock = block[0].length
    nOfColsInBlock = block.length
    blockArray = []
    

    //converts the block into a single array
    block.forEach(col => col.forEach(cell=>blockArray.push(cell)))
    currentColumn = originCol
    currentRow = originRow
    start = currentRow

    //places the block into the board
    
    while(start < blockArray.length){
        board[currentColumn].splice(0, nOfRowsInBlock, ...blockArray.slice(start, start+nOfRowsInBlock))
        start = start+nOfRowsInBlock
        currentColumn++
    }
    
    //resetting the column position and row position of the block
    currentColumn = originCol
    currentRow = originRow
    
    isPrevBlockDone = false

    //calculating the corner indices of the block on board
    cornerCalculator()
    render()
    
}
function findBottomCells() {
    //finds cells at the bottom of the block on board
    bottomCells = []

    for (let c = blockCorners.bottomLeft[0]; c <= blockCorners.bottomRight[0]; c++) {
        let r = blockCorners.bottomLeft[1]
        let bRow = r + 1
        if (r < 19) {
            bottomCells.push(board[c][bRow])         
        }
    }
}
init()
