var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl');
window.onload = onWindowResize
window.addEventListener( 'resize', onWindowResize, false );

//Time
var dt = .02;
var time = 0.0;

//************** Shader sources **************
var vertexSource = `
attribute vec2 position;
void main() {
   gl_Position = vec4(position, 0, 1.0);
}
`;

var fragmentSource = `
#define PI 3.14159265358979323846
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);
uniform float time;

//from bookofshaders.com
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle)) * _st;
    _st.y += 0.5;
		_st.x += .5;
    return _st;
}

// https://www.shadertoy.com/view/4dS3Wd Morgan McGuire
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 corners as percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


float surface(vec2 pos, float radius, float time) {
    float distanceFromCenter = length(pos)*3.0;
    float a = atan(pos.y,pos.x);
    float m = a*time;
    m += noise(pos+time*0.1)*.5;
    a *= 1.+abs(atan(time*0.2))*.1;
    a *= 1.+noise(pos+time*0.1)*0.1;
    radius += sin(a*50.)*noise(pos+time*.2)*.003;
    radius += (sin(a*20.)*.002);
    return 1.-smoothstep(radius,radius+0.009,distanceFromCenter);
}

void main(){

	//translation
  float aspect = width/height;
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  float mini = min(width, height);
  float maxi = max(width, height);
  float factor = width > height ? mini : maxi;
  uv.x = (uv.x * aspect)-(.5*(width-height)/factor);
  
  //time and distance
  float period = 15.2*PI;
	float t = mod(time, period);
  t=-t;
  vec2 pos = uv;
  pos = vec2(0.5, 1.0+10.0*sin(t*.003))-pos;
  float d = length(pos);//distance from center
	float id = 1.0 - d;//inverse distance from center

  //sun
  float ed = distance(vec2(.5,.5), uv); 
  vec3 red = -d + vec3(0.0+uv.y,0.0,0.0);
  vec3 orange = -d + vec3(1.0,.4,0.5+ed);
  vec3 yellow = vec3(.9,1.0,.3+.75*d)*clamp(id, 0.0, 1.0);
  vec3 lime = vec3(1.0,1.0,.1)*clamp(id, 0.0, 1.0);
 
  //stars
  float movement = .00;//none
  float rotation = -t*.0000;//none
  float twinkle = (1.0+.3*cos(t*80.*random(uv)));

  //most distant tiny stars
  vec2 starPos = uv;
  starPos.y += t*movement;
  starPos = rotate(starPos, rotation);
  float r = random(floor(starPos*400.));
  r *= step(.96, r);
  vec3 stars = vec3(.9,.9,1.0) * vec3(r)*d;
  stars *= 1.0-step(d,.2);
  vec4 starfield = .2*vec4(stars,1.0-uv.y);

  //medium distance white stars
  vec2 starPos2 = uv;
  starPos2.y += t*movement;
  starPos2 = rotate(starPos2, rotation);
  float r2 = random(floor(starPos2*450.));
  r2 *= step(.98, r2);
  vec3 stars2 = vec3(1.0,1.0,1.0) * vec3(r2)*d;
  stars2 *= 1.0-step(d,.2);
  vec4 starfield2 = (twinkle)*.37*vec4(stars2,1.0);

  //dim red stars
  vec2 starPos3 = uv;
  starPos3.y += t*movement;
  starPos3 = rotate(starPos3, rotation);
  float r3 = random(floor(starPos3*350.));
  r3 *= step(.9985, r3);
  vec3 stars3 = vec3(1.0,.4,.5) * vec3(r3)*d;
  stars3 *= 1.0-step(d,.2);
  vec4 starfield3 = twinkle*.35*vec4(stars3,1.0);

  //closer, brighter stars
  vec2 starPos4 = uv;
  starPos4.y += t*movement;
  starPos4 = rotate(starPos4, rotation);
  float r4 = random(floor(starPos4*400.));
  r4 *= step(.9986, r4);
  vec3 stars4 = vec3(.5,.5,1.0) * vec3(r4)*d;
  //adding tiny bit of overall blue here:
  stars4 += .5*vec3(0.0,0.0,.15);
  stars4 *= 1.0-step(d,.2);
  vec4 starfield4 = twinkle*1.0*vec4(stars4,1.0);

  float surfaceTemp = .7;
  vec3 colorz = (yellow)*(lime)*(.9*(lime+yellow+orange+red)); 
  gl_FragColor = .5*(starfield2+starfield+starfield3+starfield4)+vec4(colorz+(2.0*uv.y*(surfaceTemp*surface(pos,.6,t))),1.0);

}
`;

//************** Utility functions **************

function onWindowResize(){
  canvas.width  = window.innerWidth;//Math.min(window.innerWidth, window.innerHeight);
  canvas.height =  window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle, canvas.width);
  gl.uniform1f(heightHandle, canvas.height);
}


//Compile shader and combine with source
function compileShader(shaderSource, shaderType){
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
  	throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

//From https://codepen.io/jlfwong/pen/GqmroZ
//Utility to complain loudly if we fail to find the attribute/uniform
function getAttribLocation(program, name) {
  var attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
  	throw 'Cannot find attribute ' + name + '.';
  }
  return attributeLocation;
}

function getUniformLocation(program, name) {
  var attributeLocation = gl.getUniformLocation(program, name);
  if (attributeLocation === -1) {
  	throw 'Cannot find uniform ' + name + '.';
  }
  return attributeLocation;
}

//************** Create shaders **************

//Create vertex and fragment shaders
var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

//Create shader programs
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

gl.useProgram(program);

//Set up rectangle covering entire canvas 
var vertexData = new Float32Array([
  -1.0,  1.0, 	// top left
  -1.0, -1.0, 	// bottom left
   1.0,  1.0, 	// top right
   1.0, -.7, 	// bottom right
]);

//Create vertex buffer
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Layout of our data in the vertex buffer
var positionHandle = getAttribLocation(program, 'position');

gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle,
  2, 				// position is a vec2 (2 values per component)
  gl.FLOAT, // each component is a float
  true, 		// don't normalize values
  2 * 4, 		// two 4 byte float components per vertex (32 bit float is 4 bytes)
  0 				// how many bytes inside the buffer to start from
  );

//Set uniform handle
var timeHandle = getUniformLocation(program, 'time');
var widthHandle = getUniformLocation(program, 'width');
var heightHandle = getUniformLocation(program, 'height');

function draw(){
  //Update time
  time += dt;

	//Send uniforms to program
  gl.uniform1f(timeHandle, time);
  //Draw a triangle strip connecting vertices 0-4
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(draw);
}

draw();