/**
 * @ Author: Joé HATIER
 * @ Create Time: 2022-07-14 
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2022-07-14 
 * @ Description: AI and QUIZZ pop up part
 */






/* ############################################################################*/
/*                                  QUIZZ                                      */
/* ############################################################################*/

/*=============== SHOW MODAL ===============*/
 modalInfo1 = document.getElementById('modal_Info1');

const showModal = ( modalContent) =>{    
    modalContainer = document.getElementById(modalContent)
    if( quizzDemand ){
        modalContainer.classList.add('show-modal')
        modalInfo1.style.display = 'none';   
    }
}
showModal('modal-container')


/*=============== CLOSE MODAL ===============*/
const closeBtn = document.querySelectorAll('.close-modal')

function closeModal(){
    const modalContainer = document.getElementById('modal-container')
    modalContainer.classList.remove('show-modal')
}
closeBtn.forEach(c => c.addEventListener('click', closeModal))



/**
 * When the user click OK, we close the popup and send values
 */
async function OKModal(){
    const modalContainer = document.getElementById('modal-container')
    modalContainer.classList.remove('show-modal')
    quizzDemand = false; 

    let AIWord = new Uint8Array(2);
    console.log('>> Reading AI');
    AIWord = await readAI();
    console.log('>> AI readed');
    console.log(AIWord);

    if(document.getElementById("option-1").checked){
        AIWord[5]=0b00000001;
    } else if(document.getElementById("option-3").checked) {
        AIWord[5]=0b00000011;
    } else {
        AIWord[5]=0b00000010;
    }

    console.log('>> Writing AI caracteristic');
    console.log(AIWord);
    try{
      await characteristicAI.writeValue(AIWord);
    }
    catch(error){
      console.log('/!\ Failed writing AI caracteristic' + error);
    }
}
document.getElementById('OKButton').addEventListener("click",OKModal);


/** More info display */ 
infoBtn = document.getElementById('moreInfoButton');

function displayInfo (){
    infoBtn.style.display = 'none';
    modalInfo1.style.display = 'block';
}
infoBtn.addEventListener("click",displayInfo);





















/* ############################################################################*/
/*                                  IA CONFIG                                  */
/* ############################################################################*/


/********************************  Slider  ************************************/
treshold1 = document.getElementById('slider1');
treshold2 = document.getElementById('slider2');
treshold3 = document.getElementById('slider3');
randomCoeff = document.getElementById('sliderRandomCoeff');
impactCoeff = document.getElementById('sliderImpactCoeff');


function updateDonut(percent, element){
    //var percent = 45;
    if (percent < 50){
      offset = (360 / 100) * percent;
      element.parentNode.querySelector("#section3").style.webkitTransform = "rotate(" + offset + "deg)";
      element.parentNode.querySelector("#section3 .item").style.webkitTransform = "rotate(" + (180 - offset) + "deg)";
      element.parentNode.querySelector("#section3").style.msTransform = "rotate(" + offset + "deg)";
      element.parentNode.querySelector("#section3 .item").style.msTransform = "rotate(" + (180 - offset) + "deg)";
      element.parentNode.querySelector("#section3").style.MozTransform = "rotate(" + offset + "deg)";
      element.parentNode.querySelector("#section3 .item").style.MozTransform = "rotate(" + (180 - offset) + "deg)";
      element.parentNode.querySelector("#section3 .item").style.backgroundColor = "#E64C65";
    } else { 
      offset = ((360 / 100) * percent) - 180;
      element.parentNode.querySelector("#section3").style.webkitTransform = "rotate(180deg)";
      element.parentNode.querySelector("#section3 .item").style.webkitTransform = "rotate(" +  offset + "deg)";
      element.parentNode.querySelector("#section3").style.msTransform = "rotate(180deg)";
      element.parentNode.querySelector("#section3 .item").style.msTransform = "rotate(" +  offset + "deg)";
      element.parentNode.querySelector("#section3").style.MozTransform = "rotate(180deg)";
      element.parentNode.querySelector("#section3 .item").style.MozTransform = "rotate(" +  offset + "deg)";   
      element.parentNode.querySelector("#section3 .item").style.backgroundColor = "#41A8AB";
    }
    element.parentNode.querySelector("span").innerHTML = percent + "%";
    
  /*  if(element == treshold1){
        treshold1Value = percent;
        minTreshold2 = parseInt(treshold1Value, Number)+10;
        document.getElementById('input2').setAttribute('min', minTreshold2);
        updateSlider(document.getElementById('input2'));
    } else if(element == treshold2){
        treshold2Value = percent;    
    } else if(element = treshold3){
        treshold3Value = percent;
    } */

    switch(element)
    {
        case treshold1:
            treshold1Value = percent;
            minTreshold2 = parseInt(treshold1Value, Number)+10;
            document.getElementById('input2').setAttribute('min', minTreshold2);
            updateSlider(document.getElementById('input2'));
            break;

        case treshold2:
            treshold2Value = percent; 
            break;

        case treshold3:
            tresholdOnValue = percent;
            break;
        
        case randomCoeff:
            randomCoeffValue = percent; 
            break;

        case impactCoeff:
            impactCoeffValue = percent;
            break;
    }
}
  




function updateSlider(element) {
if (element) {
    
    console.log(" element de updateSlider() :", element, " value : ", element.value, " parent => ", element.parentNode);

    var parent = element.parentElement;
    var thumb = parent.querySelector('.range-slider__thumb'),
        bar = parent.querySelector('.range-slider__bar'),
        pct = element.value * ((parent.clientHeight - thumb.clientHeight) / parent.clientHeight);
    thumb.style.bottom = pct + '%';
    bar.style.height = 'calc(' + pct + '% + ' + thumb.clientHeight / 2 + 'px)';
    thumb.textContent = element.value + '%';
}
updateDonut(element.value, element.parentNode);
}

    



(function initAndSetupTheSliders() {
    [].forEach.call(document.getElementsByClassName("slider-big-container"), function(el) {
    var inputs = [].slice.call(el.querySelectorAll('.range-slider input'));
    inputs.forEach(function (input) {
        
        input.setAttribute('value', '50');
        updateSlider(input);

        input.addEventListener('input', function (element) {
            updateSlider(input);
        });

        input.addEventListener('change', function (element) {
            updateSlider(input);
        });
    });
    });
}());






/********************************  Info AI  ************************************/

/*=============== SHOW MODAL ===============*/

function showInfoAI(){
    console.log(" salut la zone !!")
    modalContainer = document.getElementById('InfoTreshold-container');
    modalContainer.classList.add('show-ai-modal');
}

/*=============== CLOSE MODAL ===============*/

const BtnClose= document.querySelectorAll('.close-ai-modal')

function closeAIModal(){
    console.log("normalement ca devrait se fermer")
    const modalContainer = document.getElementById('InfoTreshold-container')
    modalContainer.classList.remove('show-ai-modal');
}
BtnClose.forEach(c => c.addEventListener('click', closeAIModal))



defaultButton = document.getElementById('ai-default-setting');
input1 = document.getElementById('input1');
input2 = document.getElementById('input2');
inputOn = document.getElementById('inputOn');


function defaultSetting (){
    
    input1.setAttribute('value', defaultTreshold1);
    updateSlider(input1);
    input2.setAttribute('value', defaultTreshold2);
    updateSlider(input2);
    inputOn.setAttribute('value', defaultTresholdON);
    updateSlider(inputOn);
    console.log(" default AI setting ");
    console.log(defaultTreshold1, defaultTreshold2, defaultTresholdON);
}

applyButton = document.getElementById('ai-apply');

async function apply (){
    console.log(" apply ");

    let AIWord = new Uint8Array(2);
    console.log('>> Reading AI');
    AIWord = await readAI();
    console.log('>> AI readed');
    console.log(AIWord);

    AIWord[0] = treshold1Value;
    AIWord[1] = treshold2Value;
    AIWord[2] = tresholdOnValue;
    AIWord[3] = impactCoeffValue;
    AIWord[4] = randomCoeffValue;



    console.log("On envoie les donnees suivantes : ");
    console.log(treshold1Value,treshold2Value, tresholdOnValue, impactCoeffValue, randomCoeffValue);



    console.log('>> Writing AI caracteristic');
    console.log(AIWord);
    try{
      await characteristicAI.writeValue(AIWord);
    }
    catch(error){
      console.log('/!\ Failed writing AI caracteristic' + error);
    }
}