var mymap , absAccelNow;

/*
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

if (storageAvailable('localStorage')) {
// Yippee! We can use localStorage awesomeness
//alert("ok");
localStorage.setItem("bing","bong");
//alert (localStorage.getItem("bob"));
}
else {
// Too bad, no localStorage for us
alert( "boo" );
}
*/



// >>>>>>>>>>>>>>>Maps Section<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function initMap(){
let bilMarker;
let UserOked = false;
document.getElementById("startBil").addEventListener("click", setUserOked);
function setUserOked(){UserOked=true};



bilicon = {
    path: 'M16 58 L32 59 L48 58 L48 12 L44 8 L20 8 L16 12 L16 30 L17 30 L20 23 L32 19 L44 23 L47 30 L32 26 L25.166666666666664 27.5 L16 30 L16 58 L16 58 L16 58 Z',
    fillColor: 'black',
    fillOpacity: 0.5,
    strokeColor: '#fff',
    strokeWeight: 1,
    scale: 0.5,
    anchor: new google.maps.Point(32, 32),
    rotation: 0,
}

bunnyicon = {
    path: 'M12.333333333333332 42.333333333333336 L19.833333333333332 39.5 L23.666666666666668 37.666666666666664 L20.333333333333332 40.5 L14 43.666666666666664 L16.166666666666668 45.166666666666664 L20 46 L32 44 L30.666666666666664 53.166666666666664 L44.5 48.333333333333336 L56 48 L42.166666666666664 23.666666666666668 L47.333333333333336 2.833333333333334 L44 0.16666666666666607 L39.5 2.833333333333334 L37.833333333333336 19.666666666666668 L34 18 L36 4 L32 0 L28 2 L30 18 L23 20.5 L23.5 26.833333333333336 L27.166666666666664 27.833333333333336 L24.5 29.833333333333336 L22.166666666666668 28.833333333333336 L23.5 26.833333333333336 L22.833333333333332 20.5 L14.333333333333332 26.666666666666664 L11.166666666666668 32.166666666666664 Z' ,
    fillColor: 'tan',
    fillOpacity: 0.5,
    strokeColor: '#fff',
    strokeWeight: 1,
    scale: 2,
    anchor: new google.maps.Point(32, 32),
    rotation: 0,
}

//>>>>>>>>>>>>>>>>GeoLocation section<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function scrollMap(position) {
    // Scrolls the map so that it is centered at
    //  (position.coords.latitude, position.coords.longitude).
    console.log(position);
    document.getElementById("myLat").innerHTML = position.coords.latitude;
    document.getElementById("myLng").innerHTML = position.coords.longitude;
    if(position.coords.altitude !== null) {document.getElementById("myAlt").innerHTML = position.coords.altitude;} else {document.getElementById("myAlt").innerHTML =0};
    if( position.coords.heading !== null) {
        var PtA = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var PtB = new google.maps.LatLng(-33.811352, 151.240957);
        let disttotarget = google.maps.geometry.spherical.computeDistanceBetween(PtA, PtB);
        if (disttotarget <60) {
            document.getElementById("myHed").innerHTML = "Welcome to BunnyVille, Suzie!";
            bunnyicon.rotation=0;
            bilMarker.setIcon(bunnyicon);
        } else {
            document.getElementById("myHed").innerHTML = position.coords.heading;
            bilicon.rotation=position.coords.heading;
            bilMarker.setIcon(bilicon);
        } 
        document.getElementById("myHed").innerHTML = position.coords.heading;
        bilicon.rotation=position.coords.heading;
        bilMarker.setIcon(bilicon);
    } else {document.getElementById("myHed").innerHTML=0
        bilicon.rotation += 90;
        if(bilicon.rotation>360) {biliocn.rotation -= 360};
        bilMarker.setIcon(bilicon);
    };
    if(position.coords.speed !== null) {document.getElementById("mySpd").innerHTML = position.coords.speed;} else {document.getElementById("mySpd").innerHTML=0};
    mymap.setCenter( new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    console.log(`bilMarker ${bilMarker}`);
    bilMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
}

function handleError(error) {
    console.log(error);
}
//>>>>>>>>>>>>>>>>GeoLocation section end <<<<<<<<<<<<<<<<<<<<<<<<<
// Request repeated updates.
var myLatLng = {
    lat: -33.782,
    lng: 151.244
};

//>>>>>>>>>>>>>>>>Accelerometer Section<<<<<<<<<<<<<<<<<<<<<<<<<<<<
let sensor = null;
try { 
    sensor = new Accelerometer({frequency:2});
    sensor.addEventListener('error', event => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
            console.log('Permission to access sensor was denied.');
        } else if (event.error.name === 'NotReadableError' ) {
            console.log('Cannot connect to the sensor.');
        }
    });
    accelerometer.addEventListener('reading', () => {
        console.log("Acceleration along X-axis: " + sensor.x);
        console.log("Acceleration along Y-axis: " + sensor.y);
        console.log("Acceleration along Z-axis: " + sensor.z);
        absAccelNow=Math.hypot(sensor.x,sensor.y,sensor.z);
        console.log(`absAccellNow = ${absAccelNow}`);
    });
    sensor.start();
} catch (error){
    // Handle construction errors.
    if (error.name === 'SecurityError') {
        console.log('Sensor construction was blocked by the Feature Policy.');
    } else if (error.name === 'ReferenceError') {
        console.log('Sensor is not supported by the User Agent.');
    } else {
        throw error;
    }
}

//>>>>>>>>>>>>>>>>Accelerometer Section Ends<<<<<<<<<<<<<<<<<<<<<<<
mymap = new google.maps.Map(document.getElementById('map_canvas'), {
    center: myLatLng,
    zoom: 18,
    mapTypeId: 'satellite',
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
});
bilMarker = new google.maps.Marker({
    position: mymap.getCenter(),
    icon: bilicon,
    draggable: false,
    map: mymap
});

var watchId = navigator.geolocation.watchPosition(scrollMap, handleError);

}
//>>>>>>>>>>>>>>>>Maps Section end<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



