class Scene
{
    timeWhenRenderThis;
    maxTimeWhenRenderThis;
    img_background;

    // Render texture objects
    img_object = [];
    img_position = [];
    img_rotation = [];
    img_scale = [];
    img_shouldRender = [];
    img_ShowBetweenTime = [];
    img_MoveTo = [];

    text_object = [];
    text_position = [];

    isForeground;
    fadeInStrenght = 0;
    endsWithBlackScreen;

    zeroToLastLoop;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img)
    {
        this.timeWhenRenderThis = minTimeWhenShown;
        this.zeroToLastLoop = false;

        if (maxTimeWhenShown == null)
        {
            this.maxTimeWhenRenderThis = 100000000;
        }
        else
        {
            this.maxTimeWhenRenderThis = maxTimeWhenShown;
        }

        this.img_background = this.refreshLoadImage(background_img + ".png");
    }


    setEndsWithBlackScreen()
    {
        this.endsWithBlackScreen = 1;
    }


    addObject(object_img, objectPosition, object_scale)
    {
        if (object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(this.refreshLoadImage(object_img + ".png"));
        }

        this.img_position.push([objectPosition[0], objectPosition[1]]);
        this.img_rotation.push(0);
        this.img_scale.push(object_scale);
        this.img_shouldRender.push(0);
        this.img_ShowBetweenTime.push([0, 0]);
    }

    addObject_HalfScale(object_img, objectPosition, object_scale)
    {
        if (object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(this.refreshLoadImage(object_img + ".png"));
        }

        this.img_position.push([objectPosition[0], objectPosition[1]]);
        this.img_rotation.push(-1);
        this.img_scale.push(object_scale);
        this.img_shouldRender.push(0);
        this.img_ShowBetweenTime.push([0, 0]);
    }

    removeObject(idToRemove)
    {
        if (this.img_object[idToRemove] !== undefined)
        {
            this.img_object.splice(idToRemove, 1);
        }

        if (this.img_position[idToRemove] !== undefined)
        {
            this.img_position.splice(idToRemove, 1);
        }

        if (this.img_rotation[idToRemove] !== undefined)
        {
            this.img_rotation.splice(idToRemove, 1);
        }

        if (this.img_scale[idToRemove] !== undefined)
        {
            this.img_scale.splice(idToRemove, 1);
        }

        if (this.img_shouldRender[idToRemove] !== undefined)
        {
            this.img_shouldRender.splice(idToRemove, 1);
        }

        if (this.img_ShowBetweenTime[idToRemove] !== undefined)
        {
            this.img_ShowBetweenTime.splice(idToRemove, 1);
        }

        if (this.img_MoveTo[idToRemove] !== undefined)
        {
            this.img_MoveTo.splice(idToRemove, 1);
        }
    }

    addObjectRotation(object_img, objectPosition, objectRotation, object_scale)
    {
        if (object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(this.refreshLoadImage(object_img + ".png"));
        }

        this.img_position.push([objectPosition[0], objectPosition[1]]);
        this.img_rotation.push(objectRotation);
        this.img_scale.push(object_scale);
        this.img_shouldRender.push(0);
        this.img_ShowBetweenTime.push([0, 0]);
    }

    addObject_Car(object_img, objectPosition, object_scale)
    {
        if (object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(this.refreshLoadImage(object_img + ".png"));
        }

        this.img_position.push([objectPosition[0], objectPosition[1]]);
        this.img_rotation.push(-5);
        this.img_scale.push(object_scale);
        this.img_shouldRender.push(0);
        this.img_ShowBetweenTime.push([0, 0]);
    }


    addObject_Timer(object_img, objectPosition, object_scale, object_BetweenTime)
    {
        if (object_img.includes("."))
        {
            let vid = createVideo(object_img + "mp4");
            this.img_object.push(vid);
        }
        else
        {
            this.img_object.push(this.refreshLoadImage(object_img + ".png"));
        }

        this.img_position.push([objectPosition[0], objectPosition[1]]);
        this.img_rotation.push(0);
        this.img_scale.push(object_scale);
        this.img_shouldRender.push(0);
        this.img_ShowBetweenTime.push(object_BetweenTime);
    }

    addText(text, text_Position)
    {
        this.text_object.push(text);
        this.text_position.push([text_Position[0], text_Position[1]]);
    }

    renderScreen(currentTime)
    {
        if (this.timeWhenRenderThis == currentTime || (currentTime >= this.timeWhenRenderThis && currentTime <= this.maxTimeWhenRenderThis))
        {
            return this.renderFromTimer(currentTime);
        }
        else
        {
            return 0;
        }
    }

    renderBackground(currentTime)
    {
        if((this.fadeInStrenght > 0 && currentTime > this.timeWhenRenderThis) || this.fadeInStrenght == 0)
        {
            // Draw the background
            if(!this.isForeground)
            {
                image(this.img_background, Main.widthSize / 2, Main.heightSize / 2, Main.widthSize, Main.heightSize);
            }
        }
    }

    renderFromTimer(currentTime) 
    {
        push();
        imageMode(CENTER);

        this.renderBackground(currentTime);

        if(!this.zeroToLastLoop)
        {
            for(var i = this.img_object.length - 1;i > 0;--i)
            {
                this.renderLoop(currentTime, i);
            }
        }
        else
        {
            for(var i = 0;i < this.img_object.length;++i)
            {
                this.renderLoop(currentTime, i);
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

    renderLoop(currentTime, i)
    {
        imageMode(CENTER);
        // Draw
        if (this.img_shouldRender[i] == 0 && ((this.img_ShowBetweenTime[i][0] === 0 && this.img_ShowBetweenTime[i][1] === 0) || (currentTime >= this.img_ShowBetweenTime[i][0] && currentTime <= this.img_ShowBetweenTime[i][1])))
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
                if (this.img_rotation[i] > 0 || this.img_rotation[i] == -5)
                {
                    const scaleFactor = Math.min(width / Main.widthSize, height / Main.heightSize);

                    push();
                    translate((width - Main.widthSize * scaleFactor) / 2, (height - Main.heightSize * scaleFactor) / 2);
                    scale(scaleFactor);

                    translate(Main.widthSize * this.img_position[i][0], Main.heightSize * this.img_position[i][1]);
                    if (this.img_rotation[i] > 0)
                    {
                        rotate(this.img_rotation[i]);
                        this.img_rotation[i] -= 0.15;
                        if (this.img_rotation[i] < 0)
                        {
                            this.img_rotation[i] = 360 - 0.15;
                        }
                    }

                    image(this.img_object[i], 0, 0, Main.widthSize * this.img_scale[i], Main.widthSize * this.img_scale[i]);
                    pop();
                }
                else if(this.img_rotation[i] < 0)
                {
                    image(this.img_object[i], width * this.img_position[i][0],Main.heightSize * this.img_position[i][1], Main.heightSize * this.img_scale[i], (Main.heightSize / 2) * this.img_scale[i]);
                }
                else
                {
                    image(this.img_object[i], width * this.img_position[i][0],Main.heightSize * this.img_position[i][1], Main.heightSize * this.img_scale[i], Main.heightSize * this.img_scale[i]);
                }
            }
        }
    }


    refreshLoadImage(imagePath)
    {
        return loadImage(imagePath + (imagePath.includes("?") ? "&" : "?") + "v=" + Date.now());
    }
}