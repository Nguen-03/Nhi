const myCanvas = document.getElementById("Canvas");
const context = myCanvas.getContext("2d");

const pics = ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg"];
pics_length = pics.length;
let images = [];
for (let img of pics) {
    const x = new Image();
    x.src = img;
    images.push(x);
}

let up = false,
    down = false,
    left = false,
    right = false;

document.getElementById("up-button").addEventListener("mousedown", () => {
    if (!down) {
        up = true;
        down = false;
        left = false;
        right = false;
    }
});
document.getElementById("down-button").addEventListener("mousedown", () => {
    if (!up) {
        down = true;
        up = false;
        left = false;
        right = false;
    }
});
document.getElementById("left-button").addEventListener("mousedown", () => {
    if (!right) {
        left = true;
        up = false;
        down = false;
        right = false;
    }
});
document.getElementById("right-button").addEventListener("mousedown", () => {
    if (!left) {
        right = true;
        up = false;
        down = false;
        left = false;
    }
});

const headImg = new Image();
headImg.src = "head.jpg";
const box = 50;
let speed = 50;
let snake = [
    {
        x: Math.floor((Math.random() * (400 - 50)) / 50) * 50,
        y: Math.floor((Math.random() * (550 - 50)) / 50) * 50,
        image: headImg,
    },
];
function randomFood() {
    x = Math.floor((Math.random() * (400 - 50)) / 50) * 50;
    y = Math.floor((Math.random() * (550 - 50)) / 50) * 50;
    return {
        x: x,
        y: y,
        image: images[Math.floor(Math.random() * pics_length)],
    };
}
food = randomFood();
function moveSnake() {
    snake.unshift({ x: snake[0].x, y: snake[0].y, image: snake[0].image });
    for (let i = 0; i < snake.length - 1; ++i) {
        snake[i].image = snake[i + 1].image;
    }

    if (up) snake[0].y -= speed;
    if (down) snake[0].y += speed;
    if (left) snake[0].x -= speed;
    if (right) snake[0].x += speed;

    if (snake[0].x === food.x && snake[0].y === food.y) {
        snake[snake.length - 1].image = food.image;
        food = randomFood();
        for (let i = 0; i < snake.length - 1; ++i) {
            if (food.x === snake[i].x && food.y === snake[i].y)
                food = randomFood();
        }
    } else {
        snake.pop();
    }
}

function colision() {
    let wallColision = false,
        biteSelf = false;
    if (
        snake[0].x >= myCanvas.width ||
        snake[0].x < 0 ||
        snake[0].y >= myCanvas.height ||
        snake[0].y < 0
    )
        wallColision = true;
    for (let i = 1; i < snake.length; ++i) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y)
            biteSelf = true;
    }
    return biteSelf || wallColision;
}

function draw() {
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    context.lineWidth = 3;
    context.fillStyle = "red";
    context.strokeStyle = "red";
    context.strokeRect(food.x, food.y, box, box);

    for (let i = 0; i < snake.length; ++i) {
        // context.fillStyle = i === 0 ? "green" : "lightgreen";
        if (i === 0) {
            context.strokeStyle = "black";
        } else {
            context.strokeStyle = "blue";
        }
        context.strokeRect(snake[i].x, snake[i].y, box, box);
        if (snake[i].image && snake[i].image.complete)
            context.drawImage(
                snake[i].image,
                snake[i].x,
                snake[i].y,
                box - 1,
                box - 1
            );
    }
    if (!(snake[0].x === food.x && snake[0].y === food.y))
        context.drawImage(food.image, food.x, food.y, box - 1, box - 1);
    if (colision()) {
        window.location.assign("end.html");
    }
}

context.fillRect(0, 0, 10, 10);
context.fillStyle = "red";
context.fillRect(0, 0, 10, 10);

let lastTime = 0;
const moveDelay = 300;

function gameLoop(timestamp) {
    if (timestamp - lastTime > moveDelay) {
        moveSnake();
        lastTime = timestamp;
    }
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
// setInterval(draw, 120);
