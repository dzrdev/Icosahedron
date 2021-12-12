function degToRad(degree) {
    return degree * Math.PI / 180;
}

class Model {
    constructor(x, y, scale, rotateX, rotateY) {
        this.x = x
        this.y = y
        this.scale = scale
        this.rotateX = degToRad(rotateX)
        this.rotateY = degToRad(rotateY)
        this.line = []
    }
    addLine(angle, r, y, angle2, r2, y2) {
        this.line.push({
            angle: degToRad(angle),
            r: r,
            y: y,
            angle2: degToRad(angle2),
            r2: r2,
            y2: y2
        });
    }
    render(ctx, canvas) {
        for (const object of this.line) {
            ctx.moveTo(
                Math.sin(this.rotateX + object.angle) * object.r * this.scale + canvas.width / 2 + this.x,
                (Math.cos(- this.rotateY) * object.y + Math.cos(this.rotateX + object.angle) * Math.sin(- this.rotateY) * object.r) * - this.scale + canvas.height / 2 - this.y
            );
            ctx.lineTo(
                Math.sin(this.rotateX + object.angle2) * object.r2 * this.scale + canvas.width / 2 + this.x,
                (Math.cos(- this.rotateY) * object.y2 + Math.cos(this.rotateX + object.angle2) * Math.sin(- this.rotateY) * object.r2) * - this.scale + canvas.height / 2 - this.y
            );
            //let z = Math.cos(this.rotateY) * Math.cos(this.rotateX + object.angle) * -object.r;
        }
    }
}

const icosahedron = new Model(0, 100, 0, 0, -11);
const reflection = new Model(0, -250, 0, 0, 0);

const side = 170;
const radius = side / 2 / Math.cos(degToRad(54));
const height = Math.sqrt(Math.pow(radius * (1 - Math.cos(degToRad(36))), 2) + Math.pow(Math.cos(degToRad(30)) * side, 2)) / 2;
const topSide = Math.sqrt(Math.pow(side, 2) - Math.pow(radius, 2)) + height;

function form(model) {
    for (let i = 0; i < 360; i += 72) {
        model.addLine(0, 0, topSide, i, radius, height);
        model.addLine(i, radius, height, i + 72, radius, height);
        model.addLine(0, 0, -topSide, i + 36, radius, -height);
        model.addLine(i + 36, radius, -height, i + 108, radius, -height);
        model.addLine(i, radius, height, i + 36, radius, -height);
        model.addLine(i, radius, height, i - 36, radius, -height);
    }
}

form(icosahedron);

for (const object of icosahedron.line) {
    reflection.line.push({
        angle: object.angle,
        r: object.r,
        y: -object.y,
        angle2: object.angle2,
        r2: object.r2,
        y2: -object.y2
    });
}

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let dx = 0, dy = 0;
let key = {
    left: false, right: false, up: false, down: false
};

window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft': key.left = true; break;
        case 'ArrowRight': key.right = true; break;
        case 'ArrowUp': key.up = true; break;
        case 'ArrowDown': key.down = true; break;
    }
});

window.addEventListener('keyup', event => {
    switch (event.key) {
        case 'ArrowLeft': key.left = false; break;
        case 'ArrowRight': key.right = false; break;
        case 'ArrowUp': key.up = false; break;
        case 'ArrowDown': key.down = false; break;
    }
});

let smooth = 0;
let grd = ctx.createLinearGradient(0, canvas.height, 0, 0);
grd.addColorStop(0, 'black');
grd.addColorStop(0.2, '#00000000');

setInterval(() => {
    canvas.width = window.innerWidth;
    ctx.lineWidth = 2;

    if (key.left) dx += 0.1;
    if (key.right) dx -= 0.1;
    if (key.up) dy += 0.1;
    if (key.down) dy -= 0.1;

    icosahedron.rotateX += degToRad(dx + (1 - smooth) * 72 / 5), icosahedron.rotateY += degToRad(dy);
    dx *= 0.95, dy *= 0.95;

    smooth += (1 - smooth) / 50;
    icosahedron.scale = smooth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    ctx.strokeStyle = 'white';
    ctx.filter = 'none';
    icosahedron.render(ctx, canvas);

    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();

    ctx.strokeStyle = '#606060';
    ctx.filter = 'blur(4px)';
    reflection.rotateX = icosahedron.rotateX;
    reflection.rotateY = -icosahedron.rotateY;
    reflection.scale = icosahedron.scale;
    reflection.render(ctx, canvas);
    
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 10);
