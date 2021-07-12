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