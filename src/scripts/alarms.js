/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-07-02 12:07:11
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2022-07-08 10:43:03
 * @ Description: The alarms part of the web interface to an EcoTrap
 */

/**
 * Check if the start time is before the end time
 * 
 * @param {time} startTime  Hour, minute and second of the start time 
 * @param {time} endTime    Hour, minute and second of the end time 
 * @return {boolean}  True if valid , false otherwise
 */
function isBefore(startTime,endTime)
{
    if(startTime.h < endTime.h)
        return true;
    else if(startTime.h === endTime.h)
    {
        if(startTime.m < endTime.m)
        return true;
        else if(startTime.m === endTime.m)
        {
        if(startTime.s < endTime.s)
            return true;
        else
            return false;
        }
        else
        return false;
    }
    else
        return false;
}

/**
 * Check if the end time is after the start time
 * 
 * @param {time} startTime  Hour, minute and second of the start time 
 * @param {time} endTime    Hour, minute and second of the end time 
 * @return {boolean}  True if valid , false otherwise
 */
function alarmTimesValid(startTime,endTime)
{
    return isBefore(startTime,endTime)
}

/**
 * Check if the to alarms ranges are intersecting or if range 2 is before range 1
 * 
 * @param {time} startAlarm1 
 * @param {time} endAlarm1 
 * @param {time} startAlarm2 
 * @param {time} endAlarm2 
 * @return {boolean}  True if valid , false otherwise
 */
function alarmsValid(startAlarm1,endAlarm1,startAlarm2,endAlarm2)
{
    var i=0;
    possibleIntersection = false;

    /* Checking if the two ranges as days in common */
    for(var days in startAlarm1.d)
    {
        if(startAlarm1.d[days] && startAlarm2.d[days])
        {
        possibleIntersection = true;
        break;
        }
    }
    if(possibleIntersection)
    {
        /* If each range is valid then the alarms are valid if the second one is striclty aftr the first*/
        if( alarmTimesValid(startAlarm1,endAlarm1)&&alarmTimesValid(startAlarm2,endAlarm2)&&
            isBefore(endAlarm1,startAlarm2) )
        return true;
        else
        return false;
    }

    return true
}

/**
 * Write in the calendar caracteristic the configured alarms
 */
async function setTimes() 
{

    let calendarWord = new Uint8Array(42);

    start1_hours = 0;
    end1_hours = 0;
    start2_hours = 0;
    end2_hours = 0;
    start1_minutes = 0;
    end1_minutes = 0;
    start2_minutes = 0;
    end2_minutes = 0;
    start1_seconds = 0;
    end1_seconds = 0;
    start2_seconds = 0;
    end2_seconds = 0;
    start1_days = 0;
    start2_days = 0;

    // Set current time
    const d = new Date();
    calendarWord[11]=parseInt(d.getHours().toString(),16); //parseInt to convert d.getHours to bcd
    calendarWord[12]=parseInt(d.getMinutes().toString(),16);
    calendarWord[13]=parseInt(d.getSeconds().toString(),16);

    calendarWord[7]=parseInt((d.getFullYear()-2000).toString(),16); // -2000 because rtc only take tens 
    calendarWord[8]=parseInt((d.getMonth()+1).toString(),16); // +1 because date return 0 to 11 and rtc take 1 to 12 
    calendarWord[9]=parseInt(d.getDate().toString(),16);
    calendarWord[10]=convDayofWeek(d.getDay());

    // Alarm 1
    var start1 = document.getElementById('start1').value;

    var alarm1days = {
        mon:false,
        tue:false,
        wed:false,
        thu:false,
        fri:false,
        sat:false,
        sun:false
    }

    /* Setting alarm 1 values */
    if(document.getElementById('alarm1Switch').checked)
    {
        calendarWord[14] = 1;
    }
    else
    {
        calendarWord[14] = 0;
    }

        start1_hours = parseInt(start1.substring(0,2),16);
        start1_minutes = parseInt(start1.substring(3,5),16);
        start1_seconds = parseInt(start1.substring(6),16);

        var end1 = document.getElementById('end1').value;
        end1_hours = parseInt(end1.substring(0,2),16);
        end1_minutes = parseInt(end1.substring(3,5),16);
        end1_seconds = parseInt(end1.substring(6),16);

    if(document.getElementById('mon1').checked)
    {
        start1_days+=1;
        alarm1days.mon=true;
    }
    if(document.getElementById('tue1').checked)
    {
        start1_days+=2;
        alarm1days.tue=true;
    }
    if(document.getElementById('wed1').checked)
    {
        start1_days+=4;
        alarm1days.wed=true;
    }
    if(document.getElementById('thu1').checked)
    {
        start1_days+=8;
        alarm1days.thu=true;
    }
    if(document.getElementById('fri1').checked)
    {
        start1_days+=16;
        alarm1days.fri=true;
    }
    if(document.getElementById('sat1').checked)
    {
        start1_days+=32;
        alarm1days.sat=true;
    }
    if(document.getElementById('sun1').checked)
    {
        start1_days+=64;
        alarm1days.sun=true;
    }

    // Alarm 2
    var start2 = document.getElementById('start2').value;

    var alarm2days = {
        mon:false,
        tue:false,
        wed:false,
        thu:false,
        fri:false,
        sat:false,
        sun:false
    }

    /* Setting alarm 2 values */
    if(document.getElementById('alarm2Switch').checked)
    {
        calendarWord[28] = 1;
    }
    else
    {
        calendarWord[28] = 0;
    }

    start2_hours = parseInt(start2.substring(0,2),16);
    start2_minutes = parseInt(start2.substring(3,5),16);
    start2_seconds = parseInt(start2.substring(6),16);

    var end2 = document.getElementById('end2').value;
    end2_hours = parseInt(end2.substring(0,2),16);
    end2_minutes = parseInt(end2.substring(3,5),16);
    end2_seconds = parseInt(end2.substring(6),16);

    if(document.getElementById('mon2').checked)
    {
        start2_days+=1;
        alarm2days.mon=true;
    }
    if(document.getElementById('tue2').checked)
    {
        start2_days+=2;
        alarm2days.tue=true;
    }
    if(document.getElementById('wed2').checked)
    {
        start2_days+=4;
        alarm2days.wed=true;
    }
    if(document.getElementById('thu2').checked)
    {
        start2_days+=8;
        alarm2days.thu=true;
    }
    if(document.getElementById('fri2').checked)
    {
        start2_days+=16;
        alarm2days.fri=true;
    }
    if(document.getElementById('sat2').checked)
    {
        start2_days+=32;
        alarm2days.sat=true;
    }
    if(document.getElementById('sun2').checked)
    {
        start2_days+=64;
        alarm2days.sun=true;
    }

    var startAlarm1 = {
        d:alarm1days,
        h:start1_hours,
        m:start1_minutes,
        s:start1_seconds
    }

    var endAlarm1 = {
        h:end1_hours,
        m:end1_minutes,
        s:end1_seconds
    }

    var startAlarm2 = {
        d:alarm2days,
        h:start2_hours,
        m:start2_minutes,
        s:start2_seconds
    }

    var endAlarm2 = {
        h:end2_hours,
        m:end2_minutes,
        s:end2_seconds
    }

    alarm1Enabled = document.getElementById('alarm1Switch').checked;
    alarm2Enabled = document.getElementById('alarm2Switch').checked;

    if(alarmTimesValid(startAlarm1,endAlarm1))
    {
        if(alarmsValid(startAlarm1,endAlarm1,startAlarm2,endAlarm2) || !alarm2Enabled)
        {
        calendarWord[17] = start1_days;
        calendarWord[18] = start1_hours;
        calendarWord[19] = start1_minutes;
        calendarWord[20] = start1_seconds;

        calendarWord[25] = end1_hours;
        calendarWord[26] = end1_minutes;
        calendarWord[27] = end1_seconds;
        }
        else
        {
        console.log(">> Problem : Alarms together not valid");
        }
    }
    else
    {
        console.log(">> Alarm 1 is not valid. Disabling alarm 1");
        calendarWord[14] = 0;
    }

    if(alarmTimesValid(startAlarm2,endAlarm2))
    {
        if(alarmsValid(startAlarm1,endAlarm1,startAlarm2,endAlarm2) || !alarm1Enabled)
        {
        calendarWord[31] = start2_days;
        calendarWord[32] = start2_hours;
        calendarWord[33] = start2_minutes;
        calendarWord[34] = start2_seconds;

        calendarWord[39] = end2_hours;
        calendarWord[40] = end2_minutes;
        calendarWord[41] = end2_seconds;
        }
    }
    else
    {
        console.log(">> Alarm 2 is not valid. Disabling alarm 2");
        calendarWord[28] = 0;
    }

    console.log(">> Writing on calendar caracteristic...");
    console.log(calendarWord);
    try{
        await characteristicCalendar.writeValue(calendarWord);
        console.log(">> Write is succesful")
    }
    catch(error){
        console.log('Argh! ' + error);
    }
}

/**
 * Disable graphical components of alarm1
 */
function disableAlarm1()
{
    //document.getElementById('start1').value = "";
    //document.getElementById('end1').value = "";
}

/**
 * Disable graphical components of alarm2
 */
function disableAlarm2()
{
    //document.getElementById('start2').value = "--:--:--";
    //document.getElementById('end2').value = "--:--:--";
}

/**
 * Convert number of the day given by the date in js to the encoding of the product BLE spec.
 * 
 * @param {number} dayNum The number of the day in the week. Sunday is 0 , Saturday is 6.
 * @returns {number} The decimal value caused by the presence of the bit in the byte representing
 *                   the weekday according to the product spec. Monday LSB to Sunday bit n°6. 
 *               
 */
function convDayofWeek(dayNum)
{
    var dayBit;

    switch(dayNum)
    {
        case 0:
        dayBit = 64;
        break;
        case 1:
        dayBit = 1;
        break;
        case 2:
        dayBit = 2;
        break;
        case 3:
        dayBit = 4;
        break;
        case 4:
        dayBit = 8;
        break;
        case 5:
        dayBit = 16;
        break;
        case 6:
        dayBit = 32;
        break;
        default:
        dayBit = 1;
        break;
    }

    return dayBit
}