class HeightMap {
	constructor(exp) {
		this.resolution = Math.pow(2, exp)+1;
		this.map = new Array(this.resolution*this.resolution);
		this.exponent = exp;
		this.last = this.resolution - 1;
		this.maxHeight = 1.0;
		this.minHeight = 0.0;
		this.reset();
	}

	reset() {
		this.map = this.map.fill(this.minHeight);
	}

	getIndex(x,y) {
		return y*this.resolution + x;
	}

	getVal(x,y) {
		return this.map[this.getIndex(x,y)];
	}

	getValSafe(x,y) {
		if( 0 <= x && x <= this.last && 0 <= y && y <= this.last ) {
			return this.getVal(x,y)
		}
		return null;
	}

	setVal(x,y,val) {
		if( 0 <= x && x <= this.last && 0 <= y && y <= this.last ) {
			this.map[this.getIndex(x,y)] = val;
		}
	}

	capMap() {
		this.map = this.map.map( function(val) {
			return Math.min( Math.max( val, this.minHeight ), this.maxHeight ); 
		}.bind(this));
	}

	get edgeLength() {
		return this.resolution;
	}

	toString() {
		let string = '';
		for( let y = 0; y < this.resolution; y++ ) {
			let row = [];
			for( let x = 0; x < this.resolution; x++ ) {
				row.push(this.getVal(x,y).toFixed(1));
			}
			string += row.join(' ');
			string += '\n';
		}
		return string;
	}

	initCorners() {
		this.setVal(0,0,Math.random());
		this.setVal(0,this.last,Math.random());
		this.setVal(this.last,0,Math.random());
		this.setVal(this.last,this.last,Math.random());
	}

	displace( minX, maxX, minY, maxY, jitterMult ) {
		// calculate middle X and Y values
		const midX = this.midpoint(minX, maxX);
		const midY = this.midpoint(minY, maxY);

		// get the values of the 4 corners of our square
		const botL = this.getVal(minX, minY);
		const botR = this.getVal(maxX, minY);
		const topL = this.getVal(minX, maxY);
		const topR = this.getVal(maxX, maxY);

		// calculate the new values on the midpoints of the edges of our square
		const top = this.avg( topL, topR );
		const bot = this.avg( botL, botR );
		const left = this.avg( botL, topL );
		const right = this.avg( botR, topR );

		// set the midpoint values to the midpoint locations
		this.setVal(midX, minY, bot + this.jitter(jitterMult));
		this.setVal(midX, maxY, top + this.jitter(jitterMult));
		this.setVal(minX, midY, left + this.jitter(jitterMult));
		this.setVal(maxX, midY, right + this.jitter(jitterMult));

		// set the center to the average of the midpoint values
		this.setVal(midX, midY, this.avg(top, bot, left, right));
	}

	jitter(multiplier) {
		return ((Math.random() - ((this.maxHeight - this.minHeight) / 2)) * 2) * multiplier;
	}

	midpoint(a,b) {
		return (a+b)/2;
	}

	avg(...vals) {
		return vals.reduce(function(carry, item) { return carry + item; }, 0.0) / vals.length;
	}

	generateTerrain() {
		this.initCorners();
		for(let iter = 0; iter < this.exponent; iter++) {
			let chunks = Math.pow(2, iter);
			let chunkMaxDimension = this.last / chunks;
			for(let x = 0; x < chunks; x++) {
				for(let y = 0; y < chunks; y++) {
					const leftX = x * chunkMaxDimension;
					const rightX = leftX + chunkMaxDimension;
					const bottomY = y * chunkMaxDimension;
					const topY = bottomY + chunkMaxDimension;
					this.displace(leftX, rightX, bottomY, topY, 0.0)
				}
			}
		}
		this.capMap();
	}
}
