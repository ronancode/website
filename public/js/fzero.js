var container, composer;
var camera, scene, renderer, controls;
var light1, light2, plight;
var obj;
var color_time = Date.now();
var camera_time = color_time;
var bg_time = color_time;
var pl_time = color_time;
var ambientLight;
var num_color_changes = 0;
var num_directional_changes = 0;
var params = {
	projection: 'normal',
	background: false,
	exposure: 0.76,
	bloomStrength: 1,
	bloomThreshold: 0.19,
	bloomRadius: 0.69
};

init();
animate();

function init() {

	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	document.body.style.backgroundColor = "rgba(16,16,16,1)";
	container.style.position = 'fixed';
	container.style.left = '10px';
	container.style.top = '10px';
	container.style.zIndex = '-1';

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x101010 );

	var aspect = (window.innerWidth-20) / (window.innerHeight-20);
	camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 50);
	camera.position.set( 0, 2, 0 );

	// Add Floor
	var floorgeometry = new THREE.PlaneGeometry( 3, 30 );
	var floormaterial = new THREE.MeshBasicMaterial( { color: 0x101010 } );
	var floormesh = new THREE.Mesh( floorgeometry, floormaterial );
	floormesh.position.y = -0.6;
	floormesh.position.x = 0;
	floormesh.position.z = 0;
	floormesh.rotation.x = -Math.PI / 2;
	floormesh.receiveShadow = true;
	scene.add( floormesh );

	// Blue Falcon
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};

	var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0xFFFFFF, shininess: 200, flatShading: true } );

	var loader = new THREE.OBJLoader( manager );
	loader.load( 'ronanrice.com/model/blue_falcon.obj', function( object ){
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material = material;
			}
		});
        object.position.y = 0;
        object.position.x = 0;
        object.position.z = 0;
        obj = object;
		scene.add( obj );
	},onProgress,onError);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth-20, window.innerHeight-20);
	renderer.toneMapping = THREE.LinearToneMapping;
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);

	renderScene = new THREE.RenderPass( scene, camera );

	effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

	bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 ); //1.0, 9, 0.5, 512);
	bloomPass.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );
	composer.setSize( window.innerWidth, window.innerHeight );
	composer.addPass( renderScene );
	composer.addPass( effectFXAA );
	composer.addPass( bloomPass );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;

	// var gui = new dat.GUI();

	// gui.add( params, 'exposure', 0.1, 2 );

	// gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

	// 	bloomPass.threshold = Number( value );

	// } );

	// gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

	// 	bloomPass.strength = Number( value );

	// } );

	// gui.add( params, 'bloomRadius', 0.0, 1.0 ).onChange( function ( value ) {

	// 	bloomPass.radius = Number( value );

	// } );

	// gui.open();

	// Ambient Light
	ambientLight = new THREE.AmbientLight( 0x101010 );
	scene.add( ambientLight );

	// Directional Lights
	light1 = new THREE.DirectionalLight( 0xFA6900 );
	light1.position.x = Math.random() - 0.5;
	light1.position.y = Math.random() - 0.5;
	light1.position.z = Math.random() - 0.5;
	light1.position.normalize();
	scene.add( light1 );

	light2 = new THREE.DirectionalLight( 0x69D2E7 );
	light2.position.x = Math.random() - 0.5;
	light2.position.y = Math.random() - 0.5;
	light2.position.z = Math.random() - 0.5;
	light2.position.normalize();
	scene.add( light2 );

	// Pointlight
	plight = new THREE.PointLight( 0xffffff, 1, 10, 2 );
	plight.position.set(0,1,10);
	scene.add( plight );

	// Orbit Controls
	controls = new THREE.OrbitControls( camera );
	controls.autoRotate = true;

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
	composer.setSize( window.innerWidth-20, window.innerHeight-20 );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
}

//

function animate() {

	requestAnimationFrame( animate );
	controls.update();
	render();

}

function render() {

	renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );

	var timer = Date.now();

	plight.position.z = 10 - ((timer-pl_time)*0.06);

	if ((timer - color_time) > 100) {
		light1.color.setHex( Math.random() * 0xffffff );
		light1.position.x = Math.random() - 0.5;
		light1.position.y = -0.4;
		light1.position.z = Math.random() - 0.5;

		light2.color.setHex( Math.random() * 0xffffff );
		light2.position.x = Math.random() - 0.5;
		light2.position.y = -0.4;
		light2.position.z = Math.random() - 0.5;

		color_time = Date.now();

		if (num_directional_changes == 2) {
			pl_time = Date.now();
			num_directional_changes = 0;
		}
		else {
			num_directional_changes = num_directional_changes + 1;
		}
	}
	if ((timer - bg_time) > 1000) {
		var random_color = Math.random() * 0xffffff;
		scene.background = new THREE.Color( random_color );
		// ambientLight.color.setHex( random_color - 0x303030 );

		if (num_color_changes == 4) {
			camera.position.x = (Math.random()-0.5) * 3;
			camera.position.y = (Math.random()-0.3) * 3;
			camera.position.z = (Math.random()-0.5) * 3;

			num_color_changes = 0;
		}
		else {
			num_color_changes = num_color_changes + 1;
		}

		bg_time = Date.now();
	}

	if (obj != null) {
		// obj.rotateOnWorldAxis( new THREE.Vector3(0,1,0), Math.PI * -0.001);
		obj.position.y = (Math.sin( 0.1 * timer ) * 0.005) - 0.5;
	}

	camera.lookAt( new THREE.Vector3(0,-0.5,0) );
	// camera.lookAt( scene.position );

	composer.render();

}