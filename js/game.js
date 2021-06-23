var Colors = {
	cherry: 0xe35d6a,
	blue: 0x1560bd,
	white: 0xd8d0d1,
	black: 0x000000,
	brown: 0x59332e,
	peach: 0xffdab9,
	yellow: 0xffff00,
	olive: 0x556b2f,
	grey: 0x696969,
	sand: 0xc2b280,
	brownDark: 0x23190f,
	green: 0x669900,
	skin: 0xb48A78,
	cyan: 0x157CBD,
	tartan_red: 0x972822,
};
var day = false;
var deg2Rad = Math.PI / 180;

window.addEventListener('load', function(){
	new World();
});

function World() {
	var self = this;

	var element, scene, camera, athlete, renderer, light, dirlight,
		objects, ostacoloProb, fogDistance;

	init();

	function init() {
		element = document.getElementById('world');

		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(element.clientWidth, element.clientHeight);
		renderer.shadowMap.enabled = true;
		element.appendChild(renderer.domElement);

		scene = new THREE.Scene();
		fogDistance = 80000;
		scene.fog = new THREE.Fog(Colors.white, 1, fogDistance);
		if(day == true){
			scene.background = new THREE.Color( 0x87ceeb );
			light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
			sfera = new Sfera();
		}
		else{
			scene.background = new THREE.Color( 0x0c1445 );
			light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8);	
			sfera = new Sfera();		
		}
		scene.add(light);
		scene.add(sfera.element);

		camera = new THREE.PerspectiveCamera(60, element.clientWidth / element.clientHeight, 1, 120000);
		camera.position.set(0, 1000, -2000);
		camera.lookAt(new THREE.Vector3(0, 600, -5000));
		window.camera = camera;

		dirlight = new THREE.DirectionalLight( 0xffffff, 0.9);
		dirlight.position.set( -1200, 2000, -4000 ); //default; light shining from top
		//dirlight.castShadow = true; // default false
		scene.add( dirlight );

		window.addEventListener('resize', handleWindowResize, false);

		athlete = new Athlete();
		scene.add(athlete.element);

		var track = createBox(3000, 20, 120000, Colors.tartan_red, 0, -400, -60000);
		scene.add(track);
		var ground = createBox(8000, 20, 120000, Colors.green, 0, -420, -60000);
		scene.add(ground);
		var linea = createBox(30, 20, 120000, Colors.white, 400, -400, -60000);
		scene.add(linea);
		var linea1 = createBox(30, 20, 120000, Colors.white, -400, -400, -60000);
		scene.add(linea1);

		objects = [];
		ostacoloProb = 0.5;
		for (var i = 10; i < 40; i+=4) {
			createOstacolo(i * -300, ostacoloProb, 0.5); //era i*3000
		}

		gameOver = false;
		paused = true;

		// keycode
		var left = 37;
		var up = 38;
		var right = 39;
		var p = 80;

		loop();

	}

	function loop() {
		renderer.render(scene, camera);
		requestAnimationFrame(loop);
	}

	function handleWindowResize() {
		renderer.setSize(element.clientWidth, element.clientHeight);
		camera.aspect = element.clientWidth / element.clientHeight;
		camera.updateProjectionMatrix();
	}

	function createOstacolo(position, probability, minScale) {
		for (var lane = -1; lane < 2; lane++) {
			var randomNumber = Math.random();
			if (randomNumber < probability) {
				var scale = minScale;
				var ostacolo = new Ostacolo(lane * 900, -400, position, scale);
				objects.push(ostacolo);
				scene.add(ostacolo.mesh);
			}
		}
	}
}
 
function Athlete() {
	var self = this;

	this.skinColor = Colors.skin;
	this.hairColor = Colors.black;
	this.shirtColor = Colors.cyan;
	this.shortsColor = Colors.white;
	this.jumpDuration = 0.6;
	this.jumpHeight = 2000;

	init();
	function init() {

		self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
		self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
		self.head = createGroup(0, 260, -25);
		self.head.add(self.face);
		self.head.add(self.hair);

		self.torso = createBox(150, 220, 40, self.shirtColor, 0, 90, 0);

		self.leftLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -150, 0);
		self.leftArm = createLimb(30, 140, 40, self.skinColor, -100, 190, -10);
		self.leftArm.add(self.leftLowerArm);

		self.rightLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -150, 0);
		self.rightArm = createLimb(30, 140, 40, self.skinColor, 100, 190, -10);
		self.rightArm.add(self.rightLowerArm);

		self.leftLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -190, 0);
		self.leftLeg = createLimb(50, 170, 50, self.shortsColor, -50, -10, 30);
		self.leftLeg.add(self.leftLowerLeg);

		self.rightLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -190, 0);
		self.rightLeg = createLimb(50, 170, 50, self.shortsColor, 50, -10, 30);
		self.rightLeg.add(self.rightLowerLeg);

		self.element = createGroup(0, 0, -4000);
		self.element.add(self.head);
		self.element.add(self.torso);
		self.element.add(self.leftArm);
		self.element.add(self.rightArm);
		self.element.add(self.leftLeg);
		self.element.add(self.rightLeg);


		self.isJumping = false;
		self.isSwitchingLeft = false;
		self.isSwitchingRight = false;
		self.currentLane = 0;
		self.runningStartTime = new Date() / 1000;
		self.pauseStartTime = new Date() / 1000;
		self.stepFreq = 2;
		self.queuedActions = [];

	}

	function createLimb(dx, dy, dz, color, x, y, z) {
	    var limb = createGroup(x, y, z);
	    var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
		var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
		limb.add(limbBox);
		return limb;
	}

}

function Ostacolo(x, y, z, s) {
	var self = this;

	this.mesh = new THREE.Object3D();
	var asta = createBox(1500, 100, 50, Colors.white, 0, 650, 0);
	var palo1 = createBox(100, 1200, 50, Colors.yellow, 800, 125, 0);
	var palo2 = createBox(100, 1200, 50, Colors.yellow, -800, 125, 0);
    this.mesh.add(asta);
    this.mesh.add(palo1);
	this.mesh.add(palo2);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;
}

function Sfera(){
	var self = this;
	if (day == true){
		this.Color = Colors.yellow;
	}
	else{
		this.Color = Colors.white;
	}
	init();
	function init(){
		if (day == true){
			self.face = createSphere(100, 100, 100, self.Color, 0, 0, 0);
			self.element = createGroup(-1200, 1500, -4000);
			self.element.add(self.face);
		}
		else{
			self.face = createSphere(100, 100, 100, self.Color, 0, 0, 0);
			self.element = createGroup(-1200, 1500, -4000);
			self.element.add(self.face);
		}
	}
	
}

function createGroup(x, y, z) {
	var group = new THREE.Group();
	group.position.set(x, y, z);
	return group;
}

function createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var mat = new THREE.MeshPhongMaterial({
		color:color, 
    	flatShading: notFlatShading != true
    });
    var box = new THREE.Mesh(geom, mat);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
}

function createCylinder(radiusTop, radiusBottom, height, radialSegments, color, x, y, z) {
    var geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    var mat = new THREE.MeshPhongMaterial({
    	color: color,
    	flatShading: true
    });
    var cylinder = new THREE.Mesh(geom, mat);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.position.set(x, y, z);
    return cylinder;
}

function createSphere(r, seg, heig, color, x, y, z){
	var sphereGeometry = new THREE.SphereGeometry(r, seg, heig);
	var sphereMaterial = new THREE.MeshPhongMaterial({
		color: color,
		flatShading: true
	});
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(x, y, z);
	return sphere;
}