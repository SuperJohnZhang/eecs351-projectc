var VSHADER_SOURCE =
	'precision mediump float;\n' +
	'precision highp int;\n' +

	'uniform int u_shading;\n' +

	'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'		vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'		vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'		vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'		vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'		int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
	'		};\n' +

	// the lampT struct
	'struct LampT {\n' +		// Describes one point-like Phong light source
	'		vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
													//		   w==0.0 for distant light from x,y,z direction
	' 	vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	' 	vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'		vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
	'}; \n' +

	// uniform struct
	'uniform MatlT u_MatlSet[1];\n' + // the materials
	'uniform LampT u_LampSet[2];\n' + // the lampset

	'attribute vec4 a_Position; \n' +
	'attribute vec4 a_Normal; \n' +

	'uniform mat4 u_MvpMatrix; \n' +
	'uniform mat4 u_ModelMatrix; \n' +
	'uniform mat4 u_NormalMatrix; \n' +

	'uniform vec4 u_Color;\n' +

	'varying vec3 v_Kd; \n' +
	'varying vec4 v_Position; \n' +
	'varying vec3 v_Normal; \n' +
	'varying vec4 v_Color;\n' +

	'uniform vec4 u_eyePosWorld; \n' + 	// Camera/eye location in world coords.

	'void main() { \n' +
	'  gl_Position = u_MvpMatrix * a_Position;\n' +
	'  v_Position = u_ModelMatrix * a_Position; \n' +
	'  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	// if it is mode 3
	'	 if (u_shading==3){\n' +
	'    v_Color = u_Color;\n'+
	'		 return;\n'+
	'	 }\n' +
	'	 if (u_shading==2){\n' +
	'    vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
	'    vec3 lightDirectionU = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
	'    float nDotL = max(dot(lightDirection, v_Normal), 0.0); \n' +
	'    float nDotLU = max(dot(lightDirectionU, v_Normal), 0.0); \n' +
	'    vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +
	'    vec3 H = normalize(lightDirection + eyeDirection); \n' +
	'    vec3 HU = normalize(lightDirectionU + eyeDirection); \n' +
	'    float nDotH = max(dot(H, v_Normal), 0.0); \n' +
	'    float nDotHU = max(dot(HU, v_Normal), 0.0); \n' +
	'    float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
	'    float e64U = pow(nDotHU, float(u_MatlSet[0].shiny));\n' +
	'	   vec3 emissive = u_MatlSet[0].emit;' +
	'    vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi + u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
	'    vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotLU;\n' +
	'	   vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e64U;\n' +
	'    v_Color = vec4(emissive + ambient +diffuse + speculr , 1.0);\n' +
	'		 return;\n'+
	'	 }\n' +
	'	 if (u_shading==1){\n' +
	'    vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
	'    vec3 lightDirectionU = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
	'    float nDotL = max(dot(lightDirection, v_Normal), 0.0); \n' +
	'    float nDotLU = max(dot(lightDirectionU, v_Normal), 0.0); \n' +
	'    vec3 diffuse = u_LampSet[0].diff * u_Color.rgb * nDotL + u_LampSet[1].diff * u_Color.rgb * nDotLU;\n' +
	'    vec3 ambient = u_LampSet[0].ambi * u_Color.rgb + u_LampSet[1].ambi * u_Color.rgb;\n' +
	'    v_Color = vec4(diffuse + ambient, u_Color.a);\n' +
	'		 return;\n'+
	'	 }\n' +
	'	 v_Kd = u_MatlSet[0].diff; \n' +
	'}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
	'precision highp int;\n' +

	// the material struct
	'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'		vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'		vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'		vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'		vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'		int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
	'		};\n' +

	// the lampT struct
	'struct LampT {\n' +		// Describes one point-like Phong light source
	'		vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
													//		   w==0.0 for distant light from x,y,z direction
	' 	vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	' 	vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'		vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
	'}; \n' +

	// first material definition: you write 2nd, 3rd, etc.
	'uniform int u_shading;\n' +
	// the struct uniform
	'uniform MatlT u_MatlSet[1];\n' +
	'uniform LampT u_LampSet[2];\n' + // the lampset

  'uniform vec4 u_eyePosWorld; \n' + 	// Camera/eye location in world coords.
  'varying vec3 v_Normal;\n' +				// Find 3D surface normal at each pix
  'varying vec4 v_Position;\n' +			// pixel's 3D pos too -- in 'world' coords
  'varying vec3 v_Kd;	\n' +						// Find diffuse reflectance K_d per pix
	'varying vec4 v_Color;\n' +

  'void main() { \n' +
	'	 if (u_shading==0){\n'+
	'    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n'+
	'		 return;\n'+
	'  }\n'+
	'	 if (u_shading==2 || u_shading == 1){\n'+
	'    gl_FragColor = v_Color;\n'+
	'		 return;\n'+
	'  }\n'+
	'  vec3 normal = normalize(v_Normal); \n' +
	'  vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
	'  vec3 lightDirectionU = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
	'  float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
	'  float nDotLU = max(dot(lightDirectionU, normal), 0.0); \n' +
	'	 if (u_shading==3){\n' +
	'    vec3 diffuse = u_LampSet[0].diff * v_Color.rgb * nDotL + u_LampSet[1].diff * v_Color.rgb * nDotLU;\n' +
	'    vec3 ambient = u_LampSet[0].ambi * v_Color.rgb + u_LampSet[1].ambi * v_Color.rgb;\n' +
	'	   ambient = clamp(ambient, 0.0, 1.0);\n' +
	'	   diffuse = clamp(diffuse, 0.0, 1.0);\n' +
	'    gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
	'		 return;\n'+
	'	 }\n' +
  '  vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +
	'  vec3 H = normalize(lightDirection + eyeDirection); \n' +
	'  vec3 HU = normalize(lightDirectionU + eyeDirection); \n' +
	'  float nDotH = max(dot(H, normal), 0.0); \n' +
	'  float nDotHU = max(dot(HU, normal), 0.0); \n' +
	// calculate the material
	'  float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
	'  float e64U = pow(nDotHU, float(u_MatlSet[0].shiny));\n' +
  '	 vec3 emissive = u_MatlSet[0].emit;' +
  '  vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi + u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
  '  vec3 diffuse = u_LampSet[0].diff * v_Kd * nDotL + u_LampSet[1].diff * v_Kd * nDotLU;\n' +
  '	 vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e64U;\n' +
	'	 ambient = clamp(ambient, 0.0, 1.0);\n' +
	'	 diffuse = clamp(diffuse, 0.0, 1.0);\n' +
	'	 speculr = clamp(speculr, 0.0, 1.0);\n' +
  '  gl_FragColor = vec4(emissive + ambient +diffuse + speculr , 1.0);\n' +
  '}\n';
//=============================================================================
// window parameter
var canvas;
var gl;

// scene variable location
var u_eyePosWorld;
var u_ModelMatrix;
var u_MvpMatrix;
var u_NormalMatrix;

// shading flags 0-no shading 1-B,G shading, 2-P,G shading, 3-B,P shading, 4-P,P shading
var u_shading;
var shadingMode = 4;

// material
var matl0 = new Material(MATL_RED_PLASTIC);						// the material for first complex
var matl1 = new Material(MATL_BRASS);						// the material for second complex
var matl2 = new Material(MATL_SILVER_DULL);						// the material for third complex
var matl3 = new Material(MATL_GRN_PLASTIC);
var u_Ke = false;
var u_Ka = false;
var u_Kd = false;
var u_Ks = false;
var u_Kshiny = false;
var u_Color = false;

// light
var lamp0 = new LightsT();
var lamp1 = new LightsT();
var UserLightValue = [0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0, 5.0]; // the first three is position
var headlightValue = [0.4, 0.4, 0.4, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];

// camera value
var cameraValue = [20.0, 20.0, 20.0, 0.0, 0.0, 0.0, 0, 0, 1];

// animation related
var angleSpeed = 45.0;
var currentAngle = 0;

// other const
var FSIZE = 2;
var SPHERE_DIV = 13;
var ATTR_LENGTH = 3;
var RADIUS = 1;

//=============================================================================
function main() {
	// init user light rgb value and position
	var userLightInput = document.getElementsByName('userL');
	var i;
	for (i=0; i<userLightInput.length; i++){
		userLightInput[i].value = UserLightValue[i];
	}

  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  canvas.width = window.innerWidth;
	canvas.height = window.innerHeight*3/4;
  gl = getWebGLContext(canvas);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.DEPTH_TEST);

	// get the shading flag
	u_shading = gl.getUniformLocation(gl.program, 'u_shading');
	if (!u_shading){
		console.log('Failed to get u_shading location');
	}

	// Get the storage locations of uniform variables: the scene matrix
	u_eyePosWorld = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	u_MvpMatrix = gl.getUniformLocation(gl.program, 	'u_MvpMatrix');
	u_NormalMatrix = gl.getUniformLocation(gl.program,'u_NormalMatrix');
	if (!u_ModelMatrix	|| !u_MvpMatrix || !u_NormalMatrix) {
		console.log('Failed to get matrix storage locations');
		return;
	}

	//  ... for Phong light source:
	// for the head light
	lamp0.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[0].pos');
	lamp0.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[0].ambi');
	lamp0.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[0].diff');
	lamp0.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[0].spec');
	if( !lamp0.u_pos || !lamp0.u_ambi	|| !lamp0.u_diff || !lamp0.u_spec	) {
		console.log('Failed to get GPUs Lamp0 storage locations');
		return;
	}

	// for the user light
	lamp1.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[1].pos');
	lamp1.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[1].ambi');
	lamp1.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[1].diff');
	lamp1.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[1].spec');
	if( !lamp0.u_pos || !lamp0.u_ambi	|| !lamp0.u_diff || !lamp0.u_spec	) {
		console.log('Failed to get GPUs Lamp0 storage locations');
		return;
	}
  lamp1.I_ambi.elements.set([0.4, 0.4, 0.4]);
  lamp1.I_diff.elements.set([1.0, 1.0, 1.0]);
  lamp1.I_spec.elements.set([1.0, 1.0, 1.0]);

	gl.uniform3fv(lamp1.u_ambi, lamp1.I_ambi.elements);		// ambient
	gl.uniform3fv(lamp1.u_diff, lamp1.I_diff.elements);		// diffuse
	gl.uniform3fv(lamp1.u_spec, lamp1.I_spec.elements);		// Specular

	// ... for Phong material/reflectance:
	// new objec to handle all the material locations
	u_Ke = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
	u_Ka = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
	u_Kd = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
	u_Ks = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
	u_Kshiny = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');

	if(!u_Ke || !u_Ka || !u_Kd || !u_Ks || !u_Kshiny) {
		console.log('Failed to get the Phong Reflectance storage locations');
		return;
	}

	u_Color = gl.getUniformLocation(gl.program, 'u_Color');
	if (!u_Color){
		console.log('Failed to get the storage of u_Color');
		return;
	}


  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals

	// window resize listener
	window.addEventListener('resize', resizeCanvas, false);
	// keystroke listener
	window.addEventListener('keydown', myKeyDown, false);

	// the animation
	var tick = function(){

		draw(modelMatrix, mvpMatrix, normalMatrix, n);
		requestAnimationFrame(tick, canvas);
		animate();
		//console.log(currentAngle);
	}
	tick();
}

// resize window
function resizeCanvas(){
	canvas = document.getElementById('webgl');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight*3/4;
	gl = getWebGLContext(canvas);
}

// manipulate the keyboard
function myKeyDown(ev){
	var vx, vy, k, length;
	var nx, ny;
	vx = cameraValue[3]-cameraValue[0];
	vy = cameraValue[4]-cameraValue[1];
	k = -vx/vy;
	length = Math.sqrt(1+k*k)*0.5;
	nx = 1/length;
	ny = k/length;
	if (vy<0){
		nx = -nx;
		ny = -ny;
	}
	length = Math.sqrt(vx*vx+vy*vy)*0.5;
	vx = vx/length;
	vy = vy/length;

	switch (ev.keyCode) {
		// left
		case 37:
			cameraValue[3]-=nx;
			cameraValue[4]-=ny;
			break;
		// up
		case 38:
			cameraValue[5]+=0.5;
			break;
		// right
		case 39:
			cameraValue[3]+=nx;
			cameraValue[4]+=ny;
			break;
		// down
		case 40:
			cameraValue[5]-=0.5
			break;
		// w
		case 87:
			cameraValue[2]+=0.5;
			cameraValue[5]+=0.5;
			break;
		// s
		case 83:
			cameraValue[2]-=0.5;
			cameraValue[5]-=0.5;
			break;
		// a
		case 65:
			cameraValue[0]-=nx;
			cameraValue[1]-=ny;
			cameraValue[3]-=nx;
			cameraValue[4]-=ny;
			break;
		// d
		case 68:
			cameraValue[0]+=nx;
			cameraValue[1]+=ny;
			cameraValue[3]+=nx;
			cameraValue[4]+=ny;
			break;
		// i
		case 73:
			cameraValue[0]+=vx;
			cameraValue[1]+=vy;
			cameraValue[3]+=vx;
			cameraValue[4]+=vy;
			break;
		// o
		case 79:
			cameraValue[0]-=vx;
			cameraValue[1]-=vy;
			cameraValue[3]-=vx;
			cameraValue[4]-=vy;
			break;

		default:

	}


}

// ----------------------------------------------- this part is for drawing process ------------------------------------------
function draw(modelMatrix, mvpMatrix, normalMatrix, n){
	// first setting up the light
	// the headlight
	// check the existance of each part
	lamp0.I_ambi.elements.set([headlightValue[0], headlightValue[1], headlightValue[2]]);
	lamp0.I_diff.elements.set([headlightValue[3], headlightValue[4], headlightValue[5]]);
	lamp0.I_spec.elements.set([headlightValue[6], headlightValue[7], headlightValue[8]]);
	if (!document.getElementById('headAmbient').checked){
		lamp0.I_ambi.elements.set([0.0, 0.0, 0.0]);
	}
	if (!document.getElementById('headdiffuse').checked){
		lamp0.I_diff.elements.set([0.0, 0.0, 0.0]);
	}
	if (!document.getElementById('headspecular').checked){
		lamp0.I_spec.elements.set([0.0, 0.0, 0.0]);
	}
	gl.uniform3fv(lamp0.u_ambi, lamp0.I_ambi.elements);		// ambient
	gl.uniform3fv(lamp0.u_diff, lamp0.I_diff.elements);		// diffuse
	gl.uniform3fv(lamp0.u_spec, lamp0.I_spec.elements);		// Specular

	lamp0.I_pos.elements.set([cameraValue[0], cameraValue[1], cameraValue[2]]);
	gl.uniform3fv(lamp0.u_pos,  lamp0.I_pos.elements.slice(0,3));

	// the user lights
	lamp1.I_ambi.elements.set([UserLightValue[0], UserLightValue[1], UserLightValue[2]]);
	lamp1.I_diff.elements.set([UserLightValue[3], UserLightValue[4], UserLightValue[5]]);
	lamp1.I_spec.elements.set([UserLightValue[6], UserLightValue[7], UserLightValue[8]]);
	if (!document.getElementById('userAmbient').checked){
		lamp1.I_ambi.elements.set([0.0, 0.0, 0.0]);
	}
	if (!document.getElementById('userdiffuse').checked){
		lamp1.I_diff.elements.set([0.0, 0.0, 0.0]);
	}
	if (!document.getElementById('userspecular').checked){
		lamp1.I_spec.elements.set([0.0, 0.0, 0.0]);
	}
	gl.uniform3fv(lamp1.u_ambi, lamp1.I_ambi.elements);		// ambient
	gl.uniform3fv(lamp1.u_diff, lamp1.I_diff.elements);		// diffuse
	gl.uniform3fv(lamp1.u_spec, lamp1.I_spec.elements);		// Specular

	lamp1.I_pos.elements.set([UserLightValue[9], UserLightValue[10], UserLightValue[11]]);
	gl.uniform3fv(lamp1.u_pos,  lamp1.I_pos.elements.slice(0,3));

	// clear the previous one
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// call viewport
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	// setting up the perspective
	modelMatrix.setIdentity();
	normalMatrix.setIdentity();
	mvpMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);
	mvpMatrix.lookAt(cameraValue[0], cameraValue[1], cameraValue[2], 				// eye pos (in world coords)
									 cameraValue[3], cameraValue[4], cameraValue[5], 				// aim-point (in world coords)
									 cameraValue[6], cameraValue[7], cameraValue[8]);				// up (in world coords)

	// first draw the sphere
	drawSphereComplex(gl, n[0], 0, gl.UNSIGNED_SHORT, mvpMatrix, modelMatrix, normalMatrix);

	// next draw the ground plane
	drawGroundPlane(gl, n[1], FSIZE*n[0], gl.UNSIGNED_SHORT, mvpMatrix, modelMatrix, normalMatrix);

	// next draw the cube
	drawCubeComplex(gl, n[2], FSIZE*(n[0]+n[1]), gl.UNSIGNED_SHORT, mvpMatrix, modelMatrix, normalMatrix);

	// finally draw the last complex
	drawComplicatedComplex(gl, n[0], 0, n[2], FSIZE*(n[0]+n[1]), gl.UNSIGNED_SHORT, mvpMatrix, modelMatrix, normalMatrix);
}

function drawComplicatedComplex(gl, scount, soffset, ccount, coffset, type, mvpMatrix, modelMatrix, normalMatrix){
	// deal with lighting mode
	if (shadingMode == 3 || shadingMode == 1){
		gl.uniform4f(u_Color, 0.75, 0.75, 0.75, 1.0);
	}

	// set material
	gl.uniform3fv(u_Ke, matl2.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(u_Ka, matl2.K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(u_Kd, matl2.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(u_Ks, matl2.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(u_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny

	var tempMvpMatrix = new Matrix4();
	var tempModelMatrix = new Matrix4();
	var tempNormalMatrix = new Matrix4();
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.set(modelMatrix);
	tempModelMatrix.translate(0, -4, 1);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	// this two uniform variables don't need change in this function
	gl.uniform1i(u_shading, shadingMode);
	gl.uniform4f(u_eyePosWorld, cameraValue[0],cameraValue[1], cameraValue[2], 1);
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, scount, type, soffset);
	// the second part
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.rotate(currentAngle, -1, 0, 0);
	tempModelMatrix.translate(0.0, -2.5, 0.0);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, ccount, type, coffset);
	// the third part
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.rotate(currentAngle, -1, 0, 0);
	tempModelMatrix.translate(0.0, -2.5, 0.0);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, scount, type, soffset);
}

function drawCubeComplex(gl, count, offset, type, mvpMatrix, modelMatrix, normalMatrix){
	// deal with lighting mode
	if (shadingMode == 3 || shadingMode == 1){
		gl.uniform4f(u_Color, 0.70, 0.65, 0.26, 1.0);
	}

	// set material
	gl.uniform3fv(u_Ke, matl1.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(u_Ka, matl1.K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(u_Kd, matl1.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(u_Ks, matl1.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(u_Kshiny, parseInt(matl1.K_shiny, 10));     // Kshiny

	var tempMvpMatrix = new Matrix4();
	var tempModelMatrix = new Matrix4();
	var tempNormalMatrix = new Matrix4();
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.set(modelMatrix);
	tempModelMatrix.translate(0, 4, 1);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	// this two uniform variables don't need change in this function
	gl.uniform1i(u_shading, shadingMode);
	gl.uniform4f(u_eyePosWorld, cameraValue[0],cameraValue[1], cameraValue[2], 1);
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, count, type, offset);
	// the second part
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.rotate(90-currentAngle, 1, 0, 0);
	tempModelMatrix.translate(0.0, 2.5, 0.0);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, count, type, offset);
	// the third part
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.rotate(90-currentAngle, 1, 0, 0);
	tempModelMatrix.translate(0.0, 2.5, 0.0);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, count, type, offset);
}


function drawGroundPlane(gl, count, offset, type, mvpMatrix, modelMatrix, normalMatrix){
	var tempMvpMatrix = new Matrix4();
	var tempModelMatrix = new Matrix4();
	var tempNormalMatrix = new Matrix4();
	tempModelMatrix.set(modelMatrix);

	// set material
	gl.uniform3fv(u_Ke, matl3.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(u_Ka, matl3.K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(u_Kd, matl3.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(u_Ks, matl3.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(u_Kshiny, parseInt(matl3.K_shiny, 10));     // Kshiny

	if (shadingMode == 3 || shadingMode == 1){
		gl.uniform4f(u_Color, 0, 0.8, 0, 1.0);
	}

	for(var i=0; i<35; i++){
		gl.uniform1i(u_shading, shadingMode);
		tempMvpMatrix.set(mvpMatrix);
		tempModelMatrix.setIdentity();
		tempModelMatrix.translate(2*i-35,0.0,0.0);
		tempMvpMatrix.multiply(tempModelMatrix);
		tempNormalMatrix.setInverseOf(tempModelMatrix);
		tempNormalMatrix.transpose();
		gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
		gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
		gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
		gl.drawElements(gl.TRIANGLES, count, type, offset);
	}
}

function drawSphereComplex(gl, count, offset, type, mvpMatrix, modelMatrix, normalMatrix){
	// deal with lighting mode
	if (shadingMode == 3 || shadingMode == 1){
		gl.uniform4f(u_Color, 0.8, 0.0, 0.0, 1.0);
	}

	// set material as plastic red
	gl.uniform3fv(u_Ke, matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(u_Ka, matl0.K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(u_Kd, matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(u_Ks, matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(u_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny

	var tempMvpMatrix = new Matrix4();
	var tempModelMatrix = new Matrix4();
	var tempNormalMatrix = new Matrix4();
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.set(modelMatrix);
	// the first part
	tempModelMatrix.translate(0.0, 0.0, RADIUS);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	// this two uniform variables don't need change in this function
	gl.uniform1i(u_shading, shadingMode);
	gl.uniform4f(u_eyePosWorld, cameraValue[0],cameraValue[1], cameraValue[2], 1);
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, count, type, offset);
	// the second part
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.rotate(currentAngle, 0, -1, 0);
	tempModelMatrix.translate(RADIUS*2, 0.0, 0.0);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, count, type, offset);
	// the third part
	tempMvpMatrix.set(mvpMatrix);
	tempModelMatrix.rotate(currentAngle, 0, -1, 0);
	tempModelMatrix.translate(RADIUS*2, 0.0, 0.0);
	tempMvpMatrix.multiply(tempModelMatrix);
	tempNormalMatrix.setInverseOf(tempModelMatrix);
	tempNormalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, tempModelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, tempMvpMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, tempNormalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, count, type, offset);
}
// ------------------------------------------------- end of drawing process -------------------------------------------------

function initVertexBuffers(gl) { // Create a sphere
  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;
	var offset = [];
	var count = 0;

  var positions = [];
	var normals = []
  var indices = [];
	var drawCount = [];

  // Generate coordinates
	// firstly it is a ball
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV * RADIUS;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV * RADIUS;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj);  // X
      positions.push(cj);       // Y
      positions.push(ci * sj);  // Z
			count++;
    }
  }
	offset.push(count);
	normals = normals.concat(positions);
	// the second part is the world axis
	var axis = [-1.0, 35.0, 0.0,
							1.0, 35.0, 0.0,
							-1.0, -35.0, 0.0,
							1.0, -35.0,	0.0];
	positions = positions.concat(axis);
	for (i=0; i<axis.length/3; i++){
		normals.push(0.0);
		normals.push(0.0);
		normals.push(1.0);
	}
	offset.push(4);
	// next draw the cube
	var cube = [
		// v0 10
		1.0,	1.0,	1.0,
		1.0,  1.0,	1.0,
		1.0,  1.0,	1.0,
		// v1
		-1.0,	1.0,  1.0,
		-1.0,	1.0,  1.0,
		-1.0, 1.0,  1.0,
		// v2
		-1.0,-1.0, 1.0,
		-1.0,-1.0, 1.0,
		-1.0,-1.0, 1.0,
		// v3
		1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		// v4
		1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		// v5
		1.0, 	1.0, -1.0,
		1.0, 	1.0, -1.0,
		1.0,  1.0, -1.0,
		// v6
		-1.0, 1.0,-1.0,
		-1.0, 1.0,-1.0,
		-1.0, 1.0,-1.0,
		// v7
		-1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,]
		positions = positions.concat(cube);
		var cube_normal = [
			0.0,	0.0,	1.0,
			1.0,	0.0,	0.0,
			0.0,	1.0,	0.0,
			0.0,	0.0,	1.0,
			-1.0,	0.0,	0.0,
			0.0,	1.0,	0.0,
			0.0,	0.0,	1.0,
			-1.0,	0.0,	0.0,
			0.0,	-1.0,	0.0,
			0.0,	0.0,	1.0,
			1.0,	0.0,	0.0,
			0.0,	-1.0,	0.0,
			0.0,	0.0,	-1.0,
			1.0,	0.0,	0.0,
			0.0,	-1.0,	0.0,
			0.0,	0.0,	-1.0,
			1.0,	0.0,	0.0,
			0.0,	1.0,	0.0,
			0.0,	0.0,	-1.0,
			-1.0,	0.0,	0.0,
			0.0,	1.0,	0.0,
			0.0,	0.0,	-1.0,
			-1.0,	0.0,	0.0,
			0.0,	-1.0,	0.0,
		]
		normals = normals.concat(cube_normal);

  // Generate indices
	// the first part is a ball
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV+1) + i;
      p2 = p1 + (SPHERE_DIV+1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }
	drawCount.push(indices.length);
	// the second part is the axis
	axis = [0,1,2,	1,2,3,];
	for (i=0; i<axis.length; i++){
		axis[i]+=offset[0];
	}
	drawCount.push(axis.length);
	indices = indices.concat(axis);
	// next draw a cube
	cube =[
		10,	13, 16,		10, 16, 19, 		// top
		12, 15, 30,		12, 27, 30,			// back
		11, 20, 23,		11, 23, 26,			// right
		31, 28, 25,		31, 25, 22,			// bot
		33, 24, 21,		33, 21, 18,			// front
		32, 17, 14,		32,	29, 14,			// left
	]
	for (i=0; i<cube.length; i++){
		cube[i]=cube[i]-10+offset[0]+offset[1];
	}
	drawCount.push(cube.length);
	indices = indices.concat(cube);


  // Write the vertex property to buffers (coordinates and normals)
  // Use the same data for each vertex and its normal because the sphere is
  // centered at the origin, and has radius of 1.0.
  // We create two separate buffers so that you can modify normals if you wish.
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(normals), gl.FLOAT, 3))  return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return drawCount;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

// ---------------------------------- end of initialization -------------------------------------

// --------------------------------- animation --------------------------------------------------
var t_last = Date.now();
function animate(){
	var t_now = Date.now();
	var elapse = t_now - t_last;
	t_last = t_now;
	currentAngle = currentAngle + angleSpeed * elapse / 1000.0;
	if (currentAngle>90 || currentAngle<0){
		angleSpeed = -angleSpeed;
		currentAngle = currentAngle + 2 * angleSpeed * elapse / 1000.0;
	}
}

function updateUserLight(){
	var UserLightElements = document.getElementsByName('userL');
	var i;
	for(i=0; i<UserLightElements.length; i++){
		UserLightValue[i] = UserLightElements[i].value;
	}
}

function changeShadingMode(){
	shadingMode = parseInt(document.getElementById('modeSelection').value);
}
