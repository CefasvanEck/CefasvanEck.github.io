function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

class Scene_Cleanup_Game extends Scene
{
    buttonList = [];
    button_Contact;
    blockTimerUntil;
    showContactInfo;
    img_info;

    dangers_Marked_Count;
    wrong_Marked_Count;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img)
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);

        //Contract met info wat je moet doen
        var button = this.createQuestionButton(" <br> Klik de Objecten <br> die niet zo in de <br> Klimaatbox mogen", "Contract", 
        300, 0,0.025, this.onButtonClickEmptyFunc());
        button.style("font-size", "11px");
        this.buttonList.push(button);
        //End

        //Climate box to fill
        this.buttonList.push(this.createQuestionButton("", "Climate_Box", 450, 0,0.17, this.onButtonClickEmptyFunc()));

        //Containers
        var randomPreset = Math.random() * 100;

        if(randomPreset > 66)
        {
            this.buttonList.push(this.createQuestionButton("", "Container", 150, 0.7,0.525, this.onButtonWrongMarked.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Container_2_Danger", 100, 0.35,0.55, this.onButtonDangerMarked.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Amalgaam_Filter", 110, 0.45,0.55, this.onButtonWrongMarked.bind(this)));
        }
        else if(randomPreset > 33)
        {
            this.buttonList.push(this.createQuestionButton("", "Container", 150, 0.7,0.525, this.onButtonWrongMarked.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Container_2_Danger", 100, 0.35,0.55, this.onButtonDangerMarked.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Amalgaam_Filter", 110, 0.45,0.55, this.onButtonWrongMarked.bind(this)));
        }
        else
        {
            this.buttonList.push(this.createQuestionButton("", "Bag_Danger", 150, 0.7,0.525, this.onButtonDangerMarked.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Container_2", 100, 0.35,0.55, this.onButtonWrongMarked.bind(this)));
            this.buttonList.push(this.createQuestionButton("", "Amalgaam_Filter", 110, 0.45,0.55, this.onButtonWrongMarked.bind(this)));
        }


        this.button_Contact = createButton("Mijn vraag staat er niet tussen.");
        this.button_Contact.mousePressed(this.onButtonClickContact.bind(this));
        this.button_Contact.hide();

        this.blockTimerUntil = 0;
        this.showContactInfo = 0;
        this.dangers_Marked_Count = 0;
        this.wrong_Marked_Count = 0;
        this.img_info = this.refreshLoadImage("Contact_Info.png");
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
        if(this.showContactInfo == 1)
        {
            push();
            imageMode(CENTER);
            image(this.img_info, Main.widthSize / 2, Main.heightSize / 2, Main.widthSize, Main.heightSize);
            pop();
            return 2;
        }

        super.renderFromTimer(currentTime);

        anchorDOM(this.button_Contact, 0.4, 10.46);

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
        ++this.dangers_Marked_Count;
        button.attribute("disabled", "");

        if(this.dangers_Marked_Count == 1)
        {
            this.addObject_HalfScale("check_popup", [0.4, 0.05], 0.2);
        }
        else if(this.dangers_Marked_Count == 2)
        {
            this.addObject_HalfScale("check_popup", [0.45, 0.05], 0.2);
        }
    }

    onButtonWrongMarked(button) 
    {
        ++this.wrong_Marked_Count;
        button.attribute("disabled", "");

        if(this.wrong_Marked_Count == 1)
        {
            this.addObject_HalfScale("cross_popup", [0.5, 0.05], 0.2);
        }
        else if(this.wrong_Marked_Count == 2)
        {
            this.addObject_HalfScale("cross_popup", [0.55, 0.05], 0.2);
        }
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