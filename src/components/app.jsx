import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import HeightmapGeom from './heightmap.jsx';

const OrbitControls = require('three-orbit-controls')(THREE);

export default class AppComponent extends React.Component {
	constructor(props) {
		super(props);

		this.cameraPosition = new THREE.Vector3(8.5, -5, 5);
		this.state = {
		}

		this._onAnimate = this._onAnimate.bind(this);
	}

	componentDidMount() {
		const controls = new OrbitControls(this.refs.camera);
		controls.target = new THREE.Vector3( 4.5, 4.5, 0 );
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.rotateSpeed = 0.5;
		controls.minPolarAngle = Math.PI * 0.05;
		controls.maxPolarAngle = Math.PI * 0.45;
		this.controls = controls;
	}

	componentWillUnmount() {
		this.controls.dispose();
		delete this.controls;
	}

	_onAnimate() {
		//this.controls.update();
	}

	render() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		return (
			<React3 mainCamera="camera" width={width} height={height} onAnimate={this._onAnimate}>
				<scene>
					<perspectiveCamera
						name="camera"
						fov={75}
						aspect={width / height}
						near={0.1}
						far={1000}
						position={this.cameraPosition}
						ref="camera"
						up={new THREE.Vector3(0,0,1)}
					/>
					<mesh>
						<HeightmapGeom exponent={3} jitter={0.5} />
						<meshBasicMaterial color={0x00aa00} side={THREE.DoubleSide} wireframe={true} />
					</mesh>
					<axisHelper size={5} />
				</scene>
			</React3>
		);
	}
}
