//Global variables
const canvas = document.querySelector("canvas")
const toolBtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")

//Variables
let ctx = canvas.getContext("2d"),
    isDrawing = false,
    brushWidth = 5,
    selectedTool = "brush",
    prevMouseX,
    prevMouseY,
    snapshot

// Set canvas width and height
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
})

// Start drawing
const startDrow = e => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

//Draw rectangle
const drawRectangle = e => {
    fillColor.checked ? ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY) : ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = e => {
    ctx.beginPath()
    const radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI * radius)
    fillColor.checked ? ctx.fill() : ctx.stroke
    ctx.stroke()
}

//Drawing
const drawing = e => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)

    switch (selectedTool) {
        case "brush":
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break;
        case "rectangle":
            drawRectangle(e)
            break;
        case "circle":
            drawCircle(e)
            break;
        default:
            break;
    }
}

//Tools btn and set to variables  selected tool
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(btn.id);


    })
})

//Stop drawing
const stopDraw = () => {
    isDrawing = false
}

canvas.addEventListener("mousedown", startDrow)
canvas.addEventListener("mouseup", stopDraw)
canvas.addEventListener("mousemove", drawing)
