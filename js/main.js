var Colors = {
    ocra: 0xaea04b,
    darkgreen: 0x006400,
	bluevany: 0x000080,
	white: 0xd8d0d1,
	black: 0x000000,
	brown: 0x59332e,
	yellow: 0xffff00,
	brownDark: 0x23190f,
	green: 0x669900,
	skin: 0xb48A78,
    jskin: 0x583625,
	cyan: 0x157CBD,
	tartan_red: 0x972822,
    red: 0xFF0000,
    blonde: 0xF0E2B6,
};

buttons();

var sfera, scene, light, element, camera, renderer, dirlight, objects, ostacoloProb, fogDistance;

/******************WORLD******************/

element = document.getElementById('world');

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(element.clientWidth, element.clientHeight);
renderer.shadowMap.enabled = true;
element.appendChild(renderer.domElement);

scene = new THREE.Scene();
fogDistance = 80000;
scene.fog = new THREE.Fog(Colors.white, 1, fogDistance);

scene.background = new THREE.Color( 0x87ceeb );
light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);

sfera = createSphere(100, 100, 100, Colors.yellow, -1200, 1500, -4000);;

scene.add(light);
scene.add(sfera);

camera = new THREE.PerspectiveCamera(60, element.clientWidth / element.clientHeight, 1, 120000);
camera.position.set(0, 1000, -2000); //0, 1000, -2000
camera.lookAt(new THREE.Vector3(0, 600, -5000));
window.camera = camera;

dirlight = new THREE.DirectionalLight( 0xffffff, 0.9);
dirlight.position.set( -1200, 2000, -4000 );
scene.add( dirlight );

var t = new THREE.BoxGeometry(3000, 20, 120000);
const mattrack = new THREE.MeshPhongMaterial({color: Colors.tartan_red});
const textNormalTrack = new THREE.TextureLoader().load( './img/track.jpg');
textNormalTrack.wrapS = THREE.RepeatWrapping;
textNormalTrack.wrapT = THREE.RepeatWrapping;
textNormalTrack.repeat.set(5, 60);
mattrack.normalMap = textNormalTrack;
const track = new THREE.Mesh( t, mattrack );
track.position.set(0, -500, -60000);
scene.add(track);

var g = new THREE.BoxGeometry(8000, 20, 120000);
const matground = new THREE.MeshPhongMaterial({color: Colors.green,});
const textNormalGround = new THREE.TextureLoader().load( './img/ground.jpg');
textNormalGround.wrapS = THREE.RepeatWrapping;
textNormalGround.wrapT = THREE.RepeatWrapping;
textNormalGround.repeat.set(10, 60);
matground.normalMap = textNormalGround;
const ground = new THREE.Mesh( g, matground );
ground.position.set(0, -520, -60000);
scene.add(ground);

var linea = createBox(30, 20, 120000, Colors.white, 400, -495, -60000);
scene.add(linea);
var linea1 = createBox(30, 20, 120000, Colors.white, -400, -495, -60000);
scene.add(linea1);


/******************MODELS******************/

var birds;
const loaderb = new THREE.GLTFLoader();
loaderb.load('./assets/birds/scene.gltf', function(gltf){
    birds = gltf.scene;
    birds.position.set(-1.5,1000.8, -2004);
    birds.scale.set(0.3, 0.3, 0.3);
    birds.rotation.y += 1.5;

    scene.add(birds);
}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + '% loaded');
}, function(error){
    console.log('Errore');
});

var simbolo;
const loader = new THREE.GLTFLoader();
loader.load('./assets/simbolo/scene.gltf', function(gltf){
    simbolo = gltf.scene;
    simbolo.position.set(4.5, 1002, -2007);
    simbolo.scale.set(0.2, 0.2, 0.2);
    simbolo.rotation.x += 1.5;

    scene.add(simbolo);
}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + '% loaded');
}, function(error){
    console.log('Errore');
});

var stars;
const loaders = new THREE.GLTFLoader();
loaders.load('./assets/stars/scene.gltf', function(gltf){
    stars = gltf.scene;
    stars.position.set(-1.5,1050, -2009);
    stars.scale.set(0.5, 0.5, 0.5);

}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + '% loaded');
}, function(error){
    console.log('Errore');
});

/******************SOUND******************/
const listener = new THREE.AudioListener();
//camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './assets/music.wav', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
});



/******************ATHLETE******************/

var face = createBox(100, 100, 60, Colors.skin, 0, 0, 0);
var hair = createBox(100, 20, 65, Colors.brown, 0, 50, 0);
var hair1 = createBox(100, 100, 5, Colors.brown, 0, 9, 30);
var coda = createBox(50, 150, 40, Colors.brown, 0, 0, 40);
var head = createGroup(0, 260, -25);
head.add(face);
head.add(hair);
head.add(hair1);
head.add(coda);

var torso = createBox(150, 200, 40, Colors.cyan, 0, 100, 0);

var leftLowerArm = createGroup(0, -150, 0);
var lla = createBox(20, 120, 30, Colors.skin, 0, -75, 0);
leftLowerArm.add(lla);
var leftArm = createGroup(-100, 190, -10);
var la = createBox(30, 140, 40, Colors.skin, 0, -90, 0);
leftArm.add(la);
leftArm.add(leftLowerArm);

var rightLowerArm = createGroup(0, -150, 0);
var rla = createBox(20, 120, 30, Colors.skin, 0, -75, 0);
rightLowerArm.add(rla);
var rightArm = createGroup(100, 190, -10);
var ra = createBox(30, 140, 40, Colors.skin, 0, -90, 0);
rightArm.add(ra);
rightArm.add(rightLowerArm);

var leftLowerLeg = createGroup(0, -200, 0);
var lll = createBox(40, 200, 40, Colors.skin, 0, -120, 0);
leftLowerLeg.add(lll);
var leftLeg =  createGroup(-50, 20, 30);
var ll = createBox(50, 170, 50, Colors.white, 0, -110, 0);
leftLeg.add(ll);
leftLeg.add(leftLowerLeg);

var rightLowerLeg = createGroup(0, -200, 0);
var rll = createBox(40, 200, 40, Colors.skin, 0, -120, 0);
rightLowerLeg.add(rll);
var rightLeg = createGroup(50, 20, 30);
var rl = createBox(50, 170, 50, Colors.white, 0, -110, 0);
rightLeg.add(rl);
rightLeg.add(rightLowerLeg);

var atleta = createGroup(0, 0, -4000);
atleta.add(head);
atleta.add(torso);
atleta.add(leftArm);
atleta.add(rightArm);
atleta.add(leftLeg);
atleta.add(rightLeg);

scene.add(atleta);


/******************OSTACOLO******************/

function Ostacolo(x, y, z) {
    var self = this;
	this.mesh = new THREE.Object3D();
	var asta = createBox(850, 50, 25, Colors.white, 0, 350, 0);
	var palo1 = createBox(50, 400, 25, Colors.yellow, 400, 125, 0);
	var palo2 = createBox(50, 400, 25, Colors.yellow, -400, 125, 0);
    this.mesh.add(asta);
    this.mesh.add(palo1);
	this.mesh.add(palo2);
    this.mesh.position.set(x, y, z);

    this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    	var oMinX = self.mesh.position.x -200;
    	var oMaxX = self.mesh.position.x  +200;
    	var oMinY = self.mesh.position.y;
    	var oMaxY = self.mesh.position.y +500
    	var oMinZ = self.mesh.position.z -200;
    	var oMaxZ = self.mesh.position.z +200;
    	return oMinX <= maxX && oMaxX >= minX && oMinY <= maxY && oMaxY >= minY && oMinZ <= maxZ && oMaxZ >= minZ;
    }
}
objects = [];
ostacoloProb = 0.4;
for (var i = 10; i < 40; i+=5) {
    createOstacolo(i * -3000, ostacoloProb);
}
function createOstacolo(position, probability) {
    for (var lane = -1; lane < 2; lane++) {
        var randomNumber = Math.random();
        if (randomNumber < probability) {
            var ostacolo = new Ostacolo(lane * 900, -400, position);
            objects.push(ostacolo);
            scene.add(ostacolo.mesh);
        }
    }
}


/******************ANIMATION******************/
var gameOver = false;
var paused = true;
var isJumping = false;
var isSwitchingLeft = false;
var isSwitchingRight = false;
var jumpDuration = 0.6;
var jumpHeight = 950;
var currentLane = 0; //corsia centrale
var runningStartTime = new Date() / 1000;
var pauseStartTime = new Date() / 1000;
var stepFreq = 2;
var score = 0;
var difficulty = 0;
var deg2Rad = Math.PI / 180;
document.getElementById("score").innerHTML = score;

// keycode
var left = 37;
var up = 38;
var right = 39;
var p = 80;

document.addEventListener('keydown', function(e) {
    if (!gameOver) {
        var key = e.keyCode;
        if (paused && !collisionsDetected() && key == 13) {
            paused = false;
            onUnpause();
            document.getElementById("variable-content").style.visibility = "hidden";
        } else {
            if (key == p) {
                paused = true;
                onPause();
                document.getElementById("variable-content").style.visibility = "visible";
                document.getElementById("variable-content").innerHTML = "Game is paused. Press ENTER to resume.";
            }
            if (key == up && !paused) {
                isJumping = true;
                jumpStartTime = new Date() / 1000;
            }
            if (key == left && !paused) {
                if (currentLane != -1) {
                    isSwitchingLeft = true;
                }
            }
            if (key == right && !paused) {
                if (currentLane != 1) {
                    isSwitchingRight= true;
                }
            }
        }
    }
});


function update(){

    var currentTime = new Date() / 1000;

    if (isJumping) {
        var jumpClock = currentTime - jumpStartTime;
        atleta.position.y = jumpHeight * Math.sin((1 / jumpDuration) * Math.PI * jumpClock); 
        if (jumpClock > jumpDuration) {
            isJumping = false;
            runningStartTime += jumpDuration;
        }
    } else {
        var runningClock = currentTime - runningStartTime;
        atleta.position.y = RunMode(2 * stepFreq, 0, 20, 0, runningClock);
        head.rotation.x = RunMode(2 * stepFreq, -10, -5, 0, runningClock) * deg2Rad;
        coda.rotation.z = RunMode(2 * stepFreq, -10, 10, 180, runningClock) * deg2Rad;
        torso.rotation.x = RunMode(2 * stepFreq, -10, -5, 180, runningClock) * deg2Rad;
        leftArm.rotation.x = RunMode(stepFreq, -70, 50, 180, runningClock) * deg2Rad;
        rightArm.rotation.x = RunMode(stepFreq, -70, 50, 0, runningClock) * deg2Rad;
        leftLowerArm.rotation.x = RunMode(stepFreq, 70, 140, 180, runningClock) * deg2Rad;
        rightLowerArm.rotation.x = RunMode(stepFreq, 70, 140, 0, runningClock) * deg2Rad;
        leftLeg.rotation.x = RunMode(stepFreq, 0, 90, 0, runningClock) * deg2Rad;
        rightLeg.rotation.x = RunMode(stepFreq, 0, 90, 180, runningClock) * deg2Rad;
        leftLowerLeg.rotation.x = RunMode(stepFreq, -130, 5, 240, runningClock) * deg2Rad;
        rightLowerLeg.rotation.x = RunMode(stepFreq, -130, 5, 60, runningClock) * deg2Rad;

        if (isSwitchingLeft) {
                currentLane -= 1;
                atleta.position.x = currentLane * 800;
                isSwitchingLeft = false;
        }
        if (isSwitchingRight) {
                currentLane += 1;
                atleta.position.x = currentLane * 800;
                isSwitchingRight = false;
        }
    }
}

/**
  * Handles character activity when the game is paused.
  */
function onPause() {
    pauseStartTime = new Date() / 1000;
}

/**
  * Handles character activity when the game is unpaused.
  */
function onUnpause() {
    var currentTime = new Date() / 1000;
    var pauseDuration = currentTime - pauseStartTime;
    runningStartTime += pauseDuration;
    if (isJumping) {
        jumpStartTime += pauseDuration;
    }
}

function RunMode(frequency, minimum, maximum, phase, time) {
	var t = time * frequency * Math.PI * 2; // get phase at time
    t += phase * Math.PI / 180; // add the phase offset
    var v = Math.sin(t); // get the value at the calculated position in the cycle
	var amplitude = 0.5 * (maximum - minimum);
	var offset = amplitude * v;
	v += offset;
	var average = (minimum + maximum) / 2;
    return v + average;
}

/*Ritorna true se se l'atleta tocca l'ostacolo*/
function collisionsDetected() {
    var aMinX = atleta.position.x - 5;
    var aMaxX = atleta.position.x + 5;
    var aMinY = atleta.position.y - 10;
    var aMaxY = atleta.position.y + 10;
    var aMinZ = atleta.position.z - 2;
    var aMaxZ = atleta.position.z + 2;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].collides(aMinX, aMaxX, aMinY, aMaxY, aMinZ, aMaxZ)) {
            return true;
        }
    }
    return false;
}


/******************UTILITY******************/

function createGroup(x, y, z) {
	var group = new THREE.Group();
	group.position.set(x, y, z);
	return group;
}

function createBox(dx, dy, dz, color, x, y, z) {
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var mat = new THREE.MeshPhongMaterial({
		color:color, 
    	flatShading: true
    });
    var box = new THREE.Mesh(geom, mat);
    box.position.set(x, y, z);
    return box;
}

function createSphere(r, seg, heig, color, x, y, z){
	var sphereGeometry = new THREE.SphereGeometry(r, seg, heig);
	var sphereMaterial = new THREE.MeshPhongMaterial({
		color: color,
	});
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(x, y, z);
	return sphere;
}

function buttons(){
    document.getElementById("night").onclick = function(){  
        scene.background = new THREE.Color( 0x0c1445 );
        light.intensity = 0.8;	
        sfera.material.color.setHex(Colors.white);
        scene.remove(birds);
        scene.add(stars);
    };
    document.getElementById("day").onclick = function(){
        scene.background = new THREE.Color( 0x87ceeb );
        light.intensity = 1;
        sfera.material.color.setHex(Colors.yellow);
        scene.add(birds);
        scene.remove(stars);
    };
    
    document.getElementById("it").onclick = function(){
        rl.material.color.setHex(Colors.white);
        ll.material.color.setHex(Colors.white);
        torso.material.color.setHex(Colors.cyan);
        hair.material.color.setHex(Colors.brown);
        hair1.material.color.setHex(Colors.brown);
        coda.material.color.setHex(Colors.brown);
        face.material.color.setHex(Colors.skin);
        rla.material.color.setHex(Colors.skin);
        ra.material.color.setHex(Colors.skin);
        lla.material.color.setHex(Colors.skin);
        la.material.color.setHex(Colors.skin);
        rll.material.color.setHex(Colors.skin);
        lll.material.color.setHex(Colors.skin);
    };
    document.getElementById("en").onclick = function(){
        rl.material.color.setHex(Colors.bluevany);
        ll.material.color.setHex(Colors.bluevany);
        torso.material.color.setHex(Colors.white);
        hair.material.color.setHex(Colors.blonde);
        hair1.material.color.setHex(Colors.blonde);
        coda.material.color.setHex(Colors.blonde);
        face.material.color.setHex(Colors.skin);
        rla.material.color.setHex(Colors.skin);
        ra.material.color.setHex(Colors.skin);
        lla.material.color.setHex(Colors.skin);
        la.material.color.setHex(Colors.skin);
        rll.material.color.setHex(Colors.skin);
        lll.material.color.setHex(Colors.skin);
    };
    document.getElementById("sp").onclick = function(){
        rl.material.color.setHex(Colors.red);
        ll.material.color.setHex(Colors.red);
        torso.material.color.setHex(Colors.yellow);
        hair.material.color.setHex(Colors.brown);
        hair1.material.color.setHex(Colors.brown);
        coda.material.color.setHex(Colors.brown);
        face.material.color.setHex(Colors.skin);
        rla.material.color.setHex(Colors.skin);
        ra.material.color.setHex(Colors.skin);
        lla.material.color.setHex(Colors.skin);
        la.material.color.setHex(Colors.skin);
        rll.material.color.setHex(Colors.skin);
        lll.material.color.setHex(Colors.skin);
    };
    document.getElementById("jm").onclick = function(){
        rl.material.color.setHex(Colors.black);
        ll.material.color.setHex(Colors.black);
        torso.material.color.setHex(Colors.darkgreen);
        hair.material.color.setHex(Colors.black);
        hair1.material.color.setHex(Colors.black);
        coda.material.color.setHex(Colors.black);
        face.material.color.setHex(Colors.jskin);
        rla.material.color.setHex(Colors.jskin);
        ra.material.color.setHex(Colors.jskin);
        lla.material.color.setHex(Colors.jskin);
        la.material.color.setHex(Colors.jskin);
        rll.material.color.setHex(Colors.jskin);
        lll.material.color.setHex(Colors.jskin);
    };
    document.getElementById("male").onclick = function(){
            head.remove(coda);
    };
    document.getElementById("female").onclick = function(){
        head.add(coda);
    };
    document.getElementById("on").onclick = function(){
        sound.play();
    };
    document.getElementById("off").onclick = function(){
        sound.pause();
    };
}


loop();

function loop() {

    if (!paused) {
        //increase the difficulty.
        if ((objects[objects.length - 1].mesh.position.z) % 3000 == 0) {
            difficulty += 1;
            var levelLength = 30;
            if (difficulty % levelLength == 0) {
                var level = difficulty / levelLength;
                switch (level) {
                    case 1:
                        ostacoloProb = 0.4;
                        break;
                    case 2:
                        ostacoloProb = 0.4;
                        break;
                    case 3:
                        ostacoloProb = 0.45;
                        break;
                    case 4:
                        ostacoloProb = 0.45;
                        break;
                    case 5:
                        ostacoloProb = 0.5;
                        break;
                    case 6:
                        ostacoloProb = 0.5;
                        break;
                    default:
                        ostacoloProb = 0.55;
                }
            }
            createOstacolo(-120000, ostacoloProb);
        }

        // avvicina gli ostacoli
        objects.forEach(function(object) {
            object.mesh.position.z += 200;
        });

        if(simbolo) simbolo.rotation.z += 0.1;
        update();

        if (collisionsDetected()){
            gameOver = true;
            paused = true;
            document.addEventListener('keydown',function(e) {
                if (e.keyCode == 13)
                document.location.reload(true);
            });
            var variableContent = document.getElementById("variable-content");
            variableContent.style.visibility = "visible";
            variableContent.innerHTML = "Game over! Press ENTER to try again.";
            //sound.pause();
        }

        score += 10;
        document.getElementById("score").innerHTML = score;

    }
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}