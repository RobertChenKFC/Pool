const NUM_BALLS = 16;
const POS_TABLE = [ 0, 1, 3, 10, 13, 8, 6, 2, 15, 4, 9, 7, 12, 5, 11, 14];
class Table {
	constructor() {
		this.balls_ = [];

		let midX = width / 4, midY = height / 2;
		this.balls_[0] = new Ball(midX, midY, CUE_BALL);

		let i = 1;
		midX = width / 4 * 3;
		midY = height / 2;
		let dX = BALL_SIZE * 2, dY = BALL_SIZE * 2;
		for(let cntCap = 1, x = midX - 2 * dX; cntCap <= 5; cntCap++, x += dX) {
			for(let cnt = 0, y = midY - cntCap / 2 * dY; cnt < cntCap; cnt++, y += dY)
				this.balls_[i] = new Ball(x, y, POS_TABLE[i++]);
		}
	}

	draw() {
		const BACKGROUND_COLOR = color(0, 102, 0);
		background(BACKGROUND_COLOR);
		this.balls_.forEach(function(ball){
			ball.draw();
		});
	}

	update() {
		for(let i = 0; i < NUM_BALLS; i++) {
			for(let j = i + 1; j < NUM_BALLS; j++)
				this.balls_[i].collision(this.balls_[j]);
		}

		this.balls_.forEach(function(ball){
			ball.update();
		});
	}

	setCueBallVel() {
		this.balls_[0].setVel();
	}
}
