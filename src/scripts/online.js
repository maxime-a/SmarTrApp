async function saveOnline()
{
    let ssidWord = new Uint8Array(50);
    let passWord = new Uint8Array(50);

    ssid = document.getElementById('ssid').value;
    password = document.getElementById('password').value;

    var enc = new TextEncoder();

    ssidWord = enc.encode(ssid);
    passWord = enc.encode(password);

    
    console.log('>> Writing ssid characteristic');
    console.log(ssidWord);
    try{
        await characteristicSSID.writeValue(ssidWord.buffer);
    }
    catch(error){
        console.log('/!\ Failed writing ssid characteristic' + error);
    }

    console.log('>> Writing password characteristic');
    console.log(passWord);
    try{
        await characteristicPassword.writeValue(passWord.buffer);
    }
    catch(error){
        console.log('/!\ Failed writing password characteristic' + error);
    }
}