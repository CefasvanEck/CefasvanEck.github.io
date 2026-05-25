function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

class Scene_Office extends Scene 
{
    button;
    blockTimerUntil;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img) 
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);

        this.button = createButton("Ik heb van jullie de milieubox ontvangen maar wanneer komen jullie het vieze ophalen?");
        this.button.mousePressed(this.onButtonClick.bind(this));
        this.button.hide();
        this.blockTimerUntil = 0;
    }

    renderFromTimer(currentTime) 
    {
        super.renderFromTimer(currentTime);

        anchorDOM(this.button, 0.4, 0.43);

        if(currentTime == this.maxTimeWhenRenderThis - 1)
        {
            this.button.remove();
        }

        if(currentTime > 315 && this.blockTimerUntil == 0)
        {
            textSize(22);
            noFill();
            stroke(255);
            strokeWeight(2);
            text('Met DRS, waar kan ik u mee helpen?', Main.widthSize * 0.0055, Main.heightSize * 0.5);

            text('Klik op uw vraag:', Main.widthSize * 0.4, Main.heightSize * 0.4);
            this.button.show();
            return 2;
        }
        else return this.blockTimerUntil;
    }

    onButtonClick()
    {
        this.blockTimerUntil = 1;
        console.log("klik werkt");
        Main.pickup_DPD.play();
    }
}