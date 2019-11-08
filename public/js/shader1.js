function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor = false;
 
  const camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );

  const fragmentShader = `
  uniform float iTime;
  uniform vec3 iResolution;

  void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec3 c;
    float t=iTime;
    vec2 r=iResolution.xy;
    float l,z=t,rad,tmult,anothervar;
    for(int i=0;i<3;i++) {
      vec2 uv,p=fragCoord.xy/r;
      uv=p;
      p.xy-=0.5;
      p.x*=r.x/r.y;
      z+=(0.1*(sin(5.0*t)+1.0))+0.05;
      l=length(p);
      rad=100.0*(sin(0.2*t)+1.0)-1.0;
      uv+=p/l*(sin(0.5*z))*abs(sin(l*rad-z*2.0)+0.5);
      c[i]=0.1/length(abs(mod(uv,1.0)-0.5));
    }
    fragColor=vec4(c,t);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `;

  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };

  const scene = new THREE.Scene();
  const plane = new THREE.PlaneBufferGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  scene.add(new THREE.Mesh(plane, material));
 
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
 
  function render(time) {
    time *= 0.001;

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width,canvas.height,1);
    uniforms.iTime.value = time;
 
    renderer.render(scene, camera);
 
    requestAnimationFrame(render);
  }
 
  requestAnimationFrame(render);
}
 
main();