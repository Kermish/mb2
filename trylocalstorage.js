var mymap , absAccelNow, oldLat,oldLng, PtA,PtB,xFact,yFact;


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
localStorage.setItem("ting","tong");
alert (localStorage.getItem("ting"));
}
else {
// Too bad, no localStorage for us
alert( "boo" );
}
    



// >>>>>>>>>>>>>>>Maps Section<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function initMap(){
let bilMarker;
let UserOked = false;
document.getElementById("startBil").addEventListener("click", setUserOked);
function setUserOked(){UserOked=true};


let kanjang = 'https://kermish.github.io/mb2/kanjang.png';
let ma = 1;
let mb = 73;
xFact = 1;
yFact = 1;
bilicon = {
    path: `M32 34 L${32+18*xFact} 34 L${32+18*xFact} 38 L${32+24*xFact} 32 L${32+18*xFact} 26 L${32+18*xFact} 30 L32 30 L34 ${32-18*yFact} L38 ${32-18*yFact} L32 ${32-22*yFact} L26 ${32-18*yFact} L30 ${32-18*yFact}  L30 32 Z`,
    fillColor: 'black',
    fillOpacity: 0.5,
    strokeColor: '#fff',
    strokeWeight: 1,
    scale: 0.5,
    //size: new google.maps.Size(64, 64),
    //scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(100, 10),
    rotation: 0,
}


bbilicon = {
    //url: kanjang,
    path: 'M16 58 L32 59 L48 58 L48 12 L44 8 L20 8 L16 12 L16 30 L17 30 L20 23 L32 19 L44 23 L47 30 L32 26 L25.166666666666664 27.5 L16 30 L16 58 L16 58 L16 58 Z',
    fillColor: 'black',
    fillOpacity: 0.5,
    strokeColor: '#fff',
    strokeWeight: 1,
    scale: 0.5,
    //size: new google.maps.Size(64, 64),
    //scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(100, 10),
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
    // console.log(position);
    document.getElementById("myLat").innerHTML = position.coords.latitude.toFixed(6);
    document.getElementById("myLng").innerHTML = position.coords.longitude.toFixed(6);
    if(position.coords.altitude !== null && position.coords.altitude !== NaN ) {document.getElementById("myAlt").innerHTML = position.coords.altitude.toFixed(2);} else {document.getElementById("myAlt").innerHTML =0};
    PtA = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    PtB = new google.maps.LatLng(-33.811352, 151.240957);
    let PtC = new google.maps.LatLng(-33.818226, 151.189618);
    let disttotarget = google.maps.geometry.spherical.computeDistanceBetween(PtA, PtC);
    let mybearing = bearing(oldLat, oldLng,position.coords.latitude, position.coords.longitude);
    
    if (disttotarget <60) {
        document.getElementById("myHed").innerHTML = "Welcome to Slimbfit, Benjamin!";
        bunnyicon.rotation=0;
        bilMarker.setIcon(bunnyicon);
    } else {
        document.getElementById("myHed").innerHTML = mybearing.toFixed(2);
        bilicon.rotation=mybearing;
        bilMarker.setIcon(bilicon);
    }     
    bilicon.rotation=mybearing;
    bilMarker.setIcon(bilicon);
    let newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    mymap.setCenter(newLatLng);
    console.log(`bilMarker ${bilMarker}`);
    bilMarker.setPosition(newLatLng);
    oldLat=position.coords.latitude;
    oldLng =position.coords.longitude;
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
PtA = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
oldLat = -33.782;
oldLng = 151.244;
//>>>>>>>>>>>>>>>>Accelerometer Section<<<<<<<<<<<<<<<<<<<<<<<<<<<<
let msensor = null;
try { 
    msensor = new Accelerometer({frequency:2});
    msensor.addEventListener('error', event => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
            console.log('Permission to access sensor was denied.');
        } else if (event.error.name === 'NotReadableError' ) {
            console.log('Cannot connect to the sensor.');
        }
    });
    msensor.addEventListener('reading', () => {
        //console.log("Acceleration along X-axis: " + msensor.x);
        //console.log("Acceleration along Y-axis: " + msensor.y;
        //console.log("Acceleration along Z-axis: " + msensor.z);
        absAccelNow=Math.hypot(msensor.x,msensor.y,msensor.z);
        //console.log(`absAccellNow = ${absAccelNow}`);
        document.getElementById("myAclX").innerHTML=msensor.x.toFixed(2);
        document.getElementById("myAclY").innerHTML=msensor.y.toFixed(2);
        document.getElementById("myAclZ").innerHTML=msensor.z.toFixed(2);
        document.getElementById("myAclT").innerHTML=absAccelNow.toFixed(2);
        xFact=msensor.x*10;
        yFact=msensor.z*10;//since phone is vertical , change z axis to yFact
        bilicon.path =  `M32 34 L${32+18*xFact} 34 L${32+18*xFact} 38 L${32+24*xFact} 32 L${32+18*xFact} 26 L${32+18*xFact} 30 L32 30 L34 ${32-18*yFact} L38 ${32-18*yFact} L32 ${32-22*yFact} L26 ${32-18*yFact} L30 ${32-18*yFact}  L30 32 Z`;
       

    });
    msensor.start();
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

// Converts from degrees to radians._____________________________________________________________________________________________________
function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  // Converts from radians to degrees._____________________________________________________________________________________________________
  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  //calculates bearing from boat to target ________________________________________________________________________________________________
  function bearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);
    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
  }

