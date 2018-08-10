var container, stats;
var camera, scene, renderer, light1, light2, plight;
var obj;
var frustumSize = 1.5;
var color_time = Date.now();
var camera_time = color_time;
var bg_time = color_time;
var pl_time = color_time;
var coefficient = 0.001;
var ambientLight;
var num_color_changes = 0;
var num_directional_changes = 0;

init();
animate();

function init() {

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
	camera = new THREE.PerspectiveCamera(4, aspect, 0.1, 50);
	camera.position.y = 0;
	camera.position.x = 0;
	camera.position.z = 20;
	camera.lookAt(scene.position);
	camera.updateMatrixWorld();

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


	// Ambient Light
	ambientLight = new THREE.AmbientLight( 0x000000 );
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

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth-20, window.innerHeight-20);
	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth-20, window.innerHeight-20 );

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	var timer = Date.now();

	plight.position.z = 10 - ((timer-pl_time)*0.06);

	if ((timer - color_time) > 100) {
		light1.color.setHex( Math.random() * 0xffffff );
		light1.position.x = Math.random() - 0.5;
		light1.position.y = -1
		light1.position.z = Math.random() - 0.5;

		light2.color.setHex( Math.random() * 0xffffff );
		light2.position.x = Math.random() - 0.5;
		light2.position.y = -1
		light2.position.z = Math.random() - 0.5;

		color_time = Date.now();

		if (num_directional_changes == 2) {
			pl_time = Date.now();
			num_directional_changes = 0;
			console.log(plight.position.z);
		}
		else {
			num_directional_changes = num_directional_changes + 1;
		}
	}
	if ((timer - bg_time) > 1000) {
		var random_color = Math.random() * 0xffffff
		scene.background = new THREE.Color( random_color );
		ambientLight.color.setHex( random_color - 0x303030 );

		if (num_color_changes == 8) {
			camera.position.x = (Math.random()-0.5) * 50;
			camera.position.y = (Math.random()-0.5) * 50;
			camera.position.z = (Math.random()-0.5) * 50;

			num_color_changes = 0;
		}
		else {
			num_color_changes = num_color_changes + 1;
		}

		bg_time = Date.now();
	}

	if (obj != null) {
		// obj.rotateOnWorldAxis( new THREE.Vector3(0,1,0), Math.PI * -0.01);
		obj.position.y = camera.position.y = (Math.sin( 0.05 * timer ) * 0.005) - 0.5;
	}

	camera.lookAt( new THREE.Vector3(0,-0.25,0) );
	renderer.render( scene, camera );

}