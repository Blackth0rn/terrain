import Heightmap from '../classes/heightmap.js'
import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

export default class HeightmapGeom extends React.Component {
	constructor(props) {
		super(props);

		this.hm = new Heightmap(this.props.exponent, this.props.jitter);
		this.hm.generateTerrain();
		this.vertices = [];
		this.faces = [];

		for(let y = 0; y < this.hm.edgeLength; y++) {
			for(let x = 0; x < this.hm.edgeLength; x++) {
				this.vertices.push(new THREE.Vector3(x, y, this.hm.getVal(x,y)));
			}
		}

		const faceStartIndices = this.vertices.slice(0, this.hm.edgeLength * -1);
		for(let idx = 0; idx < faceStartIndices.length; idx++) {
			if((idx % this.hm.edgeLength) < (this.hm.edgeLength - 1)) {
				this.faces.push( new THREE.Face3(idx, idx + this.hm.edgeLength, idx + this.hm.edgeLength + 1));
				this.faces.push( new THREE.Face3(idx, idx + this.hm.edgeLength + 1, idx + 1));
			}
		}
		console.log( this.vertices, this.hm );
	}

	render() {
		return <geometry vertices={this.vertices} faces={this.faces} />
	}
}
