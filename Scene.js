class Scene 
{
    timeWhenRenderThis;
    maxTimeWhenRenderThis;
    img_background;
    //Render texture Objects
    img_object = [];
    img_position = [];
    img_scale = [];
    img_ShowBetweenTime = [];
    img_MoveTo = [];

    text_object = [];
    text_position = [];

    isForeground;
    fadeInStrenght = 0;
    endsWithBlackScreen;


    constructor(minTimeWhenShown, maxTimeWhenShown, background_img) 
    {
        this.timeWhenRenderThis = minTimeWhenShown;

        if(maxTimeWhenShown == null)
        {
            this.maxTimeWhenRenderThis = 100000000;
        }
        else
        {
            this.maxTimeWhenRenderThis = maxTimeWhenShown;
        }
        
        this.img_background = loadImage(background_img + ".png");
    }

    setEndsWithBlackScreen()
    {
        this.endsWithBlackScreen = 1;
    }

    addObject(object_img,objectPosition,object_scale)
    {
        if(object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(loadImage(object_img + ".png"));
        }
        
        this.img_position.push([objectPosition[0],objectPosition[1]]);
        this.img_scale.push(object_scale);
        this.img_ShowBetweenTime.push([0, 0]);
    }
 
    addObject_Timer(object_img,objectPosition,object_scale,object_BetweenTime)
    {
        if(object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(loadImage(object_img + ".png"));
        }

        this.img_position.push([objectPosition[0],objectPosition[1]]);
        this.img_scale.push(object_scale);
        this.img_ShowBetweenTime.push(object_BetweenTime);
    }

    addText(text,text_Position)
    {
        this.text_object.push(text);
        this.text_position.push(([text_Position[0],text_Position[1]]));
    }

    renderScreen(currentTime)
    {
        if(this.timeWhenRenderThis == currentTime || (currentTime >= this.timeWhenRenderThis && currentTime <= this.maxTimeWhenRenderThis))
        {
            return this.renderFromTimer(currentTime);
        }
        else return 0;
    }

    renderFromTimer(currentTime) 
    {
        push();
        imageMode(CENTER);

        if((this.fadeInStrenght > 0 && currentTime > this.timeWhenRenderThis) || this.fadeInStrenght == 0)
        {
            // Draw the background
            if(!this.isForeground)
            {
                image(this.img_background, Main.widthSize / 2, Main.heightSize / 2, Main.widthSize, Main.heightSize);
            }
        }

        for(var i = 0;i < this.img_object.length;++i)
        {
            imageMode(CENTER);
            // Draw
            if ((this.img_ShowBetweenTime[i][0] === 0 && this.img_ShowBetweenTime[i][1] === 0) || (currentTime >= this.img_ShowBetweenTime[i][0] && currentTime <= this.img_ShowBetweenTime[i][1]))
            {
                if (this.img_object[i] instanceof p5.MediaElement)
                {
                    if (!this.img_object[i].playedOnce)
                    {
                        this.img_object[i].play();
                        this.img_object[i].playedOnce = true;
                    }
                    image(
                    this.img_object[i],
                    Main.widthSize * this.img_position[i][0],
                    Main.heightSize * this.img_position[i][1],
                    Main.widthSize * this.img_scale[i],
                    Main.heightSize * this.img_scale[i]
                    ); 
                }
                else
                {
                    image(this.img_object[i], width * this.img_position[i][0],Main.heightSize * this.img_position[i][1], Main.heightSize * this.img_scale[i], Main.heightSize * this.img_scale[i]);
                }
            }
        }

        for(var j = 0;j < this.text_object.length;++j)
        {
            textSize(30);
            fill(255);
            text(this.text_object[j], Main.widthSize * this.text_position[j][0], Main.heightSize * this.text_position[j][1]);
        }

        //If part needs to be overlapped over the .mp4 that contains the animation
        if(this.isForeground)
        {
            image(this.img_background, Main.widthSize / 2, Main.heightSize / 2, Main.widthSize, Main.heightSize);
        }

        if(this.endsWithBlackScreen == 1 && currentTime >= this.maxTimeWhenRenderThis - 20 && currentTime <= this.maxTimeWhenRenderThis - 1)
        {
            fill(0);
            noStroke();
            rect(0, 0, Main.widthSize, Main.heightSize);
        }
        pop();

        return 1;
    }  
}