import {
	Scene,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	WebGLRenderer,
	Vector3,
	Face3,
	DoubleSide,
	Geometry
} from '../three.js-master/build/three.module.js';

import {
	AxisHelper
} from '../three.js-master/src/extras/helpers/AxisHelper.js';

import {
	TrackballControls
} from './vendor/TrackballControls.js';

import {
	OrbitControls
} from './vendor/OrbitControls.js';

// utility function to convert args to strings and then console.log them
const puts = (...any) => console.log(...any.map((item) => {return item.toString()}));
console.log( 'test' );

const scene = new Scene();
const hm = new HeightMap( 4, 0.8 );
const geometry = createGeometryFromHeightMap( hm );
const material = new MeshBasicMaterial( {color: 0x00aa00, side: DoubleSide, wireframe: true} );
const plane = new Mesh( geometry, material );
scene.add( plane );

// add an axis helper and a grid helper
const axisHelper = new AxisHelper( 5 );
scene.add( axisHelper );

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.x = 8.5;
camera.position.y = -5;
// set the camera up value to the z-axis so the orbit controls work properly
camera.up.set(0, 0, 1);

const controls = new OrbitControls( camera );
controls.target = new Vector3( hm.edgeLength / 2, hm.edgeLength / 2, 0 );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.5;
controls.minPolarAngle = Math.PI * 0.05;
controls.maxPolarAngle = Math.PI * 0.45;
controls.addEventListener('change', render)

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function animate() {
	requestAnimationFrame( animate );
	controls.update();
}

function render() {
	renderer.render( scene, camera );
}

function createGeometryFromHeightMap( heightMap ) {
	heightMap.generateTerrain();

	const edgeLength = heightMap.edgeLength;

	const geo = new Geometry();

	for( let y = 0; y < edgeLength; y++ ) {
		for( let x = 0; x < edgeLength; x++ ) {
			geo.vertices.push(new Vector3( x, y, 2 * heightMap.getVal(x,y)));
		}
	}

	// make our faces and convert to a geometry
	// at 0, need to make faces 0, 5, 6 and 0, 6, 1
	// at 1, need to make face 1, 6, 7 and 1, 7, 2
	// so it's v, v+eL, v+eL+1 for all v < el-2
	const faceStartIndices = geo.vertices.slice( 0, edgeLength * -1 );
	for( let idx = 0; idx < faceStartIndices.length; idx++ ) {
		if( (idx % edgeLength ) < ( edgeLength - 1 ) ) {
			geo.faces.push( new Face3( idx, idx + edgeLength, idx + edgeLength + 1 ));
			geo.faces.push( new Face3( idx, idx + edgeLength + 1, idx + 1 ));
		}
	}

	geo.computeFaceNormals();
	geo.computeVertexNormals();

	return geo;
}

animate();
render();
