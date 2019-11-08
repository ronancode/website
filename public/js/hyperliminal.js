var k;
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
var random_color;
var space_counter = 0;
var prevent_multipress = false;
var r,g,b,r_burst,g_burst,b_burst;
var burst_start = false;
var tempo = 172;
var tempo_times = null;
var whole_note = ((60/tempo)*1000);
var half_note = whole_note/2;
var quarter_note = whole_note/4;
var eighth_note = whole_note/8;
var sixteenth_note = whole_note/16;
var bar_note = whole_note * 4;
var song_init = 0;

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

	// Set up key detector
	k = new Kibo();

	// Set up scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x101010 );

	var aspect = (window.innerWidth-20) / (window.innerHeight-20);
	camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 50);
	camera.position.set( 0, 5, 0 );

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
	loader.load( 'http://ronanrice.com/model/blue_falcon.obj', function( object ){
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
	light1 = new THREE.DirectionalLight( 0x000000 );
	light1.position.x = Math.random() - 0.5;
	light1.position.y = Math.random() - 0.5;
	light1.position.z = Math.random() - 0.5;
	light1.position.normalize();
	scene.add( light1 );

	light2 = new THREE.DirectionalLight( 0x000000 );
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

	// Initialize Tempo
	tempo_times = compute_notes(100,120);

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
	composer.setSize( window.innerWidth-20, window.innerHeight-20 );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );
	controls.update();
	render();

}

function compute_notes( timer, song_init ) {

	bar_time = song_init + (bar_note * Math.ceil((timer - song_init) / bar_note));
	whole_time = song_init + (whole_note * Math.ceil((timer - song_init) / whole_note));
	half_time = song_init + (half_note * Math.ceil((timer - song_init) / half_note));
	return {
		bar: bar_time,
		whole: whole_time,
		half: half_time,
	};
	
}

function pulseBackground( bar_note_time, timer ) {

	if (timer - bar_note_time >= 0) {
		r = Math.random() * 229;
		g = Math.random() * 229;
		b = Math.random() * 229;
		burst_start = true;
	}
	pulseWidth = 300;
	timeDelta = bar_note_time-timer;
	ceiling = (pulseWidth / 2) / (Math.PI / 2);
	intensity = 0.3;
	if (timeDelta < pulseWidth){
		r_burst = parseInt(Math.sin(timeDelta/ceiling) * r * intensity) + 16;
		g_burst = parseInt(Math.sin(timeDelta/ceiling) * g * intensity) + 16;
		b_burst = parseInt(Math.sin(timeDelta/ceiling) * b * intensity) + 16;
	}
	new_color = "rgb(" + r_burst + "," + g_burst + "," + b_burst + ")";
	if (burst_start){
		scene.background = new THREE.Color( new_color );		
	}

}

function render() {

	// No idea, maybe bloom shader
	renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );

	// Timer
	var timer = Date.now();

	// Overhead moving light
	if (space_counter == 0) {
		plight.position.z = -10 + ((tempo_times.whole-timer)*0.06);
	}
	if (space_counter > 0) {
		plight.position.z = -10 + ((tempo_times.half-timer)*0.12);
	}


	// if ((timer - bg_time) > ){
	// 	bg_time = timer;
	// }
	
	// Keydown Handler
	k.down('p',function(){
		if (prevent_multipress == false){
			space_counter = space_counter + 1;
			position_change = true;
			prevent_multipress = true;
		}
	}).up('p',function(){
		prevent_multipress = false;
	});

	k.down('c',function(){
		if (prevent_multipress == false){
			console.log(camera.position.x,camera.position.y,camera.position.z);
			prevent_multipress = true;
		}
	}).up('c',function(){
		prevent_multipress = false;
	});	

	// Init State
	// if (space_counter == 0) {
	// 	if (position_change = true) {
	// 		camera.position.x = 0;
	// 		camera.position.y = 5;
	// 		camera.position.z = 0;
	// 		position_change = false;
	// 	}
	// }

	// Init
	if (space_counter < 2) {
		pulseBackground(tempo_times.bar,timer);
	}

	// First P press
	if (space_counter == 1) {
		if (position_change == true) {
			camera.position.x = 0;
			camera.position.y = 1.5;
			camera.position.z = 0;
			position_change = false;
		}
	}
	if (space_counter > 0) {
		if (timer > tempo_times.half) {
			light1.color.setHex( Math.random() * 0xffffff );
			light1.position.x = Math.random() - 0.5;
			light1.position.y = -0.4;
			light1.position.z = Math.random() - 0.5;

			light2.color.setHex( Math.random() * 0xffffff );
			light2.position.x = Math.random() - 0.5;
			light2.position.y = -0.4;
			light2.position.z = Math.random() - 0.5;
		}
	}

	// Second P Press
	if (space_counter == 2) {
		if (position_change == true) {
			camera.position.x = 0.75;
			camera.position.y = 0.4;
			camera.position.z = 1.3;
			position_change = false;
		}
	}
	if (space_counter > 1) {
		if (timer > tempo_times.whole) {
			var random_color = Math.random() * 0xffffff;
			scene.background = new THREE.Color( random_color );
		}
	}

	// Third P Press
	if (space_counter == 3) {
		if (position_change == true) {
			camera.position.x = 0;
			camera.position.y = 10;
			camera.position.z = 0;
			position_change = false;
		}
	}

	// Fourth P Press
	if (space_counter == 4) {
		if (position_change == true) {
			camera.position.x = -0.65;
			camera.position.y = 0;
			camera.position.z = -1.18;
			position_change = false;
		}
	}

	// Create rumble movement
	if (obj != null) {
		obj.position.y = (Math.sin( 0.1 * timer ) * 0.005) - 0.5;
		if (song_init == 0){
			song_init = Date.now()
		}
	}

	// Event calculator
	tempo_times = compute_notes(timer,song_init);

	camera.lookAt( new THREE.Vector3(0,-0.5,0) );

	composer.render();

}