class Scene_Intro extends Scene 
{
    button;
    blockTimerUntil;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img) 
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);
        this.blockTimerUntil = 2;
        window.addEventListener("click", () => {
            this.blockTimerUntil = 1;
        });
    }

    renderFromTimer(currentTime) 
    {
        super.renderFromTimer(currentTime);

        return this.blockTimerUntil;
    }
}