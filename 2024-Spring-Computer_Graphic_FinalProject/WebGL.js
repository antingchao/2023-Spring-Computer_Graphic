var VSHADER_SOURCE_ENVCUBE = `
  attribute vec4 a_Position;
  varying vec4 v_Position;
  void main() {
    v_Position = a_Position;
    gl_Position = a_Position;
  } 
`;

var FSHADER_SOURCE_ENVCUBE = `
  precision mediump float;
  uniform samplerCube u_envCubeMap;
  uniform mat4 u_viewDirectionProjectionInverse;
  varying vec4 v_Position;
  void main() {
    vec4 t = u_viewDirectionProjectionInverse * v_Position;
    gl_FragColor = textureCube(u_envCubeMap, normalize(t.xyz / t.w));
  }
`;


var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;
    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_PositionInWorld = (u_modelMatrix * a_Position).xyz; 
        v_Normal = normalize(vec3(u_normalMatrix * a_Normal));
        // gl_Position  = vec4(0.0,0.0,0.0,1.0);
        // gl_PointSize = 10.0;
    }    
`;

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec3 u_LightPosition;
    uniform vec3 u_ViewPosition;
    uniform float u_Ka;
    uniform float u_Kd;
    uniform float u_Ks;
    uniform vec3 u_Color;
    uniform float u_shininess;
    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    void main(){
        // (you can also input them from ouside and make them different)
        vec3 ambientLightColor = u_Color.rgb;
        vec3 diffuseLightColor = u_Color.rgb;
        // assume white specular light (you can also input it from ouside)
        vec3 specularLightColor = vec3(1.0, 1.0, 1.0);        

        vec3 ambient = ambientLightColor * u_Ka;

        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_PositionInWorld);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = diffuseLightColor * u_Kd * nDotL;

        vec3 specular = vec3(0.0, 0.0, 0.0);
        if(nDotL > 0.0) {
            vec3 R = reflect(-lightDirection, normal);
            // V: the vector, point to viewer       
            vec3 V = normalize(u_ViewPosition - v_PositionInWorld); 
            float specAngle = clamp(dot(R, V), 0.0, 1.0);
            specular = u_Ks * pow(specAngle, u_shininess) * specularLightColor; 
        }

        gl_FragColor = vec4( ambient + diffuse + specular, 1.0 );
    }
`;

var VSHADER_SOURCE_TEXTURE_ON_CUBE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_modelMatrix;
  uniform mat4 u_normalMatrix;
  varying vec4 v_TexCoord;
  varying vec3 v_Normal;
  varying vec3 v_PositionInWorld;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_Position;
    v_PositionInWorld = (u_modelMatrix * a_Position).xyz; 
    v_Normal = normalize(vec3(u_normalMatrix * a_Normal));
  } 
`;

var FSHADER_SOURCE_TEXTURE_ON_CUBE = `
  precision mediump float;
  varying vec4 v_TexCoord;
  uniform vec3 u_ViewPosition;
  uniform vec3 u_Color;
  uniform samplerCube u_envCubeMap;
  varying vec3 v_Normal;
  varying vec3 v_PositionInWorld;
  void main() {
    vec3 V = normalize(u_ViewPosition - v_PositionInWorld); 
    vec3 normal = normalize(v_Normal);
    vec3 R = reflect(-V, normal);
    gl_FragColor = vec4(0.78 * textureCube(u_envCubeMap, R).rgb + 0.3 * u_Color, 1.0);
  }
`;

var VSHADER_SOURCE_ENVCUBE_TEXTOBJ = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    attribute vec2 a_TexCoord; 

    uniform mat4 u_MvpMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;

    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    varying vec2 v_TexCoord; 

    void main() {
      gl_Position = u_MvpMatrix * a_Position;
      v_PositionInWorld = vec3(u_modelMatrix * a_Position);
      v_Normal = normalize(vec3(u_normalMatrix * a_Normal));
      v_TexCoord = a_TexCoord; 
    }
`;

var FSHADER_SOURCE_TEXTOBJ = `
    precision mediump float;

    uniform vec3 u_LightPosition;
    uniform vec3 u_ViewPosition;
    uniform float u_Ka;
    uniform float u_Kd;
    uniform float u_Ks;
    uniform float u_shininess;
    uniform sampler2D u_Sampler0; 

    varying vec3 v_Normal;
    varying vec3 v_PositionInWorld;
    varying vec2 v_TexCoord; 

    void main() {
      // let ambient and diffuse color are u_Color 
      // (you can also input them from ouside and make them different)
      vec3 texColor = texture2D( u_Sampler0, v_TexCoord ).rgb;
      vec3 ambientLightColor = texColor;
      vec3 diffuseLightColor = texColor;
      // assume white specular light (you can also input it from ouside)
      vec3 specularLightColor = vec3(1.0, 1.0, 1.0);        

      vec3 ambient = ambientLightColor * u_Ka;

      vec3 normal = normalize(v_Normal);
      vec3 lightDirection = normalize(u_LightPosition - v_PositionInWorld);
      float nDotL = max(dot(lightDirection, normal), 0.0);
      vec3 diffuse = diffuseLightColor * u_Kd * nDotL;

      vec3 specular = vec3(0.0, 0.0, 0.0);
      if(nDotL > 0.0) {
          vec3 R = reflect(-lightDirection, normal);
          // V: the vector, point to viewer       
          vec3 V = normalize(u_ViewPosition - v_PositionInWorld); 
          float specAngle = clamp(dot(R, V), 0.0, 1.0);
          specular = u_Ks * pow(specAngle, u_shininess) * specularLightColor; 
      }

      gl_FragColor = vec4( ambient + diffuse + specular, 1.0 );
    }

`;

var VSHADER_SOURCE_BUMP = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_Normal;
    
    attribute vec3 a_Tagent;
    attribute vec3 a_Bitagent;
    attribute float a_crossTexCoord;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;
    varying vec3 v_PositionInWorld;
    varying vec2 v_TexCoord;
    varying mat4 v_TBN;
    varying vec3 v_Normal;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_PositionInWorld = (u_modelMatrix * a_Position).xyz; 
        v_Normal = normalize(vec3(u_normalMatrix * a_Normal));
        v_TexCoord = a_TexCoord;
        //create TBN matrix 
        vec3 tagent = normalize(a_Tagent);
        vec3 bitagent = normalize(a_Bitagent);
        vec3 nVector;
        if( a_crossTexCoord > 0.0){
          nVector = cross(tagent, bitagent);
        } else{
          nVector = cross(bitagent, tagent);
        }
        v_TBN = mat4(tagent.x, tagent.y, tagent.z, 0.0, 
                           bitagent.x, bitagent.y, bitagent.z, 0.0,
                           nVector.x, nVector.y, nVector.z, 0.0, 
                           0.0, 0.0, 0.0, 1.0);
    }    
`;

var FSHADER_SOURCE_BUMP = `
    precision mediump float;
    uniform vec3 u_LightPosition;
    uniform vec3 u_ViewPosition;
    uniform float u_Ka;
    uniform float u_Kd;
    uniform float u_Ks;
    uniform vec3 u_Color;
    uniform float u_shininess;
    uniform sampler2D u_Sampler0;
    uniform highp mat4 u_normalMatrix;
    varying vec3 v_PositionInWorld;
    varying vec2 v_TexCoord;
    varying mat4 v_TBN;
    varying vec3 v_Normal;
    void main(){
        // (you can also input them from ouside and make them different)
        vec3 ambientLightColor = u_Color.rgb;
        vec3 diffuseLightColor = u_Color.rgb;
        // assume white specular light (you can also input it from ouside)
        vec3 specularLightColor = vec3(1.0, 1.0, 1.0);        

        vec3 ambient = ambientLightColor * u_Ka;

        //normal vector from normal map
        vec3 nMapNormal = normalize( texture2D( u_Sampler0, v_TexCoord ).rgb * 2.0 - 1.0 );
        vec3 normal = normalize( vec3( u_normalMatrix * v_TBN * vec4( nMapNormal, 1.0) ) );
        
        vec3 lightDirection = normalize(u_LightPosition - v_PositionInWorld);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = diffuseLightColor * u_Kd * nDotL;

        vec3 specular = vec3(0.0, 0.0, 0.0);
        if(nDotL > 0.0) {
            vec3 R = reflect(-lightDirection, normal);
    
            vec3 V = normalize(u_ViewPosition - v_PositionInWorld); 
            float specAngle = clamp(dot(R, V), 0.0, 1.0);
            specular = u_Ks * pow(specAngle, u_shininess) * specularLightColor; 
        }

        gl_FragColor = vec4( ambient + diffuse + specular, 1.0 );
    }
`;

function compileShader(gl, vShaderText, fShaderText){
    //////Build vertex and fragment shader objects
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    //The way to  set up shader text source
    gl.shaderSource(vertexShader, vShaderText)
    gl.shaderSource(fragmentShader, fShaderText)
    //compile vertex shader
    gl.compileShader(vertexShader)
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.log('vertex shader ereror');
        var message = gl.getShaderInfoLog(vertexShader); 
        console.log(message);//print shader compiling error message
    }
    //compile fragment shader
    gl.compileShader(fragmentShader)
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log('fragment shader ereror');
        var message = gl.getShaderInfoLog(fragmentShader);
        console.log(message);//print shader compiling error message
    }

    /////link shader to program (by a self-define function)
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    //if not success, log the program info, and delete it.
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert(gl.getProgramInfoLog(program) + "");
        gl.deleteProgram(program);
    }

    return program;
}



/////BEGIN:///////////////////////////////////////////////////////////////////////////////////////////////
/////The folloing three function is for creating vertex buffer, but link to shader to user later//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function initAttributeVariable(gl, a_attribute, buffer){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function initArrayBufferForLaterUse(gl, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initVertexBufferForLaterUse(gl, vertices, normals, texCoords){
  var nVertices = vertices.length / 3;

  var o = new Object();
  o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
  if( normals != null ) o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
  if( texCoords != null ) o.texCoordBuffer = initArrayBufferForLaterUse(gl, new Float32Array(texCoords), 2, gl.FLOAT);
  //you can have error check here
  o.numVertices = nVertices;

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function initVertexBufferForLaterUse(gl, vertices, normals, texCoords, tagents, bitagents, crossTexCoords){
  var nVertices = vertices.length / 3;

  var o = new Object();
  o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
  if( normals != null ) o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
  if( texCoords != null ) o.texCoordBuffer = initArrayBufferForLaterUse(gl, new Float32Array(texCoords), 2, gl.FLOAT);
  if( tagents != null ) o.tagentsBuffer = initArrayBufferForLaterUse(gl, new Float32Array(tagents), 3, gl.FLOAT);
  if( bitagents != null ) o.bitagentsBuffer = initArrayBufferForLaterUse(gl, new Float32Array(bitagents), 3, gl.FLOAT);
  if( crossTexCoords != null ) o.crossTexCoordsBuffer = initArrayBufferForLaterUse(gl, new Float32Array(crossTexCoords), 1, gl.FLOAT);
  //you can have error check here
  o.numVertices = nVertices;

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}
/////END://///////////////////////////////////////////////////////////////////////////////////////////////
/////The folloing three function is for creating vertex buffer, but link to shader to user later//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
var first_view = 1; // 0: 3rd view, 1: 1st view
var mouseLastX, mouseLastY;
var mouseDragging = false;
var angleX = 0, angleY = 0;
var gl, canvas;
var modelMatrix;
var nVertex;
var cameraX = 0, cameraY = 1, cameraZ = 7;
var cameraX_fix = 0, cameraY_fix = 1, cameraZ_fix = 9;
var cameraDirX = 0, cameraDirY = 0, cameraDirZ = -1;
var lightX = 5, lightY = 1, lightZ = 7;
var cubeMapTex;
var quadObj;
var sphereObj;
var earthObj;
var planetObj;
var rotateAngle = 0;
var fbo;
var offScreenWidth = 256, offScreenHeight = 256; //for cubemap render
// spaceman spmanMatrix.translate(0, -1, 7)
var spacemanX = 0
var spacemanY = -1
var spacemanZ = 14
var spmanScale = 0.3
// texture
var textures = {};
var texname=["earthText", "spmanText", "sunText", "bumpMap"];
// var objCompImgIndex = ["earthText.jpg"];
var texCount = 0;
var numTextures = 1; 

async function main(){
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl2');
  if(!gl){
      console.log('Failed to get the rendering context for WebGL');
      return ;
  }

  sphereObj = await loadOBJtoCreateVBO('sphere.obj');
  planetObj = await loadOBJtoCreateVBO('football.obj');

  earthObj = await loadOBJtoCreateVBO('earth.obj');

  spacemanObj = await loadOBJtoCreateVBO('astronout.obj');
  bumpObj = await loadOBJtoCreateVBOBump('venus.obj');
  //quadObj = await loadOBJtoCreateVBO('quad.obj');

  program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  program.a_Position = gl.getAttribLocation(program, 'a_Position'); 
  program.a_Normal = gl.getAttribLocation(program, 'a_Normal'); 
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix'); 
  program.u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix'); 
  program.u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix');
  program.u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
  program.u_ViewPosition = gl.getUniformLocation(program, 'u_ViewPosition');
  program.u_Ka = gl.getUniformLocation(program, 'u_Ka'); 
  program.u_Kd = gl.getUniformLocation(program, 'u_Kd');
  program.u_Ks = gl.getUniformLocation(program, 'u_Ks');
  program.u_Color = gl.getUniformLocation(program, 'u_Color');
  program.u_shininess = gl.getUniformLocation(program, 'u_shininess');

  programTextureOnCube = compileShader(gl, VSHADER_SOURCE_TEXTURE_ON_CUBE, FSHADER_SOURCE_TEXTURE_ON_CUBE);
  programTextureOnCube.a_Position = gl.getAttribLocation(programTextureOnCube, 'a_Position'); 
  programTextureOnCube.a_Normal = gl.getAttribLocation(programTextureOnCube, 'a_Normal'); 
  programTextureOnCube.u_MvpMatrix = gl.getUniformLocation(programTextureOnCube, 'u_MvpMatrix'); 
  programTextureOnCube.u_modelMatrix = gl.getUniformLocation(programTextureOnCube, 'u_modelMatrix'); 
  programTextureOnCube.u_normalMatrix = gl.getUniformLocation(programTextureOnCube, 'u_normalMatrix');
  programTextureOnCube.u_ViewPosition = gl.getUniformLocation(programTextureOnCube, 'u_ViewPosition');
  programTextureOnCube.u_envCubeMap = gl.getUniformLocation(programTextureOnCube, 'u_envCubeMap'); 
  programTextureOnCube.u_Color = gl.getUniformLocation(programTextureOnCube, 'u_Color'); 

  programExObj = compileShader(gl, VSHADER_SOURCE_ENVCUBE_TEXTOBJ, FSHADER_SOURCE_TEXTOBJ);
  programExObj.a_Position = gl.getAttribLocation(programExObj, 'a_Position'); 
  programExObj.a_TexCoord = gl.getAttribLocation(programExObj, 'a_TexCoord'); 
  programExObj.a_Normal = gl.getAttribLocation(programExObj, 'a_Normal'); 
  programExObj.u_MvpMatrix = gl.getUniformLocation(programExObj, 'u_MvpMatrix'); 
  programExObj.u_modelMatrix = gl.getUniformLocation(programExObj, 'u_modelMatrix'); 
  programExObj.u_normalMatrix = gl.getUniformLocation(programExObj, 'u_normalMatrix');
  programExObj.u_LightPosition = gl.getUniformLocation(programExObj, 'u_LightPosition');
  programExObj.u_ViewPosition = gl.getUniformLocation(programExObj, 'u_ViewPosition');
  programExObj.u_Ka = gl.getUniformLocation(programExObj, 'u_Ka'); 
  programExObj.u_Kd = gl.getUniformLocation(programExObj, 'u_Kd');
  programExObj.u_Ks = gl.getUniformLocation(programExObj, 'u_Ks');
  programExObj.u_shininess = gl.getUniformLocation(programExObj, 'u_shininess');
  programExObj.u_Sampler0 = gl.getUniformLocation(programExObj, "u_Sampler0")

  programBump = compileShader(gl, VSHADER_SOURCE_BUMP, FSHADER_SOURCE_BUMP);
  programBump.a_Position = gl.getAttribLocation(programBump, 'a_Position'); 
  programBump.a_Normal = gl.getAttribLocation(programBump, 'a_Normal'); 
  programBump.a_TexCoord = gl.getAttribLocation(programBump, 'a_TexCoord'); 
  programBump.a_Tagent = gl.getAttribLocation(programBump, 'a_Tagent'); 
  programBump.a_Bitagent = gl.getAttribLocation(programBump, 'a_Bitagent'); 
  programBump.a_crossTexCoord = gl.getAttribLocation(programBump, 'a_crossTexCoord'); 
  programBump.u_MvpMatrix = gl.getUniformLocation(programBump, 'u_MvpMatrix'); 
  programBump.u_modelMatrix = gl.getUniformLocation(programBump, 'u_modelMatrix'); 
  programBump.u_normalMatrix = gl.getUniformLocation(programBump, 'u_normalMatrix');
  programBump.u_LightPosition = gl.getUniformLocation(programBump, 'u_LightPosition');
  programBump.u_ViewPosition = gl.getUniformLocation(programBump, 'u_ViewPosition');
  programBump.u_Ka = gl.getUniformLocation(programBump, 'u_Ka'); 
  programBump.u_Kd = gl.getUniformLocation(programBump, 'u_Kd');
  programBump.u_Ks = gl.getUniformLocation(programBump, 'u_Ks');
  programBump.u_Color = gl.getUniformLocation(programBump, 'u_Color');
  programBump.u_shininess = gl.getUniformLocation(programBump, 'u_shininess');
  programBump.u_Sampler0 = gl.getUniformLocation(programBump, 'u_Sampler0');  
  

  fbo = initFrameBufferForCubemapRendering(gl);


  // for cubemap
  var quad = new Float32Array(
    [
      -1, -1, 1,
       1, -1, 1,
      -1,  1, 1,
      -1,  1, 1,
       1, -1, 1,
       1,  1, 1
    ]); //just a quad
  programEnvCube = compileShader(gl, VSHADER_SOURCE_ENVCUBE, FSHADER_SOURCE_ENVCUBE);
  programEnvCube.a_Position = gl.getAttribLocation(programEnvCube, 'a_Position'); 
  programEnvCube.u_envCubeMap = gl.getUniformLocation(programEnvCube, 'u_envCubeMap'); 
  programEnvCube.u_viewDirectionProjectionInverse = 
          gl.getUniformLocation(programEnvCube, 'u_viewDirectionProjectionInverse'); 

  quadObj = initVertexBufferForLaterUse(gl, quad);

  cubeMapTex = initCubeTexture("up.jpg", "up.jpg", "up.jpg", "up.jpg", 
                                    "up.jpg", "up.jpg", 638, 638)


  // load texture      
  let earthText = new Image();
  earthText.onload = function(){initTexture(gl, earthText, "earthText");};
  earthText.src = "earthText.jpg";

  let spmanText = new Image();
  spmanText.onload = function(){initTexture(gl, spmanText, "spmanText");};
  spmanText.src = "metal.jpg";

  let sunText = new Image();
  sunText.onload = function(){initTexture(gl, sunText, "sunText");};
  sunText.src = "sunText.jpg";

  var bumpMap = new Image();
  bumpMap.onload = function(){initTexture(gl, bumpMap, "bumpMap");};
  bumpMap.src = "bumpMap2.jpg"; 
  

  gl.enable(gl.DEPTH_TEST);


  canvas.onmousedown = function(ev){mouseDown(ev)};
  canvas.onmousemove = function(ev){mouseMove(ev)};
  canvas.onmouseup = function(ev){mouseUp(ev)};
  document.onkeydown = function(ev){keydown(ev)};

  var tick = function() {
    rotateAngle += 0.45;
    draw();
    requestAnimationFrame(tick);
  }
  tick();
}

function drawEnvMap(){
  gl.clearColor(0.4,0.4,0.4,1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);


  let rotateMatrix = new Matrix4();
  rotateMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
  rotateMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
  var viewDir= new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
  var newViewDir = rotateMatrix.multiplyVector3(viewDir);

  var vpFromCamera = new Matrix4();
  vpFromCamera.setPerspective(60, 1, 1, 15);
  var viewMatrixRotationOnly = new Matrix4();
  if(first_view){
    viewMatrixRotationOnly.lookAt(cameraX, cameraY, cameraZ, 
                                  cameraX + newViewDir.elements[0], 
                                  cameraY + newViewDir.elements[1], 
                                  cameraZ + newViewDir.elements[2], 
                                  0, 1, 0);
  }else{
    viewMatrixRotationOnly.lookAt(cameraX_fix, cameraY_fix, cameraZ_fix, 
      0, 0, 0, 
                    0, 1, 0);
  }
  
  viewMatrixRotationOnly.elements[12] = 0; //ignore translation
  viewMatrixRotationOnly.elements[13] = 0;
  viewMatrixRotationOnly.elements[14] = 0;
  vpFromCamera.multiply(viewMatrixRotationOnly);
  var vpFromCameraInverse = vpFromCamera.invert();

  //quad
  gl.useProgram(programEnvCube);
  gl.depthFunc(gl.LEQUAL);
  gl.uniformMatrix4fv(programEnvCube.u_viewDirectionProjectionInverse, 
                      false, vpFromCameraInverse.elements);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTex);
  gl.uniform1i(programEnvCube.u_envCubeMap, 0);
  initAttributeVariable(gl, programEnvCube.a_Position, quadObj.vertexBuffer);
  gl.drawArrays(gl.TRIANGLES, 0, quadObj.numVertices);
}

function draw(){
  // environment cube
  drawEnvMap(); 
  renderCubeMap(0, 0, 0);

  gl.useProgram(program);
  gl.viewport(0, 0, canvas.width, canvas.height);

  let rotateMatrix = new Matrix4();
  rotateMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
  rotateMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
  var viewDir= new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
  var newViewDir = rotateMatrix.multiplyVector3(viewDir);
  let vpMatrix = new Matrix4();
  vpMatrix.setPerspective(70, 1, 1, 100);
  if(first_view){
    vpMatrix.lookAt(cameraX, cameraY, cameraZ,   
                    cameraX + newViewDir.elements[0], 
                    cameraY + newViewDir.elements[1],
                    cameraZ + newViewDir.elements[2], 
                    0, 1, 0);
  }else{
    vpMatrix.lookAt(cameraX_fix, cameraY_fix, cameraZ_fix,   
      0, 0, 0, 
      0, 1, 0);
  }
  
  // planets
  drawRegularObjects(vpMatrix);

  //the sphere
  let mdlMatrix = new Matrix4();
  mdlMatrix.setScale(0.5, 0.5, 0.5);
  drawObjectWithDynamicReflection(sphereObj, mdlMatrix, vpMatrix, 0.95, 0.85, 0.4);

  // spaceman
  let spmanMatrix = new Matrix4();

  let spacemanRotateMatrix = new Matrix4();
  spacemanRotateMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
  spacemanRotateMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
  var viewDir= new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
  var newViewDir = spacemanRotateMatrix.multiplyVector3(viewDir);

  spmanMatrix.setScale(spmanScale, spmanScale, spmanScale);
  spmanMatrix.translate(spacemanX, spacemanY, spacemanZ)
  spmanMatrix.rotate(90, 0, 1, 0);
  spmanMatrix.rotate(-newViewDir.elements[0]*50, 0, 1, 0);
  drawOneRegularObjectText(spacemanObj, spmanMatrix, vpMatrix, 1);
}

function drawRegularObjects(vpMatrix){
  let mdlMatrix = new Matrix4();

  mdlMatrix.setRotate(rotateAngle*0.7, 0, 1, 0);
  mdlMatrix.translate(-4.0, -0.5, 2.0);
  mdlMatrix.scale(1.5, 1.5, 1.5);
  drawOneRegularObjectText(planetObj, mdlMatrix, vpMatrix, 2);

  mdlMatrix.setRotate(rotateAngle, 0, 1, 0);
  mdlMatrix.translate(2.5, 0, 1.5);
  mdlMatrix.scale(0.5, 0.5,0.5);
  drawOneRegularObjectText(earthObj, mdlMatrix, vpMatrix, 0);

  mdlMatrix.rotate(rotateAngle*1.5, 0, 1, 0);
  mdlMatrix.translate(2, 0, 1.5);
  mdlMatrix.scale(0.5, 0.5,0.5);
  drawOneRegularObjectBump(bumpObj, mdlMatrix, vpMatrix, 3);
  
}

function drawOneRegularObject(obj, modelMatrix, vpMatrix, colorR, colorG, colorB){
  gl.useProgram(program);
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();
  mvpMatrix.set(vpMatrix);
  mvpMatrix.multiply(modelMatrix);

  //normal matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniform3f(program.u_LightPosition, lightX, lightY, lightZ);
  gl.uniform3f(program.u_ViewPosition, cameraX, cameraY, cameraZ);
  gl.uniform1f(program.u_Ka, 0.2);
  gl.uniform1f(program.u_Kd, 0.7);
  gl.uniform1f(program.u_Ks, 1.0);
  gl.uniform1f(program.u_shininess, 10.0);
  gl.uniform3f(program.u_Color, colorR, colorG, colorB);

  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(program.u_modelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(program.u_normalMatrix, false, normalMatrix.elements);

  for( let i=0; i < obj.length; i ++ ){
    initAttributeVariable(gl, program.a_Position, obj[i].vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, obj[i].normalBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }
}

function drawOneRegularObjectText(obj, lmodelMatrix, vpMatrix, idx){
  gl.useProgram(programExObj);
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();
  mvpMatrix.set(vpMatrix);
  mvpMatrix.multiply(lmodelMatrix);

  //normal matrix
  normalMatrix.setInverseOf(lmodelMatrix);
  normalMatrix.transpose();

  gl.uniform3f(programExObj.u_LightPosition, lightX, lightY, lightZ);
  gl.uniform3f(programExObj.u_ViewPosition, cameraX, cameraY, cameraZ);
  gl.uniform1f(programExObj.u_Ka, 0.2);
  gl.uniform1f(programExObj.u_Kd, 0.7);
  gl.uniform1f(programExObj.u_Ks, 1.0);
  gl.uniform1f(programExObj.u_shininess, 10.0);
  // gl.uniform3f(program.u_Color, colorR, colorG, colorB);
  gl.uniform1i(programExObj.u_Sampler0, 0);

  gl.uniformMatrix4fv(programExObj.u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(programExObj.u_modelMatrix, false, lmodelMatrix.elements);
  gl.uniformMatrix4fv(programExObj.u_normalMatrix, false, normalMatrix.elements);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[texname[idx]]);
  
  for( let i=0; i < obj.length; i ++ ){
    initAttributeVariable(gl, programExObj.a_Position, obj[i].vertexBuffer);
    initAttributeVariable(gl, programExObj.a_TexCoord, obj[i].texCoordBuffer);
    initAttributeVariable(gl, programExObj.a_Normal, obj[i].normalBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }
}

function drawOneRegularObjectBump(obj, lmodelMatrix, vpMatrix, idx){
  gl.useProgram(programBump);
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();
  mvpMatrix.set(vpMatrix);
  mvpMatrix.multiply(lmodelMatrix);

  //normal matrix
  normalMatrix.setInverseOf(lmodelMatrix);
  normalMatrix.transpose();

  gl.uniform3f(programBump.u_LightPosition, lightX, lightY, lightZ);
  gl.uniform3f(programBump.u_ViewPosition, cameraX, cameraY, cameraZ);
  gl.uniform1f(programBump.u_Ka, 0.2);
  gl.uniform1f(programBump.u_Kd, 0.7);
  gl.uniform1f(programBump.u_Ks, 1.0);
  gl.uniform1f(programBump.u_shininess, 10.0);
  // gl.uniform3f(program.u_Color, colorR, colorG, colorB);
  gl.uniform1i(programBump.u_Sampler0, 0);
  gl.uniform1i(programBump.u_Sampler1, 1);

  gl.uniformMatrix4fv(programBump.u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(programBump.u_modelMatrix, false, lmodelMatrix.elements);
  gl.uniformMatrix4fv(programBump.u_normalMatrix, false, normalMatrix.elements);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[texname[idx]]);
  
  for( let i=0; i < obj.length; i ++ ){
    
    initAttributeVariable(gl, programBump.a_Position, obj[i].vertexBuffer);
    initAttributeVariable(gl, programBump.a_Normal, obj[i].normalBuffer);
    initAttributeVariable(gl, programBump.a_TexCoord, obj[i].texCoordBuffer);
    initAttributeVariable(gl, programBump.a_Tagent, obj[i].tagentsBuffer);
    initAttributeVariable(gl, programBump.a_Bitagent, obj[i].bitagentsBuffer);
    initAttributeVariable(gl, programBump.a_crossTexCoord, obj[i].crossTexCoordsBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }
}

function drawObjectWithDynamicReflection(obj, modelMatrix, vpMatrix, colorR, colorG, colorB){
  gl.useProgram(programTextureOnCube);
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();
  mvpMatrix.set(vpMatrix);
  mvpMatrix.multiply(modelMatrix);

  //normal matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniform3f(programTextureOnCube.u_ViewPosition, cameraX, cameraY, cameraZ);
  gl.uniform3f(programTextureOnCube.u_Color, colorR, colorG, colorB);

  gl.uniformMatrix4fv(programTextureOnCube.u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(programTextureOnCube.u_modelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(programTextureOnCube.u_normalMatrix, false, normalMatrix.elements);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, fbo.texture);
  gl.uniform1i(programTextureOnCube.u_envCubeMap, 0);

  for( let i=0; i < obj.length; i ++ ){
    initAttributeVariable(gl, programTextureOnCube.a_Position, obj[i].vertexBuffer);
    initAttributeVariable(gl, programTextureOnCube.a_Normal, obj[i].normalBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
  }
}

async function loadOBJtoCreateVBO( objFile ){
  let objComponents = [];
  response = await fetch(objFile);
  text = await response.text();
  obj = parseOBJ(text);
  for( let i=0; i < obj.geometries.length; i ++ ){
    let o = initVertexBufferForLaterUse(gl, 
                                        obj.geometries[i].data.position,
                                        obj.geometries[i].data.normal, 
                                        obj.geometries[i].data.texcoord);
    objComponents.push(o);
  }
  return objComponents;
}

async function loadOBJtoCreateVBOBump( objFile ){
  let objComponents = [];
  response = await fetch(objFile);
  text = await response.text();
  obj = parseOBJ(text);
  for( let i=0; i < obj.geometries.length; i ++ ){
    let tagentSpace = calculateTangentSpace(obj.geometries[i].data.position, 
                                            obj.geometries[i].data.texcoord);
    let o = initVertexBufferForLaterUse(gl, 
                                        obj.geometries[i].data.position,
                                        obj.geometries[i].data.normal, 
                                        obj.geometries[i].data.texcoord,
                                        tagentSpace.tagents,
                                        tagentSpace.bitagents,
                                        tagentSpace.crossTexCoords);
    objComponents.push(o);
  }
  return objComponents;
}

function calculateTangentSpace(position, texcoord){
  //iterate through all triangles
  let tagents = [];
  let bitagents = [];
  let crossTexCoords = [];
  for( let i = 0; i < position.length/9; i++ ){
    let v00 = position[i*9 + 0];
    let v01 = position[i*9 + 1];
    let v02 = position[i*9 + 2];
    let v10 = position[i*9 + 3];
    let v11 = position[i*9 + 4];
    let v12 = position[i*9 + 5];
    let v20 = position[i*9 + 6];
    let v21 = position[i*9 + 7];
    let v22 = position[i*9 + 8];
    let uv00 = texcoord[i*6 + 0];
    let uv01 = texcoord[i*6 + 1];
    let uv10 = texcoord[i*6 + 2];
    let uv11 = texcoord[i*6 + 3];
    let uv20 = texcoord[i*6 + 4];
    let uv21 = texcoord[i*6 + 5];

    let deltaPos10 = v10 - v00;
    let deltaPos11 = v11 - v01;
    let deltaPos12 = v12 - v02;
    let deltaPos20 = v20 - v00;
    let deltaPos21 = v21 - v01;
    let deltaPos22 = v22 - v02;

    let deltaUV10 = uv10 - uv00;
    let deltaUV11 = uv11 - uv01;
    let deltaUV20 = uv20 - uv00;
    let deltaUV21 = uv21 - uv01;

    let r = 1.0 / (deltaUV10 * deltaUV21 - deltaUV11 * deltaUV20);
    for( let j=0; j< 3; j++ ){
      crossTexCoords.push( (deltaUV10 * deltaUV21 - deltaUV11 * deltaUV20) );
    }
    let tangentX = (deltaPos10 * deltaUV21 - deltaPos20 * deltaUV11)*r;
    let tangentY = (deltaPos11 * deltaUV21 - deltaPos21 * deltaUV11)*r;
    let tangentZ = (deltaPos12 * deltaUV21 - deltaPos22 * deltaUV11)*r;
    for( let j = 0; j < 3; j++ ){
      tagents.push(tangentX);
      tagents.push(tangentY);
      tagents.push(tangentZ);
    }
    let bitangentX = (deltaPos20 * deltaUV10 - deltaPos10 * deltaUV20)*r;
    let bitangentY = (deltaPos21 * deltaUV10 - deltaPos11 * deltaUV20)*r;
    let bitangentZ = (deltaPos22 * deltaUV10 - deltaPos12 * deltaUV20)*r;
    for( let j = 0; j < 3; j++ ){
      bitagents.push(bitangentX);
      bitagents.push(bitangentY);
      bitagents.push(bitangentZ);
    }
  }
  let obj = {};
  obj['tagents'] = tagents;
  obj['bitagents'] = bitagents;
  obj['crossTexCoords'] = crossTexCoords;
  return obj;
}

function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];

  const materialLibs = [];
  const geometries = [];
  let geometry;
  let groups = ['default'];
  let material = 'default';
  let object = 'default';

  const noop = () => {};

  function newGeometry() {
    // If there is an existing geometry and it's
    // not empty then start a new one.
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
  }

  function setGeometry() {
    if (!geometry) {
      const position = [];
      const texcoord = [];
      const normal = [];
      webglVertexData = [
        position,
        texcoord,
        normal,
      ];
      geometry = {
        object,
        groups,
        material,
        data: {
          position,
          texcoord,
          normal,
        },
      };
      geometries.push(geometry);
    }
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop,    // smoothing group
    mtllib(parts, unparsedArgs) {
      // the spec says there can be multiple filenames here
      // but many exist with spaces in a single filename
      materialLibs.push(unparsedArgs);
    },
    usemtl(parts, unparsedArgs) {
      material = unparsedArgs;
      newGeometry();
    },
    g(parts) {
      groups = parts;
      newGeometry();
    },
    o(parts, unparsedArgs) {
      object = unparsedArgs;
      newGeometry();
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  // remove any arrays that have no entries.
  for (const geometry of geometries) {
    geometry.data = Object.fromEntries(
        Object.entries(geometry.data).filter(([, array]) => array.length > 0));
  }

  return {
    geometries,
    materialLibs,
  };
}

function mouseDown(ev){ 
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
        mouseLastX = x;
        mouseLastY = y;
        mouseDragging = true;
    }
}

function mouseUp(ev){ 
    mouseDragging = false;
}

function mouseMove(ev){ 
    var x = ev.clientX;
    var y = ev.clientY;
    if( mouseDragging ){
        var factor = 100/canvas.height; //100 determine the spped you rotate the object
        var dx = factor * (x - mouseLastX);
        var dy = factor * (y - mouseLastY);

        angleX += dx; //yes, x for y, y for x, this is right
        angleY += dy;
    }
    mouseLastX = x;
    mouseLastY = y;

    draw();
}

function initCubeTexture(posXName, negXName, posYName, negYName, 
  posZName, negZName, imgWidth, imgHeight){
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
  {
  target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
  fName: posXName,
  },
  {
  target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
  fName: negXName,
  },
  {
  target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
  fName: posYName,
  },
  {
  target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
  fName: negYName,
  },
  {
  target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
  fName: posZName,
  },
  {
  target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
  fName: negZName,
  },
  ];
  faceInfos.forEach((faceInfo) => {
  const {target, fName} = faceInfo;
  // setup each face so it's immediately renderable
  gl.texImage2D(target, 0, gl.RGBA, imgWidth, imgHeight, 0, 
  gl.RGBA, gl.UNSIGNED_BYTE, null);

  var image = new Image();
  image.onload = function(){
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  };
  image.src = fName;
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  return texture;
}

function keydown(ev){ 
  //implment keydown event here
  let rotateMatrix = new Matrix4();
  rotateMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
  rotateMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
  var viewDir= new Vector3([cameraDirX, cameraDirY, cameraDirZ]);
  var newViewDir = rotateMatrix.multiplyVector3(viewDir);

  if(ev.key == 'w'){ 
      cameraX += (newViewDir.elements[0] * 0.1);
      cameraY += (newViewDir.elements[1] * 0.1);
      cameraZ += (newViewDir.elements[2] * 0.1);
      // move !!!
      spacemanX += (newViewDir.elements[0] * 0.1 / spmanScale);
      spacemanY += (newViewDir.elements[1] * 0.1 / spmanScale);
      spacemanZ += (newViewDir.elements[2] * 0.1 / spmanScale);
  }
  else if(ev.key == 's'){ 
    cameraX -= (newViewDir.elements[0] * 0.1);
    cameraY -= (newViewDir.elements[1] * 0.1);
    cameraZ -= (newViewDir.elements[2] * 0.1);
    spacemanX -= (newViewDir.elements[0] * 0.1 / spmanScale);
    spacemanY -= (newViewDir.elements[1] * 0.1 / spmanScale);
    spacemanZ -= (newViewDir.elements[2] * 0.1 / spmanScale);
  }
  else if(ev.key == '1'){ 
    first_view = 1;
  }
  else if(ev.key == '2'){ 
    first_view = 0;
  }
  draw();
}

function initFrameBufferForCubemapRendering(gl){
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  // 6 2D textures
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, 
                  gl.RGBA, offScreenWidth, offScreenHeight, 0, gl.RGBA, 
                  gl.UNSIGNED_BYTE, null);
  }

  //create and setup a render buffer as the depth buffer
  var depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 
                          offScreenWidth, offScreenHeight);

  //create and setup framebuffer: linke the depth buffer to it (no color buffer here)
  var frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, 
                              gl.RENDERBUFFER, depthBuffer);

  frameBuffer.texture = texture;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return frameBuffer;
}

function renderCubeMap(camX, camY, camZ)
{
  //camera 6 direction to render 6 cubemap faces
  var ENV_CUBE_LOOK_DIR = [
      [1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, -1.0]
  ];

  //camera 6 look up vector to render 6 cubemap faces
  var ENV_CUBE_LOOK_UP = [
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, -1.0],
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0]
  ];

  gl.useProgram(program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.viewport(0, 0, offScreenWidth, offScreenHeight);
  // gl.clearColor(0.4, 0.4, 0.4,1);
  for (var side = 0; side < 6;side++){
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, 
      gl.TEXTURE_CUBE_MAP_POSITIVE_X+side, fbo.texture, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    var vpFromCamera = new Matrix4();
    vpFromCamera.setPerspective(90, 1, 1, 100);
    var viewMatrixRotationOnly = new Matrix4();
    
    viewMatrixRotationOnly.lookAt(camX, camY, camZ,   
    camX + ENV_CUBE_LOOK_DIR[side][0], 
    camY + ENV_CUBE_LOOK_DIR[side][1],
    camZ + ENV_CUBE_LOOK_DIR[side][2], 
    ENV_CUBE_LOOK_UP[side][0],
    ENV_CUBE_LOOK_UP[side][1],
    ENV_CUBE_LOOK_UP[side][2]);
    
    
    
    viewMatrixRotationOnly.elements[12] = 0; //ignore translation
    viewMatrixRotationOnly.elements[13] = 0;
    viewMatrixRotationOnly.elements[14] = 0;
    vpFromCamera.multiply(viewMatrixRotationOnly);
    var vpFromCameraInverse = vpFromCamera.invert();


    //quad
    gl.useProgram(programEnvCube);
    gl.depthFunc(gl.LEQUAL);
    gl.uniformMatrix4fv(programEnvCube.u_viewDirectionProjectionInverse, 
      false, vpFromCameraInverse.elements);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTex);
    gl.uniform1i(programEnvCube.u_envCubeMap, 0);
    initAttributeVariable(gl, programEnvCube.a_Position, quadObj.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, quadObj.numVertices);


    let vpMatrix = new Matrix4();
    vpMatrix.setPerspective(90, 1, 1, 100);
   
    vpMatrix.lookAt(camX, camY, camZ,   
    camX + ENV_CUBE_LOOK_DIR[side][0], 
    camY + ENV_CUBE_LOOK_DIR[side][1],
    camZ + ENV_CUBE_LOOK_DIR[side][2], 
    ENV_CUBE_LOOK_UP[side][0],
    ENV_CUBE_LOOK_UP[side][1],
    ENV_CUBE_LOOK_UP[side][2]);
    
    
    
  
    drawRegularObjects(vpMatrix);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function initTexture(gl, img, texKey){
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  textures[texKey] = tex;

  texCount++;
  if( texCount == numTextures)draw();
}