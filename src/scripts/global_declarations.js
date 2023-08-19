/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-07-02 11:56:55
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2023-07-18 22:00:40
 * @ Description: Global declarations for the web interface to an EcoTrap
 */

 let filters = [];
 filters.push({namePrefix: "EcoTrap"});
 
 var myDevice;
 var GeneralService      = 0x0100; 
 var ConfigService       = 0x0200;       
 var MeasurementsService = 0x0300;
 var InfoService         = 0x0400;
 
 var characteristicStatus;
 var characteristicActuators;
 var characteristicCalendar;
 var characteristicSensors;
 var characteristicGeneral;
 var characteristicAlerts;
 
 var connectionToggle;
 var fanState;
 var co2State;
 var lightState;
 var modeAuto; // Mode Auto
 var modeManual;
 
 var mosquitoNumber=0;
 var minTemp=18;
 var maxTemp=35;
 var minHum=20;
 var maxHum=90;
 var networkId=255;
 var machineId=255;
 var childsCounter=0;
 var co2_freq=0;
 var co2_lvl=0;
 var measurementsPeriod=5;
 var temp_sensor_on=1;
 var alerts=0;
