#define t iTime
#define r iResolution.xy

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec3 c;
	float l,z=t,rad,tmult,anothervar;
	for(int i=0;i<3;i++) {
		vec2 uv,p=fragCoord.xy/r;
		uv=p;
        //p.x-=0.3*sin(t)+0.5;
        //p.y-=0.3*cos(t)+0.5;
		p.xy-=0.5;
		p.x*=r.x/r.y;
        //tmult=(0.9*sin(1.0*t))+0.6;
        tmult=0.5;
        z+=(0.1*(sin((tmult*10.0)*t)+0.5))+0.05;
        //z+=0.075;
		l=length(p);
        rad=(150.0*(sin(0.2*t)+0.5))+0.0;
        //rad=20.0;
		uv+=p/l*(sin(0.5*z))*abs(sin(l*rad-z*2.0)+0.5);
        //anothervar=(0.02*(sin(t*0.1)+0.5))+0.015;
        //anothervar=0.03;
		//c[i]=anothervar/length(abs(mod(uv,1.)-0.0));
        c[i]=0.1/length(abs(mod(uv,1.0)-0.5));
        //c[i]=length(uv);
	}
	fragColor=vec4(c,t);
}