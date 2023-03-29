var scene, camera, canvas, renderer;
var cardGroup, comingSoonGroup;

var raycaster = new THREE.Raycaster();
var pickPosition = {x: 0, y: 0};

var windowSizeX = document.getElementById('3d-card').offsetWidth;
var windowSizeY = document.getElementById('3d-card').offsetHeight;

var cameraPosZ         = 14;
var cameraPosZ_max     = 15;
var cameraPosZ_min     = 5;
var cameraPosZ_current = cameraPosZ;

var cameraPosY         = 0;
var cameraPosY_current = cameraPosY;

var cardWidth  = 9;
var cardHeight = 14.994;

var cardFrontURL = "assets/img/card_front.png";

var cardBackURL  = "assets/img/card_back.png";
var cardBackPosZ = -0.001

var mouseX = 16;
var mouseY = 0;

var windowHalfX = windowSizeX / 2;
var windowHalfY = windowSizeX / 2;

// Card

var cardGeometry;
var cardLoader;
var cardMaterial;
var cardCube;

var iconGeometry;
var iconLoader;
var iconMaterial;
var iconCube;

init();
animate();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, windowSizeX / windowSizeY, 0.1, 1000 );

    //custom_canvas = document.querySelector("3d-card");
    var custom_canvas = document.getElementById('3d-card');
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas: custom_canvas
    });
    renderer.setClearColor( 0xffffff, 0);
    renderer.setSize( windowSizeX, windowSizeY );

    // lights

    /*light = new THREE.DirectionalLight( 0xffffff );
    li ght.position.set( 1, 1, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scene.add( light );

    light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );*/


    cardGroup = new THREE.Object3D();
    comingSoonGroup = new THREE.Object3D();

    // CARD: Front

    cardFrontGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    cardFrontLoader = new THREE.TextureLoader();
    cardFrontMaterial = new THREE.MeshBasicMaterial({
        map: cardFrontLoader.load(cardFrontURL),
    });
    //cardFrontMaterial = new THREE.MeshBasicMaterial({
    //map: THREE.ImageUtils.loadTexture(cardFrontURL), transparent: true, opacity: 0.5, color: 0xFF0000 });

    cardFrontCube = new THREE.Mesh( cardFrontGeometry, cardFrontMaterial );
    cardFrontCube.name = "card front";

    cardGroup.add(cardFrontCube);

    // CARD: Back

    cardBackGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    cardBackLoader = new THREE.TextureLoader();
    cardBackMaterial = new THREE.MeshBasicMaterial({
        map: cardBackLoader.load(cardBackURL),
    });
    cardBackCube = new THREE.Mesh( cardBackGeometry, cardBackMaterial );
    cardBackCube.name = "card back";
    cardBackCube.position.z = cardBackPosZ
    cardBackCube.rotation.y = THREE.MathUtils.degToRad(180);

    cardGroup.add(cardBackCube);

    // Actions

    document.addEventListener("mousedown", onDocumentMouseDown, false );
    document.addEventListener("touchstart", onDocumentTouchStart, false );
    document.addEventListener("touchmove", onDocumentTouchMove, false );

    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);
    window.addEventListener("wheel", onDocumentOnWheel);

    window.addEventListener("resize", onWindowResize, false );

    scene.add(cardGroup);
    scene.add(comingSoonGroup);

    camera.position.z = cameraPosZ;
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    document.addEventListener("mousemove", onDocumentMouseMove, false );
    document.addEventListener("mouseup", onDocumentMouseUp, false );
    document.addEventListener("mouseout", onDocumentMouseOut, false );

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, {passive: false});

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
}

function onDocumentMouseUp( event ) {
    document.removeEventListener("mousemove", onDocumentMouseMove, false );
    document.removeEventListener("mouseup", onDocumentMouseUp, false );
    document.removeEventListener("mouseout", onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
    document.removeEventListener("mousemove", onDocumentMouseMove, false );
    document.removeEventListener("mouseup", onDocumentMouseUp, false );
    document.removeEventListener("mouseout", onDocumentMouseOut, false );
}

function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}

function onDocumentOnWheel(event) {
    /*if ((cameraPosZ_current < cameraPosZ_max && cameraPosZ_current > cameraPosZ_min) ||
        (cameraPosZ_current > cameraPosZ_max && event.deltaY < 0) ||
        (cameraPosZ_current < cameraPosZ_min && event.deltaY > 0)) {
            cameraPosZ_current += event.deltaY * 0.005;
        }*/
}

function onWindowResize() {
    windowHalfX = windowSizeX / 2;
    windowHalfY = windowSizeY / 2;
    camera.aspect = windowSizeX / windowSizeY;
    camera.updateProjectionMatrix();
    renderer.setSize( windowSizeX, windowSizeY );
}

function getCanvasRelativePosition(event) {
    const rect = container.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / windowSizeX ) *  2 - 1;
    pickPosition.y = (pos.y / windowSizeY ) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
}

function animate() {
    mouseYmax = 300;
    mouseYmin = -300;
    requestAnimationFrame( animate );
    //cardGroup.rotation.x = mouseY * 0.01;
    if (mouseY < mouseYmax && mouseY > mouseYmin) {
        cardGroup.rotation.x = (mouseY) * 0.002;
    } else {
        if (mouseY >= mouseYmax) {
            mouseY = mouseYmax;
        }
        if (mouseY <= mouseYmin) {
            mouseY = mouseYmin;
        }
    }
    cardGroup.rotation.y = mouseX * 0.02;
    camera.position.z = cameraPosZ_current;
    renderer.render( scene, camera );
}