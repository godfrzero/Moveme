var camera, scene, renderer,
	geometry, texture, material, mesh,
	faceCount = 20, 
	thisFace = 0, 
	incrementAngle = 2 * Math.PI / faceCount,
	targetRadius = 1280;

// UInteraction controllers
var autoScroll = true,
	userScroll = { x: 0, y: 0 },
	lastPosition = { x: 0, y: 0 },
	magicNumber = 404;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 0;

	scene = new THREE.Scene();

	while( thisFace < faceCount ) {
		var thisAngle = incrementAngle * thisFace;

		geometry = new THREE.CubeGeometry( magicNumber, 1200, 1, 10, 20, 1 );

		texture = new THREE.ImageUtils.loadTexture('assets/images/bg2.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.x = 1 / faceCount;
		texture.offset.x = thisFace / faceCount;

		material = new THREE.MeshLambertMaterial({
			map: texture,
			overdraw: true
		});

		mesh = new THREE.Mesh( geometry, material );

		mesh.position.z = targetRadius * Math.sin( thisAngle );
		mesh.position.x = targetRadius * Math.cos( thisAngle );
		mesh.rotation.y = Math.PI / 2 - thisAngle;

		scene.add( mesh );
		thisFace++;
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );

	if( autoScroll ) {
		camera.rotation.y -= 0.001;
	} else {
		camera.rotation.y += userScroll.y;
	}

	renderer.render( scene, camera );
}

function UInteract(e) {
	var thisPosition = {
		x: e.y,
		y: e.x
	}

	if( lastPosition.y ) {
		userScroll.y = (thisPosition.y - lastPosition.y) / magicNumber;
	}

	lastPosition = {
		x: e.y,
		y: e.x
	}
}

function attachListeners() {
	document.addEventListener( 'mousemove', UInteract );
	autoScroll = false;
}

function removeListeners() {
	console.log('Removing listeners');
	document.removeEventListener( 'mousemove', UInteract );

	userScroll = {
		x: 0,
		y: 0
	};

	lastPosition = {
		x: 0,
		y: 0
	};

	setTimeout(function() {
		autoScroll = true;
	}, 5000);
}

document.addEventListener( 'mousedown', attachListeners );
document.addEventListener( 'mouseup', removeListeners );