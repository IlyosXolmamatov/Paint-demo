//Global variables
const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvasBtn = document.querySelector(".clear-canvas")
saveImageBtn = document.querySelector(".save-image")


//Variables with value
let ctx = canvas.getContext("2d"),
    isDrawing = false,
    brushWidth = 5,
    selectedTool = "brush",
    selectedColor = "#000",
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
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

//Draw rectangle
const drawRectangle = e => {
    fillColor.checked ? ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY) : ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

//Draw circle
const drawCircle = e => {
    ctx.beginPath()
    const radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI * radius)
    fillColor.checked ? ctx.fill() : ctx.stroke()
    ctx.stroke()
}

//Draw triangle
const drawTriangle = e => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()

}

//Drawing
const drawing = e => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool == "brush" || selectedTool == "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    }
    switch (selectedTool) {
        case "rectangle":
            drawRectangle(e)
            break;
        case "circle":
            drawCircle(e)
            break;
        case "triangle":
            drawTriangle(e)
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
    })
})

//Change brush width
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value)

//Set color to shapes
colorBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        const bgColor = window.getComputedStyle(btn).getPropertyValue("background-color")
        selectedColor = bgColor;
    })
})

//Set  color  from color chicker
colorPicker.addEventListener("change", e => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value
    colorPicker.parentElement.click()
})

//Clear canvas button
clearCanvasBtn.addEventListener("click", e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

//Save image button
saveImageBtn.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = `Paint-save-${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

//Stop drawing
const stopDraw = () => {
    isDrawing = false
}

canvas.addEventListener("mousedown", startDrow)
canvas.addEventListener("mouseup", stopDraw)
canvas.addEventListener("mousemove", drawing)
