/**
 * @ Author: Joé HATIER
 * @ Create Time: 2022-08-13
 * @ Modified by: Victor Derain
 * @ Modified time: 2023-07-26 18:28:50
 * @ Description: Alerts part of the web interface to an EcoTrap
 */



/**
 * Handle measurements notification
 */
 function handleDataAlerts(event) {
    //location.href ="#alerts";


    // get the data buffer from the event
    var buf = new Uint8Array(event.target.value.buffer);
    // debug trace
    console.log(">> Alerts data received : ")
    console.log(buf);

    strNotAlive = "Trap not detected : ";
    strNotAlive_Nb = "";
    strOutOfCo2 = "Trap out of Co2 : ";
    strOutOfCo2_Nb = "";
    strNotBatteryLow = "Trap not detected : ";
    strNotBatteryLow_Nb = "";
    strFanFault = "Trap out of Co2 : ";
    strFanFault_Nb = "";
    strSensorFault = "Sensor not working";

    alerts = 0;

    for (let i = 0; i < buf.length; i++) {
        if(buf[i]&0b00000001){ // Not Detected
            alerts = 1; 
            console.log("la trap ", i, " est morte..." );
            if(strNotAlive_Nb != "")
            {
                strNotAlive_Nb +=  " & n°" + i;
            }
            else
            {
                strNotAlive_Nb +=  i;
            }

            document.getElementById("deadTrap").innerHTML = strNotAlive + "machine(s) n°" + strNotAlive_Nb;
        }

        if(buf[i]&0b00000010){ // Out of Co2
            alerts = 1;
            console.log("la trap ", i, " est out of Co2..." );
            if(strOutOfCo2_Nb != "")
            {
                strOutOfCo2_Nb +=  " & n°" + i;
            }
            else
            {
                strOutOfCo2_Nb +=  i;
            }  
            document.getElementById("deadCo2").innerHTML = strOutOfCo2 + "machine(s) n°" + strOutOfCo2_Nb;
        }

        if(buf[i]&0b00000100){ // Battery HS
            alerts = 1;
            console.log("la trap ", i, " battery low..." );
            strNotAlive_Nb +=  i + " ,";  
            document.getElementById("deadBat").innerHTML = strNotBatteryLow + "machine n°" + strNotBatteryLow_Nb;
        }

        if(buf[i]&0b00001000){ // Fan Default
            alerts = 1;
            console.log("la trap ", i, " fan fault..." );
            strOutOfCo2_Nb +=  i + " ,";  
            document.getElementById("deadFan").innerHTML = strFanFault + "machine n°" + strFanFault_Nb;
        }

        if(buf[i]&0b00010000){ // Sensor Default
            console.log("la trap ", i, " Sensor fault..." );
            temp_sensor_on = 0;
            alerts = 1;
            updatedashboard();
        }
        else
        {
            temp_sensor_on = 1;
            updatedashboard();
        }  
    }
}  

    





    
    // convert bytes to corresponding values
    // temperature = (buf[17]*255+buf[18])/10;
    // humidity = buf[19];
    // mosquito = buf[12];
    // update UI
    // document.getElementById('temperature-value').innerHTML  =   temperature.toFixed(1).toString() + '°C';
    // document.getElementById('humidity-value').innerHTML     =   humidity.toString() + '%';
    // document.getElementById('mosquitoes-value').innerHTML   =   mosquito.toString();
