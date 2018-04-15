
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container = document.getElementById( 'container' );

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor( 0x111111, 1 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 100000 );
camera.position.set( 0, 0, 1.1 );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.3;

var scene = new THREE.Scene();

// ------------------------------------------------------------

// lights

var aLight = new THREE.AmbientLight( 0x777777 );
scene.add( aLight );

var dLight1 = new THREE.DirectionalLight( 0xffffff, 0.8 );
dLight1.position.set( 0.4, 0, 1 );
scene.add( dLight1 );

var dLight2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
dLight2.position.set( -0.4, 0, -1 );
scene.add( dLight2 );

// var dlh1 = new THREE.DirectionalLightHelper( dLight1, 0.5 );
// scene.add( dlh1 );

// var dlh2 = new THREE.DirectionalLightHelper( dLight2, 0.5 );
// scene.add( dlh2 );

// ------------------------------------------------------------

$('.color').tooltip();

// ------------------------------------------------------------

var fbxLoader = new THREE.FBXLoader();

fbxLoader.load('models/nano6.fbx', function(fbx){
	var nano6 = fbx.children[0];

	var bodyTop = nano6.getObjectByName('bodyTop');
	var tracerTop = nano6.getObjectByName('tracerTop');
	var tracerBottom = nano6.getObjectByName('tracerBottom');
	var bodyBottom = nano6.getObjectByName('bodyBottom');

	var colorChange = function(part){
		return function(e) {
			e.preventDefault();

			$(this).parent().parent().find('.color.selected').removeClass('selected');
			$(this).addClass('selected');

			var color = $(this).css('background-color');
			part.material.color.setStyle( color );

			var rgba = color.match(/[.?\d]+/g);
			var alpha = rgba[3];

			if ( alpha && alpha < 1 ) {
				part.material.transparent = true;
				part.material.opacity = 0.5;
			} else {
				part.material.transparent = false;
				part.material.opacity = 1;
			}
		}
	};

	$('#top-color .color').click( colorChange(bodyTop) );
	$('#tracer-top-color .color').click( colorChange(tracerTop) );
	$('#bottom-color .color').click( colorChange(bodyBottom) );
	$('#tracer-bottom-color .color').click( colorChange(tracerBottom) );

	scene.add( nano6 );
});

// ------------------------------------------------------------

window.addEventListener( 'resize', resize, false );

function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

loop();

function loop() {
	requestAnimationFrame( loop );
	// TWEEN.update();
	controls.update();
	renderer.render( scene, camera );
}