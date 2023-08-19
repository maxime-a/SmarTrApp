/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-07-02 12:14:06
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2022-07-04 09:05:54
 * @ Description: Map part of the web interface to an EcoTrap
 */

/**
 * Find the user position, write it in the caracteristic and update the map
 */
function geoFindMe() {

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        var data = new Float32Array([latitude,longitude]);
        var buffer = new ArrayBuffer(data.byteLength);
        var floatView = new Float32Array(buffer).set(data);
        var byteView = new Uint8Array(buffer); //in little endian DCBA

        characteristicPosition.writeValue(byteView);
        updateMapPosition(latitude,longitude);
    }

    function error() {
        status.textContent = '>> Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
        status.textContent = '>> Geolocation is not supported by your browser';
    } else {
        status.textContent = '>> Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
  
/**
 * Update map pin from given latitude and longitude
 * 
 * @param {float} latitude latitude in degrees
 * @param {float} longitude longitude in degrees
 */
function updateMapPosition(latitude,longitude)
{
const map = document.querySelector('#gmap_canvas');
map.src = 'https://maps.google.com/maps?q='+latitude+','+longitude+'&maptype=satellite&z=15&output=embed'; 
}
  
/**
 * Read and update the map for the position
 * 
 * @returns {Uint8Array} Position caracteristic data
 */
async function readPosition(){
    var value = await characteristicPosition.readValue();
    const positionWord = new Uint8Array(value.buffer);

    // Create a buffer
    var buf = new ArrayBuffer(8);
    // Create a data view of it
    var view = new DataView(buf);

    // set bytes
    positionWord.forEach(function (b, i) {
        view.setUint8(i, b);
    });

    // Read the bits as a float; note that by doing this, we're implicitly
    // converting it from a 32-bit float into JavaScript's native 64-bit double
    var latitude = view.getFloat32(0,true); //true little endian
    var longitude = view.getFloat32(4,true);

    updateMapPosition(latitude,longitude);

    return positionWord;
}