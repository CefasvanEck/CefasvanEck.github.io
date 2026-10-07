class Scene_Intro extends Scene 
{
    //This extention was created because Web-Browsers have a build-in system that prevents auto-playing of any kind of audio file.
    //Action by the User must be taken to start playing the audio.
    //For testing, Testers and Target Audience needed to click a Button to agree to Terms and Conditions anyway.
    button;
    blockTimerUntil;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img) 
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);
        this.blockTimerUntil = 2;
        //Unlocks and starts playing the Animation
        window.addEventListener("click", () => {
            this.blockTimerUntil = 1;
        });
    }

    //Render anything on screen, super. from Scene.js
    renderFromTimer(currentTime) 
    {
        super.renderFromTimer(currentTime);
        //Return value if it should start playing the animation yes or no.
        return this.blockTimerUntil;
    }
}