// utility function to convert args to strings and then console.log them
const puts = (...any) => console.log(...any.map((item) => {return item.toString()}));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
const controls = new THREE.TrackballControls( camera );
controls.rotateSPeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panspeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener('change', render);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry( 1,1,5,5);
const material = new THREE.MeshBasicMaterial( {color: 0x00aa00, side: THREE.DoubleSide, wireframe: true} );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );


function animate() {
	requestAnimationFrame( animate );
	controls.update();
}
function render() {
	renderer.render( scene, camera );
}
render();
animate();
