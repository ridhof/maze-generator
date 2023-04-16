// Global variables
let mazeNodes = {};

// Check if globals are defined
if (typeof maxMaze === 'undefined') {
    maxMaze = 0;
}

if (typeof maxCanvas === 'undefined') {
    maxCanvas = 0;
}

if (typeof maxCanvasDimension === 'undefined') {
    maxCanvasDimension = 0;
}

if (typeof maxWallsRemove === 'undefined') {
    maxWallsRemove = 300;
}

// Update remove max walls html
const removeMaxWallsText = document.querySelector('.desc span');
if (removeMaxWallsText) {
    removeMaxWallsText.innerHTML = maxWallsRemove;
}

const download = document.getElementById("download");
download.addEventListener("click", downloadImage, false);
download.setAttribute('download', 'maze.png');

function getSettings() {
    return {
        mazeAmount: getInputIntVal('maze-amount', 1),
        width: getInputIntVal('width', 20),
        height: getInputIntVal('height', 20),
        wallSize: getInputIntVal('wall-size', 10),
        entryType: '',
        bias: '',
        color: '#000000',
        backgroudColor: '#FFFFFF',

        // restrictions
        maxMaze: maxMaze,
        maxCanvas: maxCanvas,
        maxCanvasDimension: maxCanvasDimension,
        maxWallsRemove: maxWallsRemove,

        //printing
        gap: 5,
    }
}

function setupMaze(index) {
    download.setAttribute('download', 'maze.png');
    download.innerHTML = 'download maze';

    const settings = getSettings();

    if (settings['removeWalls'] > maxWallsRemove) {
        settings['removeWalls'] = maxWallsRemove;
        if (removeWallsInput) {
            removeWallsInput.value = maxWallsRemove;
        }
    }

    const entry = document.getElementById('entry');
    if (entry) {
        settings['entryType'] = entry.options[entry.selectedIndex].value;
    }

    const bias = document.getElementById('bias');
    if (bias) {
        settings['bias'] = bias.options[bias.selectedIndex].value;
    }

    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', `maze-${index}`);
    const div = document.getElementById('canvas_div');
    div.appendChild(canvas);

    const maze = new Maze(settings);
    maze.generate();
    maze.draw(canvas.id);

    if (download && download.classList.contains('hide')) {
        download.classList.toggle("hide");
    }

    mazeNodes = {}
    if (maze.matrix.length) {
        mazeNodes = maze;
    }

    location.href = "#";
    location.href = "#generate";
}

function initMaze() {
    const settings = getSettings();
    for (let i = 0; i < settings.mazeAmount; i++) {
        setupMaze(i);
    }
}

function downloadImage(e) {
    const newCanvas = document.createElement('canvas');

    const settings = getSettings();
    const gap = ((settings.gap * 2) + 1) * settings.wallSize;
    newCanvas.width = ((((settings.width * 2) + 1) * settings.wallSize) + gap) * 3;
    newCanvas.height = ((((settings.height * 2) + 1) * settings.wallSize) + gap) * (settings.mazeAmount / 2);

    const newContext = newCanvas.getContext('2d');
    let columnCount = 0;
    let printWidth = 0;
    let printHeight = 0;
    for (let i = 0; i < settings.mazeAmount; i++) {
      const canvas = document.getElementById(`maze-${i}`);
      newContext.drawImage(canvas, printWidth, printHeight);

      columnCount++;
      if (columnCount % 3 === 0) {
        columnCount = 0;
        printWidth = 0;
        printHeight += (gap + canvas.height);
      } else {
        printWidth += (gap + canvas.width);
      }
    }

    const image = newCanvas.toDataURL("image/png");
    image.replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}
