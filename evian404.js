/*
Progressive:
f9157c
33007d
Trance:
c1b3c0
ff3900
*/

var renderer, scene, camera;
var renderSize = new THREE.Vector2(0.0, 0.0);
var container = document.getElementById("container");
var PATH = './assets/textures/';
var time = 0.0;
var mouse = new THREE.Vector2(0.0, 0.0);
var loader = new THREE.TextureLoader();
var delta = 0.0;
var max = 10000;
var min = -10000;
var distance = 10;
var HEIGHT = 3024;
var WIDTH = 4032;
var raycaster = new THREE.Raycaster();
var images = [	
	"IMG_5228.jpg",
	"IMG_5248.jpg",
	"IMG_5257.jpg",
	"IMG_5272.jpg",
	"IMG_5301.jpg",
	"IMG_5354.jpg",
	"IMG_5384.jpg",
	"IMG_5411.jpg"]
var textures = [
]
var audio = document.getElementById("mix");

var meshPlanes = [];
for(var i = 0; i < images.length; i++){
	textures[i] = loader.load(PATH + images[i]);
}
var textTexture	= loader.load(PATH + "text.png");

init();

function init(){
	setRenderSize();
	// max = renderSize.x*((HEIGHT)/WIDTH) - renderSize.x/2;
	renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true,
		// antialias: true,
		alpha: true
	})
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(renderSize.x, renderSize.y);
    renderer.setClearColor(0xffffff, 0.0);

    renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
    renderTarget.minFilter = renderTarget.magFilter = THREE.LinearFilter;

 	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	// camera = new THREE.PerspectiveCamera(45, renderSize.x/renderSize.y, 0.01, 100000);
	camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
	camera.position.z = 750;

	// controls = new THREE.OrbitControls(camera);

	uniforms = {
	    "resolution": new THREE.Vector2(renderSize.x, renderSize.y),
	    "time": 0.0,
	    "mouse": new THREE.Vector2(0.0,0.0),
	    "sampleDistance": 30.0,
	    "diffusion": 1.0,
	    "turbulence": 1.0,
	    "fluidify": 0.99,
	    "attenuate": 0.005,
	}

	// noise = new Noise(renderer, scene, camera);
	// noise.init();

	// terrain = new Terrain(renderer, scene, camera);
	// terrain.init();

	// water = new Water(renderer, scene, camera);
	// water.init();

	// welbeck_left = new THREE.TextureLoader().load(PATH + "textures/Final_Trance_Welbs-1.png")
	// welbeck_right = new THREE.TextureLoader().load(PATH + "textures/Final_Progressive_Welbs-1.png")
	TPV = new THREE.TextureLoader().load(PATH + "textures/TRANCEPARTYV_Smaller.png")
	TPV.minFilter = TPV.magFilter = THREE.NearestFilter;

	geometry_center = new THREE.PlaneGeometry(renderSize.x, (renderSize.x)*(HEIGHT/WIDTH));
	material_center = new THREE.MeshBasicMaterial({
		map: TPV,
		transparent: true,
		side: 2 
	});
	mesh_center = new THREE.Mesh(geometry_center, material_center);
	mesh_center.position.y = -renderSize.x*((HEIGHT/2)/WIDTH) + renderSize.x/4;
	// mesh_center.userData.link = "https://www.residentadvisor.net/event.aspx?897127";
	// mesh_bottom.visible = false;
	// mesh_bottom.position.y = -(renderSize.x)*(scale*2.0)*(2172/1496);//-(renderSize.y + renderSize.x*(2248/WIDTH)*0.5);

	paddingGeometry = new THREE.PlaneGeometry(renderSize.x, renderSize.x);
	paddingMaterial = new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true,
		side: 2 
	});
	paddingMesh = new THREE.Mesh(paddingGeometry, paddingMaterial);
	paddingMesh.position.y = -renderSize.x*((HEIGHT)/WIDTH) - renderSize.x/4;
	// mesh_right.visible = false;
	// scene.add(mesh_right);

	renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, {
		minFilter:THREE.NearestFilter,
		magFilter:THREE.NearestFilter,
		format:THREE.RGBAFormat
	});

	colorScrollObj = new THREE.Object3D();
	meshScene = new THREE.Scene();
	counter = 0;
	// for(var i = 0; i < textures.length; i++){
		// counter += i;
		var meshPlane = new MeshPlane(meshScene, textures[0], counter);
		meshPlane.mesh.position.y = 0;//-renderSize.y*i;
		meshPlanes.push(meshPlane);
	// }
	// colorMesh.position.y = -renderSize.x*((HEIGHT/2)/WIDTH) + renderSize.x/4;

	ink = new Ink(renderer);
	ink.init();
	ink.setUniforms(uniforms);
	geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
	// material = new THREE.MeshBasicMaterial({
	// 	map: ink.buffers[0].renderTarget, 
	// 	side: 2 
	// });
	var shader = new GradientMapShader();
	material = new THREE.ShaderMaterial({
		uniforms: shader.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		side: 2
	});
	material.uniforms["texture"].value = ink.buffers[0].renderTarget;
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = -1;
	scene.add(mesh);

	// scrollObj = new THREE.Object3D();
	// scrollObj.add(mesh_center);
	// scrollObj.add(mesh_top);
	// scrollObj.add(mesh_bottom);
	// scrollObj.add(paddingMesh);
	// scene.add(scrollObj);
	// scrollObj.position.y += 120;


	meshScene.add(colorScrollObj);
	// colorScrollObj.position.y += 4;

    debounceResize = debounce(onWindowResize, 250);
    window.addEventListener("resize", debounceResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchdown', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', function(){screenshot(renderer)}, false);
    // document.addEventListener('wheel', scroll);

	animate();
}


function animate() {
    id = requestAnimationFrame(animate);
    draw();
}

function draw(){
	time += 0.01;
	uniforms.time = time;
	uniforms["mouse"].x = mouse.x;
	uniforms["mouse"].y = mouse.y;

	// noise.draw();
	for(var i = 0; i < meshPlanes.length; i++){
		meshPlanes[i].draw();
	}
	// icons_left.draw();
	// icons_right.draw();
	ink.draw();
	ink.setUniforms(uniforms);
    renderer.render(meshScene, camera, renderTarget);
    renderer.render(scene, camera);
}

function scroll(event){
	delta = event.deltaY*0.5;
	console.log(scrollObj.position.y, max);
	if(Math.sign(delta) == 1 && scrollObj.position.y < max){
		scrollObj.position.y += (delta)*Math.sign(delta);
		colorScrollObj.position.y += (delta)*Math.sign(delta);
	} else if (Math.sign(delta) == -1 && scrollObj.position.y > min){
		scrollObj.position.y -= (delta)*Math.sign(delta);
		colorScrollObj.position.y -= (delta)*Math.sign(delta);
	}
}

function setRenderSize(){
    renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
    // renderSize = new THREE.Vector2(1440, 800);
}
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderSize.x) * 2 - 1;  
    mouse.y = -(event.clientY / renderSize.y) * 2 + 1;   
/*    raycaster.setFromCamera( mouse, camera );   
    var intersects = raycaster.intersectObjects( scrollObj.children );
	document.body.style.cursor = "default";
    if ( intersects.length > 0 ) {
        SELECTED = intersects[ 0 ];
        if(SELECTED.object.userData.link){
        	document.body.style.cursor = "pointer";
        }
    } */
    // colorMesh_left.material.opacity = 1.0 - mouse.x;
	// colorMesh_right.material.opacity =  mouse.x;
	handleAudio();

}
function onMouseDown(event) {
    mouse.x = (event.pageX / renderSize.x) * 2 - 1;  
    mouse.y = -(event.pageY / renderSize.y) * 2 + 1;    
    raycaster.setFromCamera( mouse, camera );   
    var intersects = raycaster.intersectObjects( scrollObj.children );
    if ( intersects.length > 0 ) {
        SELECTED = intersects[ 0 ];
        if(SELECTED.object.userData.link){
        	window.open(SELECTED.object.userData.link);
        }
    } 
    handleAudio();
}
function onDocumentTouchStart(event) {
    updateMouse(event);
}

function onDocumentTouchMove(event) {
    updateMouse(event);
}

function updateMouse(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouse.x = (event.touches[0].pageX / renderSize.x) * 2 - 1;
        mouse.y = -(event.touches[0].pageY / renderSize.y) * 2 + 1;
        handleAudio();
    }
}
function handleAudio(){

	audio.play();

}
function onWindowResize(event) {
    setRenderSize();
    renderer.setSize(renderSize.x, renderSize.y);
    uniforms["resolution"] = new THREE.Vector2(renderSize.x, renderSize.y);
	// camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
	// camera.left = renderSize.x / - 2;
	// camera.right = renderSize.x / 2;
	// camera.top = renderSize.y / 2;
	// camera.bottom = renderSize.y / - 2;
	// camera.updateProjectionMatrix();
    // var geo = new THREE.PlaneGeometry(renderSize.x, (renderSize.x)*(HEIGHT/WIDTH));
    // mesh_center.geometry = geo;
    // colorMesh.geometry = geo; 
}
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
function screenshot(renderer) {
}