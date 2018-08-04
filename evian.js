var isMobile = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);
var renderer, scene, camera;
var renderSize = new THREE.Vector2(0.0, 0.0);
var container = document.getElementById("webgl-container");
var PATH = './assets/';
var time = 0.0;
var mouse = new THREE.Vector2(0.0, 0.0);
var loader = new THREE.TextureLoader();
var delta = 0.0;
var max;
var min = 0;
var distance = 10;
var HEIGHT = 2948;
var WIDTH = 3600;
var raycaster = new THREE.Raycaster();
var left = document.getElementById("left");
var right = document.getElementById("right");
var loadingGFX = document.getElementById("loadingGFX");
var assetCount = 0, totalAssetCount = 2;
var TPV = loader.load(PATH + "textures/TRANCEPARTYV_final_tiny-compressor.png", loadCounter)
var colorBG = loader.load(PATH + "textures/TRANCEPARTYV_BG_final_tiny-compressor.png", loadCounter)
colorBG.minFilter = colorBG.magFilter = THREE.NearestFilter;

function loadCounter(){
    assetCount++;
    if(assetCount >= totalAssetCount){
        init();
    }
}

function init(){
	setRenderSize();
	renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true,
		antialias: true,
		alpha: true
	})
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(renderSize.x, renderSize.y);
    renderer.setClearColor(0x000000, 0.0);

    renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
    renderTarget.minFilter = renderTarget.magFilter = THREE.LinearFilter;

	container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
	camera.position.z = 750;

	uniforms = {
	    "resolution": new THREE.Vector2(renderSize.x, renderSize.y),
	    "time": 0.0,
	    "mouse": new THREE.Vector2(0.0,0.0),
	    "sampleDistance": 15.0,
	    "diffusion": 0.5,
	    "turbulence": 1.0,
	    "fluidify": 0.1,
	    "attenuate": 0.005,
	}


	geometry_center = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
	material_center = new THREE.MeshBasicMaterial({
		map: TPV,
		transparent: true,
		side: 2 
	});
	mesh_center = new THREE.Mesh(geometry_center, material_center);
	// mesh_center.position.y = -renderSize.x*((HEIGHT/2)/WIDTH) + renderSize.x/4;
	mesh_center.userData.link = "https://www.residentadvisor.net/event.aspx?897127";
	// mesh_bottom.visible = false;
	// mesh_bottom.position.y = -(renderSize.x)*(scale*2.0)*(2172/1496);//-(renderSize.y + renderSize.x*(2248/WIDTH)*0.5);

	paddingGeometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
	paddingMaterial = new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true,
		side: 2 
	});
	paddingMesh = new THREE.Mesh(paddingGeometry, paddingMaterial);
	// paddingMesh.position.y = -renderSize.x*((HEIGHT)/WIDTH) - renderSize.x/4;
	// mesh_right.visible = false;
	// scene.add(mesh_right);

	renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, {
		minFilter:THREE.NearestFilter,
		magFilter:THREE.NearestFilter,
		format:THREE.RGBAFormat
	});
	colorScene = new THREE.Scene();

	colorGeometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
	colorMaterial = new THREE.MeshBasicMaterial({
		map: colorBG,
		transparent: true,
		side: 2 
	});
	colorMesh = new THREE.Mesh(colorGeometry, colorMaterial);
	// colorMesh.position.y = -renderSize.x*((HEIGHT/2)/WIDTH) + renderSize.x/4;

	ink = new Ink(renderer);
	ink.init();
	ink.setUniforms(uniforms);
	geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
	material = new THREE.MeshBasicMaterial({
		map: ink.buffers[0].renderTarget, 
		side: 2 
	});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = -1;
	scene.add(mesh);

	scrollObj = new THREE.Object3D();
	scrollObj.add(mesh_center);
	// scrollObj.add(mesh_top);
	// scrollObj.add(mesh_bottom);
	// scrollObj.add(paddingMesh);
	scene.add(scrollObj);
	// scrollObj.position.y += 120;

	colorScrollObj = new THREE.Object3D();
	colorScrollObj.add(colorMesh);
	colorScene.add(colorScrollObj);
	// colorScrollObj.position.y += 120;

    debounceResize = debounce(onWindowResize, 250);
    window.addEventListener("resize", debounceResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchdown', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', function(){screenshot(renderer)}, false);
    // document.addEventListener('wheel', scroll);
	loadingGFX.style.display = "none";
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
	// icons_left.draw();
	// icons_right.draw();
	ink.draw();
	ink.setUniforms(uniforms);
    renderer.render(colorScene, camera, renderTarget);
    renderer.render(scene, camera);
}

function setRenderSize(){
    renderSize = new THREE.Vector2(window.innerWidth, window.innerWidth*(HEIGHT/WIDTH));
    // renderSize = new THREE.Vector2(1440, 800);
}
function onMouseMove(event) {
    // event.preventDefault();
    mouse.x = (event.clientX / renderSize.x) * 2 - 1;  
    mouse.y = -(event.clientY / renderSize.y) * 2 + 1;   
    handleAudio();
}

function handleAudio(){
	var m = (mouse.x/0.3333)*0.5 + 0.5;
	m = Math.max(0.0, Math.min(m, 1.0));
	left.volume = (1.0 - m);
	right.volume = m;
	console.log(left.volume, right.volume);
	left.play();
	if(!isMobile){
		right.play();		
	}

}

function onMouseDown(event) {
    mouse.x = (event.pageX / renderSize.x) * 2 - 1;  
    mouse.y = -(event.pageY / renderSize.y) * 2 + 1;    
    // raycaster.setFromCamera( mouse, camera );   
    // var intersects = raycaster.intersectObjects( scrollObj.children );
    // if ( intersects.length > 0 ) {
    //     SELECTED = intersects[ 0 ];
    //     if(SELECTED.object.userData.link){
    //     	// window.open(SELECTED.object.userData.link);
    //     }
    // } 
}
function onDocumentTouchStart(event) {
    updateMouse(event);
}

function onDocumentTouchMove(event) {
    updateMouse(event);
}

function updateMouse(event) {
    if (event.touches.length === 1) {
    	///test
        // if(event.target.nodeName != "IMG" || event.target.nodeName != "A"){
	        // event.preventDefault();
        // }
        mouse.x = (event.touches[0].pageX / renderSize.x) * 2 - 1;
        mouse.y = -(event.touches[0].pageY / renderSize.y) * 2 + 1;
        handleAudio();
    }

}
function onWindowResize(event) {
    setRenderSize();
    renderer.setSize(renderSize.x, renderSize.y);
    uniforms["resolution"] = new THREE.Vector2(renderSize.x, renderSize.y);
	// camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
	camera.left = renderSize.x / - 2;
	camera.right = renderSize.x / 2;
	camera.top = renderSize.y / 2;
	camera.bottom = renderSize.y / - 2;
	camera.updateProjectionMatrix();
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