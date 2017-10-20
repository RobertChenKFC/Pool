const FRICTION_MAG = 0.3, THREASHOLD = 0.1;
const CUE_BALL = 0;
const BALL_SIZE = 20;

class Ball {
	constructor(x, y, id) {
		const WHITE = color(255);
		const YELLOW = color(255, 255, 0);
		const RED = color(255, 0, 0);
		const BLUE = color(0, 0, 255);
		const PURPLE = color(128, 0, 128);
		const ORANGE = color(255, 69, 0);
		const GREEN = color(0, 64, 0);
		const BROWN = color(165, 42, 42);
		const BLACK = color(0);

		this.pos_ = createVector(x, y);
		this.r_ = BALL_SIZE;

		this.vel_ = createVector(0, 0);

		this.id_ = id;
		switch(this.id_) {
			case 0: this.color_ = WHITE; break;
			case 1: case 9: this.color_ = YELLOW; break;
			case 2: case 10: this.color_ = BLUE; break;
			case 3: case 11: this.color_ = RED; break;
			case 4: case 12: this.color_ = PURPLE; break;
			case 5: case 13: this.color_ = ORANGE; break;
			case 6: case 14: this.color_ = GREEN; break;
			case 7: case 15: this.color_ = BROWN; break;
			case 8: this.color_ = BLACK; break;
		}
	}

	draw() {
		noStroke();
		fill(this.color_);
		ellipse(this.pos_.x, this.pos_.y, 2 * this.r_, 2 * this.r_);

		if(this.id_ == CUE_BALL) {
			if(mouseIsPressed &&
				mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
				stroke(0);
				strokeWeight(3);
				line(this.pos_.x, this.pos_.y, mouseX, mouseY); 
			}
		}
		else {
			push();
			translate(this.pos_.x, this.pos_.y);
			rotate(-HALF_PI);

			// Stripes
			if(this.id_ >= 9) {
				noStroke();
				fill(255);
				arc(0, 0, 2 * this.r_, 2 * this.r_, 1 / 6 * PI, 5 / 6 * PI);	
				arc(0, 0, 2 * this.r_, 2 * this.r_, 7 / 6 * PI, 11 / 6 * PI);	
				
				fill(this.color_);
				rectMode(CORNERS);
				rect(cos(1 / 6 * PI) * this.r_, sin(1 / 6 * PI) * this.r_,
					cos(7 / 6 * PI) * this.r_, sin(7 / 6 * PI) * this.r_);
			}

			// Center circle 
			stroke(0);
			strokeWeight(1);
			fill(255);
			ellipse(0, 0, 4 / 5 * this.r_, 4 / 5 * this.r_);

			// Ball number
			fill(0);
			textAlign(CENTER, CENTER);
			text(this.id_, 0, 0);

			pop();
		}
	}

	update() {
		if(this.pos_.x - this.r_ <= 0) {
			this.pos_.x = this.r_;
			this.vel_ = createVector(-this.vel_.x, this.vel_.y);
		}
		else if(this.pos_.x + this.r_ >= width) {
			this.pos_.x = width - this.r_;
			this.vel_ = createVector(-this.vel_.x, this.vel_.y);
		}
		if(this.pos_.y - this.r_ <= 0) {
			this.pos_.y = this.r_;
			this.vel_ = createVector(this.vel_.x, -this.vel_.y);
		}
		else if(this.pos_.y + this.r_ >= height) {
			this.pos_.y = height - this.r_;
			this.vel_ = createVector(this.vel_.x, -this.vel_.y);
		} 

		let acc = this.vel_.copy();
		acc.setMag(FRICTION_MAG);
		this.vel_.sub(acc);
		if(this.vel_.magSq() < THREASHOLD) this.vel_ = createVector();

		this.pos_.add(this.vel_);
	}

	setVel() {
		if(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
			this.vel_ = createVector(this.pos_.x - mouseX, this.pos_.y - mouseY);
			this.vel_.mult(0.3);
		}
	}

	collision(ball) {
		let c = p5.Vector.sub(ball.pos_, this.pos_);
		if(c.mag() <= this.r_ + ball.r_ && (this.vel_.magSq() != 0 || ball.vel_.magSq() != 0)) {
			ball.pos_.add(c.copy().setMag(this.r_ + ball.r_ - c.mag()));

			let v1 = this.vel_, v2 = ball.vel_;
			let v1t = c.copy().setMag(v1.dot(c) / c.mag());
			let v2t = c.copy().setMag(v2.dot(c) / c.mag());
			let v1n = p5.Vector.sub(v1, v1t);
			let v2n = p5.Vector.sub(v2, v2t);

			let newv1 = p5.Vector.add(v2t, v1n);
			let newv2 = p5.Vector.add(v1t, v2n);
			
			this.vel_ = newv1;
			ball.vel_ = newv2;
		}
	}
}
