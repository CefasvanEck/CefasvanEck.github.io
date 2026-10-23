function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

class Scene_Cleanup_Game extends Scene
{
    //Sounds
    game_Intro;
    buttonList = [];
    button_Contact;
    button_info
    blockTimerUntil;
    showContactInfo;
    img_info;
    playIntroSound;

    dangers_Marked_Count;
    wrong_Marked_Count;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img, fromButton)
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);

        //Contract met info wat je moet doen
        var button = this.createQuestionButton("", "Contract_large", 
        300, 0,0.025, this.onButtonClickEmptyFunc());
        button.style("font-size", "9px");
        this.buttonList.push(button);
        this.button_info = button;
        //End

        var fixHeight = 0;
        if(fromButton)
        {
            fixHeight = -0.05;
        }

        this.game_Intro = loadSound('Afval.mp3');
        this.playIntroSound = false;

        //Containers
        var randomPreset = Math.random() * 100;

        if(randomPreset > 66)
        {
            this.buttonList.push(this.createQuestionButton("", "Container", 150, 0.7,0.525 - fixHeight, this.onButtonNeedle.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Container_2_Danger", 100, 0.35,0.55 - fixHeight, this.onButtonDangerAmalgaamContainer.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Amalgaam_Filter", 110, 0.45,0.55 - fixHeight, this.onButtonAmalgaamFilter.bind(this)));
        }
        else if(randomPreset > 33)
        {
            this.buttonList.push(this.createQuestionButton("", "Container", 150, 0.7,0.525 - fixHeight, this.onButtonNeedle.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Container_2_Danger", 100, 0.35,0.55 - fixHeight, this.onButtonDangerAmalgaamContainer.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Amalgaam_Filter", 110, 0.45,0.55 - fixHeight, this.onButtonAmalgaamFilter.bind(this)));
        }
        else
        {
            this.buttonList.push(this.createQuestionButton("", "Bag_Danger", 150, 0.7,0.525 - fixHeight, this.onButtonDangerNeedleBag.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Container_2", 100, 0.35,0.55 - fixHeight, this.onButtonDangerAmalgaamContainer.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Amalgaam_Filter", 110, 0.45,0.55 - fixHeight, this.onButtonAmalgaamFilter.bind(this)));
        }

        this.failOrSuccID_1 = this.img_object.length;
        this.addObject_HalfScale("check_popup", [0.45, 0.05], 0.2);
        this.img_shouldRender[this.failOrSuccID_1] = 1;

        this.failOrSuccID_2 = this.img_object.length;
        this.addObject_HalfScale("check_popup", [0.5, 0.05], 0.2);
        this.img_shouldRender[this.failOrSuccID_2] = 1;

        this.failOrSuccID_3 = this.img_object.length;
        this.addObject_HalfScale("check_popup", [0.55, 0.05], 0.2);
        this.img_shouldRender[this.failOrSuccID_3] = 1;

        this.addObject_HalfScale("todo_popup", [0.45, 0.05], 0.2);
        this.addObject_HalfScale("todo_popup", [0.5, 0.05], 0.2);
        this.addObject_HalfScale("todo_popup", [0.55, 0.05], 0.2);


        this.button_Contact = createButton("Mijn vraag staat er niet tussen.");
        this.button_Contact.mousePressed(this.onButtonClickContact.bind(this));
        this.button_Contact.hide();

        this.blockTimerUntil = 0;
        this.showContactInfo = 0;
        this.dangers_Marked_Count = 0;
        this.wrong_Marked_Count = 0;
        this.img_info = this.refreshLoadImage("Contract_large.png");

        var buttonRestart = this.createQuestionButton(
            "Klik hier om terug te gaan",
            "",
            300, 0, 0.03,
            this.onButtonRestartClick.bind(this)
        );
        this.buttonList.push(buttonRestart);
    }

    createQuestionButton(text, texturePath, width, positionX, positionY, buttonFunction)
    {
        var button = createButton("");

        if(typeof buttonFunction === "function")
        {
            button.mousePressed(() => {
                buttonFunction(button);
            });
        }

        this.setButtonTextureData(button, texturePath);

        button.size(width, width);
        button.position(Main.widthSize * positionX, Main.heightSize * positionY);
        
        // Tekst-element
        var textElement = document.createElement("span");
        textElement.innerHTML = text;

        textElement.style.position = "absolute";
        textElement.style.left = "0";
        textElement.style.right = "0";
        textElement.style.top = "0";

        textElement.style.textAlign = "center";

        textElement.style.transform = "translateY(30px)";

        textElement.style.whiteSpace = "normal";
        textElement.style.overflowWrap = "break-word";

        // Zorg dat de tekst de muisklik niet opvangt
        textElement.style.pointerEvents = "none";

        button.elt.appendChild(textElement);

        button.hide();

        return button;
    }


    renderFromTimer(currentTime)
    {
        anchorDOM(button, 0.45,0.55);

        if(this.showContactInfo == 1)
        {
            push();
            imageMode(CENTER);
            image(this.img_info, Main.widthSize / 2, Main.heightSize / 2, Main.widthSize, Main.heightSize);
            pop();
            return 2;
        }

        if (!this.playIntroSound && this.game_Intro.isLoaded() && !this.game_Intro.isPlaying()) 
        {
            this.game_Intro.play();
            this.game_Intro.setVolume(1.0);
            this.playIntroSound = true;
        }

        super.renderFromTimer(currentTime);

        if(currentTime == this.maxTimeWhenRenderThis - 1)
        {
            for(var i = 0; i < this.buttonList.length; i++)
            {
                this.buttonList[i].remove();
            }

            this.button_Contact.remove();
        }

        if(currentTime > 315 && this.blockTimerUntil == 0)
        {
            for(var i = 0; i < this.buttonList.length; i++)
            {
                this.buttonList[i].show();
            }

            this.button_Contact.show();
            return 2;
        }

        return this.blockTimerUntil;
    }

    onButtonClick()
    {
        this.blockTimerUntil = 1;
        console.log("klik werkt");
        Main.pickup_DPD.play();
    }

    onButtonDangerMarked(button) 
    {
        this.addFailedDelivery();
        //button.attribute("disabled", "");

        this.button_info.html("Haal Millieu-box op");
    }

    onButtonDangerNeedleBag(button) 
    {
        this.addFailedDelivery();
        //button.attribute("disabled", "");

        this.button_info.html("  De mensen van DRS komen dit helaas wel <br> vaker tegen.   <br> Op de website kunt u grotere naalden  <br>  containers bestellen of een ander aantal. <br> Houd er wel rekening mee dat de <br> meeste contracten maar 2  <br> bezorgmomenten hebben per jaar.");
    }

    onButtonDangerAmalgaamContainer(button) 
    {
        this.addFailedDelivery();
        //button.attribute("disabled", "");

        this.button_info.html("  Dit potje is bedoelt voor het opbergen  <br> van het afvalwater van de afscheider.  <br> Helaas komt het nog wel eens voor dat  <br> emmertjes en andere afval containers <br> zoals deze niet goed dicht zaten en  <br> zijn gaan lekken tijdens het vervoer.");
    }

    onButtonAmalgaamFilter(button) 
    {
        //button.attribute("disabled", "");

        this.button_info.html("  De iconische groene afscheider die zich <br> bevint in bijna elke tandarts stoel.  <br> Er zijn ook andere vormen en formaten  <br> te bestellen. Doet doet u door uw <br> contract aan te passen op de DRS website.");
    }

    onButtonNeedle(button) 
    {
        //button.attribute("disabled", "");

        this.button_info.html("  De opvallende gele naalden <br> containers van DRS.   <br> Op de website kunt u ze in vele  <br>  formaten bestellen of een ander aantal. <br> Houd er wel rekening mee dat de <br> meeste contracten maar 2  <br> bezorgmomenten hebben per jaar.");
    }

    onButtonWrongMarked(button) 
    {
        //button.attribute("disabled", "");
    }


    addFailedDelivery()
    {
        if(this.wrong_Marked_Count == 0 && this.img_shouldRender[this.failOrSuccID_1] > 0)
        {
            this.img_shouldRender[this.failOrSuccID_1] = 0;
            ++this.wrong_Marked_Count;
        }
        else if(this.wrong_Marked_Count == 1 && this.img_shouldRender[this.failOrSuccID_2] > 0)
        {
            this.img_shouldRender[this.failOrSuccID_2] = 0;
            ++this.wrong_Marked_Count;
        }
        else if(this.wrong_Marked_Count == 2 && this.img_shouldRender[this.failOrSuccID_3] > 0)
        {
            this.img_shouldRender[this.failOrSuccID_3] = 0;
            ++this.wrong_Marked_Count;
        }
    }

    onButtonRestartClick()
    {
        var key = "hard_reset_done";

        if (sessionStorage.getItem(key) !== "1") {
            sessionStorage.setItem(key, "1");
            window.location.reload();
        } else {
            sessionStorage.removeItem(key);
        }

        console.log("klik werkt");
    }

    onButtonClickEmptyFunc() {}

    onButtonClickContact()
    {
        for(var i = 0; i < this.buttonList.length; i++)
        {
            this.buttonList[i].remove();
        }

        this.button_Contact.remove();
        this.showContactInfo = 1;
    }

    setButtonTextureData(button, texturePath)
    {
        button.style("background-image", "url('" + texturePath + ".png')");
        button.style("background-size", "contain");
        button.style("background-position", "center");
        button.style("background-repeat", "no-repeat");
        button.style("border", "none");
        button.style("padding", "0");
        button.style("background-color", "transparent");
    }
}