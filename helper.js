/* localStorageData controller start */
    let localData = [];
    localData.set = (object, replacePrevValue=false)=>
    {
        let dataArray = localStorage.getItem('birdUpDown');
            dataArray = (dataArray) ? JSON.parse(dataArray) : [];
        
        let myObjectKey   = Object.keys(object)[0];
        let myObjectValue = object[myObjectKey];

        
        let isUpdatedDataArray = false;
        for(let i = 0; i<dataArray.length; i++)
        {
            let singleData = dataArray[i];

            if(!replacePrevValue && singleData[myObjectKey]>=0)
            {
                singleData[myObjectKey]  = (singleData[myObjectKey]+myObjectValue);
                isUpdatedDataArray = true;
                break;
            }

            if(replacePrevValue && Object.keys(singleData)[0] === myObjectKey)
            {
                console.log(dataArray.length);
                dataArray.splice(i, 1);
                isUpdatedDataArray = false;
                console.log(dataArray.length);
                i--;
                break;
            }
        }

        if(!isUpdatedDataArray){
            dataArray.push(object);
        }
        
        
        localStorage.setItem('birdUpDown', JSON.stringify(dataArray));
    }

    localData.get = (param)=>
    {
        let data      = localStorage.getItem('birdUpDown');
        let dataArray = (data) ? JSON.parse(data) : [];

        
        let value;

        for(let i = 0; i<dataArray.length; i++)
        {
            let singleData = dataArray[i];
            
            if(Object.keys(singleData)[0] === param)
            {
                value = Object.values(singleData)[0];
                return value;
            }
        }
    }

    localData.exist = ()=>{
        if(localStorage.getItem('birdUpDown')){
            return true;
        }
        return false;
    }
/* localStorageData controller end */





/* audio helper start */
    class MyAudio{
        constructor(audioSrc, volume, loop=false){
            this.audioElement = false;
            this.volume       = 0;
            this.audioSrc     = audioSrc;
            this.volume       = volume;
            this.loop         = loop;

            this.load();
        }

        load()
        {
            this.audioElement = new Audio(this.audioSrc);
            this.audioElement.volume = this.volume;
            return this;
        }
        
        play()
        {
            this.reset();

            if(this.audioElement.paused)
            {
                this.duration = this.audioElement.duration;
                this.audioElement.loop   = this.loop;

                this.audioElement.play();
                return this.audioElement;
            }
        }

        stop()
        {
            if(!this.audioElement.paused)
            {
                this.audioElement.pause()
            }
        }

        reset(){
            
            if(this.audioElement)
                this.audioElement.currentTime = 0;
        }
    }
/* audio helper end */





/* this method ditect collition between circle and rect */
function ditectCircleRectColition(x,y,r, X,Y,W,H, onlyXColition=false)
{
    /* x ditection start */
        let leftX  = X-(x+r);
        let rightX = (x-r)-(X+W);

        let xDitection = (leftX<=0 && rightX<=0);
    /* x ditection end */

    if(!onlyXColition)
    {
        /* y ditection start */
            let topY    = Y-(y+r);
            let bottomY = (y-r) - (Y+H);

            let yDitection = topY<=0 && bottomY<=0;
        /* y ditection end */

        return (xDitection && yDitection);
    }
    return (xDitection);
}


/* this method ditect collition between two rect */
function ditectRectColition(x,y,w,h, X,Y,W,H, onlyXColition=false){
    /* x ditection start */
        let L1 = x;
        let L2 = X;
        let R1 = (x+w);
        let R2 = (X+W);

        let xDitection = R1>L2 && R2>L1;
    /* x ditection end */

    if(!onlyXColition)
    {
        /* y ditection start */
            let T1 = y;
            let T2 = Y;
            let B1 = y+h;
            let B2 = Y+H;

            let yDitection = B1>T2 && B2>T1;
        /* y ditection end */

        
        return (xDitection && yDitection);
    }

    return (xDitection);
}