let defaultSettupArray = [
    {level: 1},
    {life: 2},
    {isSystemPause: false},
    {levelScoureLimitDefault: 5},
    {scoureRate: 5},
    {scoure: 0},
    {heighScoure: 0},
    {shouldGoNextLevel: 0},
    {isGameOver: 0},
];


if(!localData.exist())
{
    defaultSettupArray.forEach(obj=>{
        localData.set(obj);
    });
}








/* cavnas basic config start */
    let bgImageWidth  = 800;
    let bgImageHeight = 300;
    let canvas        = document.getElementById('canvas1');
    let context       = canvas.getContext('2d');

    function resizeCanvas(){
        canvas.width  = bgImageWidth;
        canvas.height = bgImageHeight;
    }
    resizeCanvas();
/* cavnas basic config end */


/* game pause/start maneger start */
    let isSystemPause = localData.get('isSystemPause');
    let isPause       = true;
    let toggleStart   = document.getElementById('toggleStart');


    toggleStart.addEventListener('click', (e)=>
    {
        togglePause();
        if(toggleStart.innerText !== 'Pause'){
            toggleStart.innerText = 'Pause';
        }else{
            toggleStart.innerText = 'Start';
        }
    });
    

    function togglePause()
    {
        if(!isSystemPause)
        {
            isPause = !isPause;
            run_background_music(!isPause);
        }
    }
/* game pause/start maneger end */






/* scoure, level, life controller start */
    let life  = localData.get('life');
    let level = localData.get('level');


    let levelScoureLimitDefault = localData.get('levelScoureLimitDefault');
    let levelUplimit            = levelScoureLimitDefault * level;
    
    let obstacleSpeed = 1+level;
    let scoureRate	  = localData.get('scoureRate');
    let scoure    	  = localData.get('scoure');
    
    let lifeElement   = document.getElementById('life');
    let scoureElement = document.getElementById('scoure');
    let levelElement  = document.getElementById('level');
    
    function updateGameData()
    {
        lifeElement.innerText   = life;
        scoureElement.innerText = scoure;
        levelElement.innerText  = level;

        if(life===0)
        {
            togglePause();
            localData.set({isGameOver: 1}, true);
            isSystemPause = true;
        }
    }
/* scoure, level, life controller end */




/* sound start */
    let dieAudio      = new MyAudio('./audio/die.wav', 0.1);
    let bgAudio       = new MyAudio('./audio/bgMusic.mp3', 0.3, true);
    let scourAudio    = new MyAudio('./audio/scour.wav', 0.01);
    let level_upAudio = new MyAudio('./audio/level_up.wav', 0.01);
/* sound end */

function run_background_music(status=true){
    if(status)
    {
        bgAudio.play();
    }else{
        bgAudio.stop();
    }
}









/* work with Background start */
    class Background
    {
        constructor(bgTree)
        {
            this.x  = 0;
            this.y  = 0;

            this.vx = obstacleSpeed * 0.9;
            this.vy = 0;

            this.bgTree = bgTree;
        }

        draw(){
            context.drawImage(this.bgTree, this.x, this.y, canvas.width, canvas.height);
            context.drawImage(this.bgTree, this.x+canvas.width, this.y, canvas.width, canvas.height);
        }

        update()
        {
            if(this.x < -canvas.width){
                this.x = 0
            }
            this.x -= this.vx;
        }
    }

    let backgroundImage;
    function setBackgroundImage(level){
        let bgTree = new Image();
        bgTree.src = `./background/${level}.jpg`;
        bgTree.addEventListener('load', ()=>{
            backgroundImage = new Background(bgTree);
        });
    }

    setBackgroundImage(level);
    function manageBackgroundTree(){
        backgroundImage.draw();
        backgroundImage.update();
    }
/* work with Background end */




/* level up start */
    function levelUp()
    {
        if(scoure>=levelUplimit)
        {
            level_upAudio.play();
            
            localData.set({life: 1});
            localData.set({level: 1});
            localData.set({shouldGoNextLevel: 1}, true);

            level = localData.get('level');
            life  = localData.get('life');

            // set speed for new level
            obstacleSpeed = 1+level;
            
            levelUplimit = (scoure+levelScoureLimitDefault * level);

            setBackgroundImage(level);
        }
    }
/* level up end */





/* obstacle start */
    class Obstacle{
        constructor(gap=0)
        {
            this.fillColor = `hsl(${Math.floor(Math.random()*20+1)*(360/20)}deg, 80%, 50%)`;

            this.vx = (obstacleSpeed*0.8);
            this.vy = 0;
            
            this.minGap = 100;
            this.maxGap = 200;
            this.obstacleGap = Math.floor(Math.random()*this.maxGap + this.minGap);

            this.height = canvas.height-this.obstacleGap;
            this.width  = Math.floor(Math.random() * 50 +20)
            
            
            this.x = canvas.width;
            this.y = ((Math.random()*2)-1)>0 ? canvas.height-this.height : 0;
            
            this.canReduceLife = true;
            this.canScourUp    = true;
        }
        
        draw(){
            context.fillStyle   = this.fillColor;
            context.strokeStyle = "#fff";
            context.lineWidth   = 3;

            context.fillRect(this.x, this.y, this.width, this.height);
            context.strokeRect(this.x, this.y, this.width, this.height);

            context.restore();
        }

        update(){
            this.x -= this.vx;
        }
    }

    let obstacleArray     = [];
    let obstaclePrintCtrl = 0;

    function manageObstacle()
    {
        let interval = ((100-(level*2))<level) ? level : (100-(level*2));
        
        obstaclePrintCtrl++;

        if(obstaclePrintCtrl % interval === 0){
            obstacleArray.push(new Obstacle());
        }


        for(let i = 0; i<obstacleArray.length; i++)
        {
            if(obstacleArray[i].x < -obstacleArray[i].width){
                obstacleArray.splice(i, 1);
                i--;
            }else{
                if(obstacleArray.length)
                {
                    obstacleArray[i].update();
                    obstacleArray[i].draw();
                }
            }
        }
    }
/* obstacle start */





/* player part start */
    let birdImage = new Image();
    birdImage.src = './bird.png';

    class Player{
        constructor()
        {
            /* bird data start */
            this.flyController= 0;
            this.totleFrames  = 14;
            this.spriteWidth  = Math.floor(2562/this.totleFrames);
            this.spriteHeight = 183;
            this.currentFrame = 0;

            this.flySpeed     = 5;
            /* bird data end */


            this.pWidth  = Math.floor(this.spriteWidth/4);
            this.pHeight = Math.floor(this.spriteHeight/4);

            this.radius = (this.pWidth/2);
            
            this.x  = this.pWidth;
            this.y  = (canvas.height/2)-(this.pWidth/2);

            this.vx = 0;
            this.vy = 2+level;

            this.dx = 0;
            this.dy = 1;


            this.pressed = 0;

            this.keyControll();
        }
        
        draw()
        {
            context.beginPath();
            context.fillStyle='#fff3';
            // context.arc(this.x, this.y, this.radius, 0, 360);
            // context.fill();
            // context.closePath();
            context.fillRect(this.x, this.y, (this.pWidth-5), (this.pHeight-5));

            context.drawImage(birdImage, this.spriteWidth*this.currentFrame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.pWidth, this.pHeight);
            
        }


        update()
        {
            /* bird image flying animation start */
                this.flyController++;
                if(this.flyController % Math.floor(this.flySpeed) == 0){
                    ((this.totleFrames-1)<=(this.currentFrame)) ? this.currentFrame = 0 : this.currentFrame++;
                }
            /* bird image flying animation end */


            this.x += this.vx;
            
            if(this.y<0)
            {
                this.y = 0;
            } else if((this.y+this.pHeight)>canvas.height)
            {
                this.y = (canvas.height-this.pHeight);
            }else{
                this.y += (this.vy*this.dy);
            }
        }
        
        keyControll(){
            window.addEventListener('keydown', (e)=>
            {
                if(e.code === 'Space')
                {
                    // jumpAudio.play();
                    this.dy = -1;
                }
            });
            
            window.addEventListener('keyup', (e)=>{
                if(e.code === 'Space')
                {
                    this.dy = +1;
                }
            });
        }
    }
    let player = new Player();
/* player part end */






function ditectCollitionWithPlayer()
{
    for(let i = 0; i<obstacleArray.length; i++)
    {
        let obstacle  = obstacleArray[i];
        let obstacleX = obstacle.x;
        let obstacleY = obstacle.y;
        let obstacleW = obstacle.height;
        let obstacleH = obstacle.width;

        let colition         = ditectRectColition(player.x,player.y,player.pWidth,player.pHeight, obstacleX,obstacleY,obstacleW,obstacleH);
        let colitionForScour = ditectRectColition(player.x,player.y,player.pWidth,player.pHeight, obstacleX,obstacleY,obstacleW,obstacleH, true);

        
        if(obstacle.canReduceLife)
        {
            if(colition)
            {                
                localData.set({life:-1});
                life--;

                dieAudio.play();
                obstacle.canReduceLife = false;
                // togglePause();
            }
        }
        
        if(obstacle.canScourUp)
        {
            if(colitionForScour)
            {
                updateGameSpeedAndScour();
                obstacle.canScourUp = false;
            }
        }
    }
}


function updateGameSpeedAndScour()
{
    localData.set({scoure: (scoureRate*level)});

    
    scoure = scoure+(scoureRate*level);
    
    let heigh_scoure = localData.get('heighScoure');
    if(heigh_scoure<scoure)
    {
        localData.set({heighScoure: scoure}, true);
    }

    scourAudio.play();
    levelUp();
}




function animate()
{
    if(!isPause)
    {
        updateGameData();

        context.clearRect(0, 0, canvas.width, canvas.height);
    
        manageBackgroundTree();
        manageObstacle();
        
        player.update();
        player.draw();
    
        ditectCollitionWithPlayer();
    }


    requestAnimationFrame(animate);
}
animate();

// window.addEventListener('mousemove', animate);