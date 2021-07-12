let heigh_scoure  = document.getElementById('heigh_scoure');
let next_levelBtn = document.querySelector('.next_level');

let gameOverAndNextLevelBtnContainer = document.querySelector('.gameOverAndNextLevelBtnContainer');


setInterval(()=>{
    setHeighScoure();
}, 100);



function setHeighScoure(){
    let prevHeighScoure    = parseInt(heigh_scoure.innerText);
    let currentHeighScoure = localData.get('heighScoure');

    if(prevHeighScoure !== currentHeighScoure){
        heigh_scoure.innerText = (currentHeighScoure) ? currentHeighScoure : 0;
    }
}


function checkNextLevelStatus()
{
    gameOverAndNextLevelBtnContainer.classList.add('active');
    if(totallife>0 && shouldGoNextLevel)
    {
        deactive.classList.remove('deactive');
    }
}