let table;

function setup() {
	createCanvas(800, 400);

	table = new Table();
}

function draw() {
	table.draw();
	table.update();
}

function mouseReleased() {
	table.setCueBallVel();
}
