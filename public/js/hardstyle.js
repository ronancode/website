var container, composer;
var camera, scene, renderer, controls;
var light1, light2;
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
var svg_url = 'http://ronanrice.com/model/hardstyle-face.svg'

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

	var aspect = (window.innerWidth-20) / (window.innerHeight-20);
	camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
	camera.position.set( 0, 0, 200 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x101010 );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
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

	// Orbit Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = true;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 5.0;
	console.log("autoRotateSpeed=" + controls.autoRotateSpeed)

	window.addEventListener( 'resize', onWindowResize, false );

	loadSVG( svg_url );

	addLights();

}

function loadSVG( url ) {

	var loader = new THREE.SVGLoader();

	loader.load( url, function ( data ) {

		var paths = data.paths;

		var group = new THREE.Group();
		group.scale.multiplyScalar( 0.25 );
		group.position.x = - 125;
		group.position.y = 125;
		group.scale.y *= - 1;

		for ( var i = 0; i < paths.length; i ++ ) {

			var path = paths[ i ];

			var fillColor = path.userData.style.fill;

			if ( fillColor !== undefined && fillColor !== 'none' ) {

				var material = new THREE.MeshPhongMaterial( {
					color: new THREE.Color().setStyle( "#FFFFFF" ),
					specular: 0xFFFFFF,
					shininess: 200,
					flatShading: true,
					side: THREE.DoubleSide,
					depthWrite: false
				} );

				var shapes = path.toShapes( true );

				for ( var j = 0; j < shapes.length; j ++ ) {

					var shape = shapes[ j ];

					var geometry = new THREE.ShapeBufferGeometry( shape );
					var mesh = new THREE.Mesh( geometry, material );

					group.add( mesh );

				}

			}

			var strokeColor = path.userData.style.stroke;

			if ( strokeColor !== undefined && strokeColor !== 'none' ) {

				var material = new THREE.MeshPhongMaterial( {
					color: new THREE.Color().setStyle( "#FFFFFF" ),
					specular: 0xFFFFFF,
					shininess: 200,
					flatShading: true,
					side: THREE.DoubleSide,
					depthWrite: false
				} );

				for ( var j = 0, jl = path.subPaths.length; j < jl; j ++ ) {

					var subPath = path.subPaths[ j ];

					var geometry = THREE.SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );

					if ( geometry ) {

						var mesh = new THREE.Mesh( geometry, material );

						group.add( mesh );

					}

				}

			}

		}

		scene.add( group );

	} );

}

function addLights() {
	// Ambient Light
	ambientLight = new THREE.AmbientLight( 0x101010 );
	scene.add( ambientLight );

	// Directional Lights
	light1 = new THREE.DirectionalLight( 0xFA6900 );
	light1.position.x = 0;
	light1.position.y = 0;
	light1.position.z = 1;
	light1.position.normalize();
	scene.add( light1 );

	light2 = new THREE.DirectionalLight( 0x69D2E7 );
	light2.position.x = 0;
	light2.position.y = 0;
	light2.position.z = -1;
	light2.position.normalize();
	scene.add( light2 );
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

	if ((timer - color_time) > 100) {
		light1.color.setHex( Math.random() * 0xffffff );

		light2.color.setHex( Math.random() * 0xffffff );

		color_time = Date.now();
	}
	if ((timer - bg_time) > 1000) {
		var random_color = Math.random() * 0x222222;
		scene.background = new THREE.Color( random_color );

		bg_time = Date.now();
	}

	// camera.lookAt( new THREE.Vector3(0,-0.5,0) );
	camera.lookAt( scene.position );

	// renderer.render( scene, camera );
	composer.render();

}