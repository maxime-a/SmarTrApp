/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-07-02 12:01:52
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2023-07-18 22:41:27
 * @ Description: Dashboard part of the web interface to an EcoTrap
 */


/**
 * On fan button click toggle between on and off
 */
async function fan()
{
    let actuatorsWord = new Uint8Array(2);

    console.log('>> Reading actuators');
    actuatorsWord = await readActuators();
    console.log('>> Actuators readed');
    console.log(actuatorsWord);

    if(modeManual)
    {
        if(!fanState)
        {
            fanState=1;
            document.getElementById('fan-img').style.color = 'green';
            actuatorsWord[1]=0x01 | actuatorsWord[1];
        }
        else
        {
            fanState=0;
            document.getElementById('fan-img').style.color = 'var(--text-color)';
            actuatorsWord[1]=0b11111110 & actuatorsWord[1];
        }
    }

    console.log('>> Writing actuators characteristic');
    console.log(actuatorsWord);
    try{
    await characteristicActuators.writeValue(actuatorsWord);
    }
    catch(error){
    console.log('/!\ Failed writing actuators characteristic' + error);
    }
}

/**
 * On co2 button click toggle between on and off
 */
async function co2()
{
    let actuatorsWord = new Uint8Array(2);

    console.log('>> Reading actuators');
    actuatorsWord = await readActuators();
    console.log('>> Actuators readed');
    console.log(actuatorsWord);

    if(modeManual)
    {
        if(!co2State)
        {
            co2State=1;
            document.getElementById('co2-img').style.color = 'green';
            actuatorsWord[1]=0x02 | actuatorsWord[1];
        }
        else
        {
            co2State=0;
            document.getElementById('co2-img').style.color = 'var(--text-color)';
            actuatorsWord[1]=0b11111101 & actuatorsWord[1];
        }
    }

    console.log('>> Writing actuators characteristic');
    console.log(actuatorsWord);
    try{
    await characteristicActuators.writeValue(actuatorsWord);
    }
    catch(error){
    console.log('/!\ Failed writing actuators characteristic' + error);
    }
}

/**
 * On light button click toggle between on and off
 */
async function light()
{
    let actuatorsWord = new Uint8Array(2);

    console.log('>> Reading actuators');
    actuatorsWord = await readActuators();
    console.log('>> Actuators readed');
    console.log(actuatorsWord);

    if(modeManual)
    {
        if(!lightState)
        {
            lightState=1;
            document.getElementById('light-img').style.color = 'green';
            actuatorsWord[1]=0x04 | actuatorsWord[1];
        }
        else
        {
            lightState=0;
            document.getElementById('light-img').style.color = 'var(--text-color)';
            actuatorsWord[1]=0b11111011 & actuatorsWord[1];
        }
    }

    console.log('>> Writing actuators characteristic');
    console.log(actuatorsWord);
    try{
    await characteristicActuators.writeValue(actuatorsWord);
    }
    catch(error){
    console.log('/!\ Failed writing actuators characteristic' + error);
    }
}
 






function showLockers(){
    lockers = document.getElementsByClassName("locker");
    for(let i=0;i<lockers.length;i++){lockers[i].style.visibility='visible';}
}

function hideLockers(){
    lockers = document.getElementsByClassName("locker");
    for(let i=0;i<lockers.length;i++){lockers[i].style.visibility='hidden';}
}

/**
 * When the user click to switch to AUTO mode
 * Only one mode can be active at the same time
 */
async function funcModeAuto()
{
    if(!modeAuto){
        // we were not in the auto mode
        let statusWord = new Uint8Array(2);
        // reading the current value of the characteristic
        console.log('>> Reading status');
        statusWord = await readStatus();
        // printing it on the terminal 
        console.log('>> status readed');
        console.log(statusWord);

        // changing the value of the mode variables
        modeAuto=1;
        modeManual=0;
        
        // changing the color of the icons on the screen. (green for active / gray for not active)
        document.getElementById('auto-img').style.color = 'green';
        document.getElementById('manual-img').style.color = 'var(--text-color)';

        // showing small lock on the screen, because we are not in manual mode
        showLockers();

        // setting the new status characteristic to send to the mother board
        statusWord[1]= 0b11111100 & statusWord[1]; // set the 2 LSB to 0
        statusWord[1]= 0b00000001 | statusWord[1]; // set the auto mode combinaison, refering to the specs

        console.log('>> Writing status characteristic');
        console.log(statusWord);
        // checking if the characteristic is well written
        try{
            await characteristicStatus.writeValue(statusWord);
        }
        catch(error){
            console.log('/!\ Failed writing actuators characteristic' + error);
        }
    }   
}




/**
 * Switch to Manual mode
 */
async function funcModeManual()
{
  

    if(!modeManual)
    {
        let statusWord = new Uint8Array(2);

        console.log('>> Reading status');
        statusWord = await readStatus();
        console.log('>> status readed');
        console.log(statusWord);

        modeAuto=0;
        modeManual=1;

        document.getElementById('manual-img').style.color = 'green';
        document.getElementById('auto-img').style.color = 'var(--text-color)';

        hideLockers();
        
        statusWord[1]= 0b11111100 & statusWord[1]; // on met les 2 LSB à 0;

        console.log('>> Writing status characteristic');
        console.log(statusWord);
        try{
            await characteristicStatus.writeValue(statusWord);
        }
        catch(error){
            console.log('/!\ Failed writing actuators characteristic' + error);
        }
    }
    else
    {
        console.log(" doit cliquer sur un autre mode que le mode Manual ");
        /*
        modeAuto=0;
        document.getElementById('auto-img').style.color = 'var(--text-color)';
        
        hideLockers();

        statusWord[1]=0b11111101 & statusWord[1];*/
    }

  
}






/**
 * Handle measurements notification
 */
function handleDataMeasurements(event) {
    // get the data buffer from the event
    var buf = new Uint8Array(event.target.value.buffer);
    // debug trace
    console.log(">> Measurements data received : ")
    // convert bytes to corresponding values
    voltage = (buf[15]*255+buf[16])/1000;
    temperature = (buf[17]*255+buf[18])/10;
    humidity = buf[19];
    co2_val = (buf[13]*255+buf[14]);
    mosquito = buf[12];
    // update UI
    document.getElementById('voltage-value').innerHTML  =   'Voltage ' + voltage.toFixed(1).toString() + 'V';

    if (temp_sensor_on)
    {
        document.getElementById('temperature-value').innerHTML  =   temperature.toFixed(1).toString() + '°C';
        document.getElementById('humidity-value').innerHTML     =   humidity.toString() + '%';
        document.getElementById('co2-value').innerHTML          =   co2_val.toString() + 'ppm';
    }
    else
    {
        updatedashboard();
    }


}

/**
 * Handle actuators notification
 */
function handleActuatorsNotif(event) {
    // get the data buffer from the event
    var buf = new Uint8Array(event.target.value.buffer);
    // debug trace
    console.log(">> Actuators data received : ")
    console.log(buf)
    //check bits
    if(buf[1]&0b00000001)
    {
        document.getElementById('fan-img').style.color = 'green';
    }
    else
    {
        document.getElementById('fan-img').style.color = 'var(--text-color)';
    }
    if(buf[1]&0b00000010)
    {
        document.getElementById('co2-img').style.color = 'green';
    }
    else
    {
        document.getElementById('co2-img').style.color = 'var(--text-color)';
    }
    if(buf[1]&0b00000100)
    {
        document.getElementById('light-img').style.color = 'green';
    }
    else
    {
        document.getElementById('light-img').style.color = 'var(--text-color)';
    }
}


function updatedashboard(){

    if(alerts == 0)
    {
        document.getElementById("alerts-dash").style.visibility = "hidden";   
        document.getElementById("alerts-img").style.animation = '';
        document.getElementById("alerts-icon").style.animation = '';
    }
    else
    {
        document.getElementById("alerts-dash").style.visibility = "visible";  
        document.getElementById("alerts-img").style.animation = "blink 1s infinite"; 
        document.getElementById("alerts-icon").style.animation = "blink 1s infinite";   
    }

    if ((machineId != 0))
    {
    console.log("Disbale all input");
    document.getElementById("temperature").style.visibility = "hidden";
    document.getElementById("humidity").style.visibility = "hidden";    
    document.getElementById("ranges").style.visibility = "hidden";
    document.getElementById("timers").style.visibility = "hidden";
    document.getElementById("CO2-lvl").style.visibility = "hidden";
    document.getElementById("CO2-freq").style.visibility = "hidden";
    document.getElementById("childs-counter").style.visibility = "hidden";

    }
    else
    {
        console.log("Enable all input");
        document.getElementById("temperature").style.visibility = "visible";
        document.getElementById("humidity").style.visibility = "visible";    
        document.getElementById("ranges").style.visibility = "visible";
        document.getElementById("timers").style.visibility = "visible";
        document.getElementById("CO2-lvl").style.visibility = "visible";
        document.getElementById("CO2-freq").style.visibility = "visible";
        document.getElementById("childs-counter").style.visibility = "visible";

        if (temp_sensor_on == 0)
        {
            document.getElementById("temperature-img").style.color = "red";
            document.getElementById("temperature-value").style.color = "red";
        
            document.getElementById("humidity-img").style.color = "red";
            document.getElementById("humidity-value").style.color = "red";
        
            document.getElementById("co2-txt").style.color = "red";
            document.getElementById("co2-value").style.color = "red";

            document.getElementById('temperature-value').innerHTML  =   'OFF';
            document.getElementById('humidity-value').innerHTML     =   'OFF';
            document.getElementById('co2-value').innerHTML          =   'OFF';
        
            document.getElementById("temp-title").style.color = "red";
            document.getElementById("humidity-title").style.color = "red";
        }
        else
        {
            document.getElementById("temperature-img").style.color =  0x707070;
            document.getElementById("temperature-value").style.color = 0x707070;
        
            document.getElementById("humidity-img").style.color = 0x707070;
            document.getElementById("humidity-value").style.color = 0x707070;
        
            document.getElementById("co2-txt").style.color = 0x707070;
            document.getElementById("co2-value").style.color = 0x707070;

            document.getElementById("temp-title").style.color = 0x707070;
            document.getElementById("humidity-title").style.color = 0x707070;            
        }
    }
}

