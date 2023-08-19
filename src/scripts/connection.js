/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-07-02 12:04:08
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2022-08-15 12:12:13
 * @ Description: Connection part to the web interface to an EcoTrap
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * On connection button click toggle between connection and disconnection
 */
function connection()
{
    if(!myDevice)
    {
        connectionToggle=1;
        connect();
    }
    else
    {
        connectionToggle=0;
        disconnect();
    }
}

/**
 * Connection to bluetooth device 
 */
async function connect()
{
    console.log("connecting...");

    document.getElementById('connection-text').innerHTML = "Connecting...";

    let servicesNeeded = [GeneralService,MeasurementsService,ConfigService,InfoService];

    try {
    console.log('Requesting any Bluetooth Device...');
    myDevice = await navigator.bluetooth.requestDevice({
        filters,
        optionalServices : servicesNeeded});
    myDevice.addEventListener('gattserverdisconnected', disconnect);
    console.log('Connecting to GATT Server...');
    const server = await myDevice.gatt.connect();

    // Note that we could also get all services that match a specific UUID by
    // passing it to getPrimaryServices().
    console.log('Getting Services...');
    const services = await server.getPrimaryServices();

    console.log('Getting Characteristics...');
    for (const service of services) {
        console.log('> Service: ' + service.uuid);
        const characteristics = await service.getCharacteristics();

        characteristics.forEach(characteristic => {
        console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
            getSupportedProperties(characteristic));
        
            switch(characteristic.uuid){
                /* Status */
                case "00000101-0000-1000-8000-00805f9b34fb":
                    characteristicStatus=characteristic;
                    break;
                /* Actuators */
                case "00000102-0000-1000-8000-00805f9b34fb":
                    characteristicActuators=characteristic;
                    break;
                /* Actuators notif */
                case "00000103-0000-1000-8000-00805f9b34fb":
                    characteristic.startNotifications();
                    sleep(500);
                    characteristic.oncharacteristicvaluechanged = handleActuatorsNotif;
                    break;
                /* General */
                case "00000201-0000-1000-8000-00805f9b34fb":
                    characteristicGeneral=characteristic;
                    break;

                /* Sensors */
                case "00000202-0000-1000-8000-00805f9b34fb":
                    characteristicSensors=characteristic;
                    break;

                /* Calendar */
                case "00000203-0000-1000-8000-00805f9b34fb":
                    characteristicCalendar=characteristic;
                    break;

                /* Measurements */
                case "00000301-0000-1000-8000-00805f9b34fb":
                    characteristic.startNotifications();
                    sleep(500);
                    characteristic.oncharacteristicvaluechanged = handleDataMeasurements;
                    break;
                
                /* Alerts */
                case "00000401-0000-1000-8000-00805f9b34fb":
                    characteristicAlerts=characteristic;
                    characteristic.startNotifications();
                    sleep(500);
                    characteristicAlerts.oncharacteristicvaluechanged = handleDataAlerts;
                    break;
            }
        });
    }
    /* Change the connection button color to green */
    document.getElementById('connection-img').style.color = 'green';
    document.getElementById('connection-img').removeAttribute("class","bx-x-circle");
    document.getElementById('connection-img').setAttribute("class","bx bx-check-circle connection-button");
    document.getElementById('connection-text').innerHTML = "Connected to " + myDevice.name;

    var delayInMilliseconds = 1500;

    globalInit();

    setTimeout(function() {
        window.location.href = "#dashboard";
    }, delayInMilliseconds);

    } catch(error) {
    console.log('Argh! ' + error);
    document.getElementById('connection-text').innerHTML = "Not connected";
    }
}

/** Create a string with the properties of a characteristics */
function getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
      if (characteristic.properties[p] === true) {
        supportedProperties.push(p.toUpperCase());
      }
    }
    return '[' + supportedProperties.join(', ') + ']';
}

/** Disconnection handler */
function disconnect()
{
    if (myDevice) {
        myDevice.gatt.disconnect();
        myDevice=0;
        /* button turn to off */
        window.location.href = "#connection";
        document.getElementById('connection-img').style.color = 'red';
        document.getElementById('connection-img').removeAttribute("class","bx bx-check-circle connection-button");
        document.getElementById('connection-img').setAttribute("class","bx bx-x-circle connection-button");
        document.getElementById('connection-text').innerHTML = "Not connected";
    }
}