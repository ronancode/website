var container, stats;
var camera, scene, renderer, light1, light2;
var frustumSize = 1.5;
var color_time = Date.now();
var camera_time = color_time;
var bg_time = color_time;
var coefficient = 0.001;
var ambientLight;

init();
animate();

function init() {

	// container = document.createElement( 'div' );
	// document.body.appendChild( container );

	// var info = document.createElement( 'div' );
	// info.style.position = 'absolute';
	// info.style.top = '10px';
	// info.style.width = '100%';
	// info.style.textAlign = 'center';
	// info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - orthographic view';
	// container.appendChild( info );

	// container = document.getElementById('three');
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	document.body.style.backgroundColor = "rgba(16,16,16,1)";
	container.style.position = 'fixed';
	container.style.left = '10px';
	container.style.top = '10px';
	container.style.zIndex = '-1';

	var aspect = (window.innerWidth-20) / (window.innerHeight-20);
	// camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0, 30 );
	camera = new THREE.OrthographicCamera( aspect / - 2, aspect / 2, 1 / 2, 1 / - 2, 0, 30 );
	camera.position.y = 0.5;
	camera.position.x = 0;
	camera.position.z = 2;

	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0xf0f0f0 );
	scene.background = new THREE.Color( 0x101010 );

	// Grid

	// var gridHelper = new THREE.GridHelper( 2, 10 );
	// scene.add( gridHelper );

	// Cubes

	// var geometry = new THREE.BoxGeometry( 50, 50, 50 );
	// var material = new THREE.MeshLambertMaterial( { color: 0xffffff, overdraw: 0.5 } );

	// for ( var i = 0; i < 100; i ++ ) {

	// 	var cube = new THREE.Mesh( geometry, material );

	// 	cube.scale.y = Math.floor( Math.random() * 2 + 1 );

	// 	cube.position.x = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25;
	// 	cube.position.y = ( cube.scale.y * 50 ) / 2;
	// 	cube.position.z = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25;

	// 	scene.add( cube );

	// }

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

	// var material = new THREE.MeshLambertMaterial( { color: 0xffffff, overdraw: 0.5, opacity: 1, transparent: false } );
	var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0xFFFFFF, shininess: 200, overdraw: 0.5 } );
	// material.ambient.setHex(0xffffff);

	var loader = new THREE.OBJLoader( manager );
	loader.load( 'http://ronanrice.com/model/blue_falcon.obj', function( object ){
		// console.log(object);
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material = material;
				// child.material.color.setHex( Math.random() * 0xffffff );
				// child.material.wireframe = true;
				// child.material.color = new THREE.Color(0xFFFFFF);
			}
		});
        // object.position.y = -0.2;
        // object.position.x = 0;
        // object.position.z = -0.3;
        object.position.y = 0.07;
        object.position.x = 0;
        object.position.z = 0;
		scene.add( object );
	},onProgress,onError);

	// Lights

	// var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
	ambientLight = new THREE.AmbientLight( 0x000000 );
	scene.add( ambientLight );

	light1 = new THREE.DirectionalLight( 0xFA6900 );
	light1.position.x = Math.random() - 0.5;
	light1.position.y = Math.random() - 0.5;
	light1.position.z = Math.random() - 0.5;
	// light1.position.x = 1;
	// light1.position.y = 0;
	// light1.position.z = 1;
	light1.position.normalize();
	scene.add( light1 );

	// var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	light2 = new THREE.DirectionalLight( 0x69D2E7 );
	light2.position.x = Math.random() - 0.5;
	light2.position.y = Math.random() - 0.5;
	light2.position.z = Math.random() - 0.5;
	// light2.position.x = -1;
	// light2.position.y = 0;
	// light2.position.z = 1;
	light2.position.normalize();
	scene.add( light2 );

	renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
	container.appendChild( renderer.domElement );

	// stats = new Stats();
	// container.appendChild( stats.dom );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	var aspect = window.innerWidth / window.innerHeight;

	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth-20, window.innerHeight-20 );

}

//

function animate() {

	requestAnimationFrame( animate );

	// stats.begin();
	render();
	// stats.end();

}

function render() {

	var timer = Date.now();

	// camera.position.x = Math.sin( 0.001 * timer ) * 2;
	// camera.position.y = Math.sin( 0.001 * timer ) * 2;
	// camera.position.z = Math.cos( 0.001 * timer ) * 2;
	// camera.position.x = 2* Math.sin( 0.001 * timer ) * Math.cos( 0.001 * timer );
	// camera.position.y = 2* Math.sin( 0.001 * timer ) * Math.sin( 0.001 * timer );
	// camera.position.z = 2 * Math.cos( 0.001 * timer );
	// camera.position.x = 0;
	// camera.position.z = 1000;
	// coefficient = coefficient + ((Math.random() - 0.5) * 0.000001);
	// console.log( coefficient );
	// var random = (Math.random() - 0.5) *0.00001;
	// camera.position.x = Math.cos( timer ) * 1000;
	// camera.position.y = Math.cos( 0.0005 * timer ) * 1000;
	// camera.position.z = Math.sin( 0.0003 * timer ) * 1000;
	// camera.lookAt( scene.position );
	object.position.y = 1;

	if ((timer - color_time) > 200) {
		light1.color.setHex( Math.random() * 0xffffff );
		light1.position.x = Math.random() - 0.5;
		light1.position.y = Math.random() - 0.5;
		light1.position.z = Math.random() - 0.5;

		light2.color.setHex( Math.random() * 0xffffff );
		light2.position.x = Math.random() - 0.5;
		light2.position.y = Math.random() - 0.5;
		light2.position.z = Math.random() - 0.5;

		color_time = Date.now();
	}
	if ((timer - camera_time) > 1000) {
		camera.position.x = (Math.random()-0.5) * 4;
		camera.position.y = (Math.random()-0.5) * 4;
		camera.position.z = (Math.random()-0.5) * 4;

		camera_time = Date.now();
	}
	if ((timer - bg_time) > 2000) {
		var random_color = Math.random() * 0xffffff
		scene.background = new THREE.Color( random_color );
		ambientLight.color.setHex( random_color - 0x303030 );

		bg_time = Date.now();
	}

	camera.lookAt( new THREE.Vector3(0,0.25,0) );

	// else if ((timer - init_time) > 100) {
	// 	light1.color.setHex( 0x000000 );
	// 	light2.color.setHex( 0x000000 );
	// }

	// object.position.x = Math.sin( timer * 0.0007 );

	// light3.position.x = Math.sin( time * 0.7 ) * 30;
	// light3.position.y = Math.cos( time * 0.3 ) * 40;
	// light3.position.z = Math.sin( time * 0.5 ) * 30;

	renderer.render( scene, camera );

}