function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

class Scene_Office extends Scene 
{
    button;
    button_Contact;
    blockTimerUntil;
    showContactInfo;
    img_info;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img) 
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);

        this.button = createButton("Vragen over de milieubox");
        this.button.mousePressed(this.onButtonClick.bind(this));
        this.button.hide();

        this.button_Contact = createButton("Mijn vraag staat er niet tussen.");
        this.button_Contact.mousePressed(this.onButtonClickContact.bind(this));
        this.button_Contact.hide();
        this.blockTimerUntil = 0;
        this.showContactInfo = 0;

        this.img_info = loadImage("Contact_Info.png");
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
        else
        {
            super.renderFromTimer(currentTime);

            anchorDOM(this.button, 0.4, 0.43);
            anchorDOM(this.button_Contact, 0.4, 0.46);
            

            if(currentTime == this.maxTimeWhenRenderThis - 1)
            {
                this.button.remove();
                this.button_Contact.remove();
            }

            if(currentTime > 315 && this.blockTimerUntil == 0)
            {
                textSize(22);
                noFill();
                stroke(255);
                strokeWeight(2);
                text('Met DRS, waar kan ik u mee helpen?', Main.widthSize * 0.0055, Main.heightSize * 0.5);

                text('Klik op de vraag die u heeft:', Main.widthSize * 0.4, Main.heightSize * 0.4);
                this.button.show();
                this.button_Contact.show();
                return 2;
            }
            else return this.blockTimerUntil;
        }
    }

    

    onButtonClick()
    {
        this.blockTimerUntil = 1;
        console.log("klik werkt");
        Main.pickup_DPD.play();
        sendMail('Watched video until Question in Office Scene with ID: ' + Main.watcherID + ' Question Clicked: ');
    }

    onButtonClickContact()
    {
        this.button.remove();
        this.button_Contact.remove();
        this.showContactInfo = 1;
        sendMail('Has other Question Office Scene with ID: ' + Main.watcherID);
    }
}