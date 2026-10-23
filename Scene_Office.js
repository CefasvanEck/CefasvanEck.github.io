function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

class Scene_Office extends Scene 
{
    button_WholeProduct;
    button_ClimateBoxDelivery;
    button_MarkHazardWaste;
    button_CompanyInfo;
    blockTimerUntil;
    showContactInfo;
    img_info;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img) 
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);

        this.button_WholeProduct = createButton("Vanaf het begin");
        this.button_WholeProduct.mousePressed(this.onButtonAllClick.bind(this));
        this.button_WholeProduct.hide();
        this.button_WholeProduct.style("background-color", "#B7E4C7");



        this.button_ClimateBoxDelivery = createButton("Vragen over de milieubox");
        this.button_ClimateBoxDelivery.mousePressed(this.onButtonDeliveryClick.bind(this));
        this.button_ClimateBoxDelivery.hide();
        this.button_ClimateBoxDelivery.style("background-color", "#B7E4C7");
 

      
        this.button_MarkHazardWaste = createButton("Vragen over Afval");
        this.button_MarkHazardWaste.mousePressed(this.onButtonHazard.bind(this));
        this.button_MarkHazardWaste.hide();
        this.button_MarkHazardWaste.style("background-color", "#B7E4C7");
      
        this.button_CompanyInfo = createButton("Mijn vraag staat er niet tussen.");
        this.button_CompanyInfo.mousePressed(this.onButtonClickContact.bind(this));
        this.button_CompanyInfo.hide();
        this.button_CompanyInfo.style("background-color", "#B7E4C7");
        this.blockTimerUntil = 0;
        this.showContactInfo = 0;

        this.img_info = this.refreshLoadImage("Contact_Info.png");
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

            
            anchorDOM(this.button_WholeProduct, 0.35, 0.425);
            anchorDOM(this.button_ClimateBoxDelivery, 0.35, 0.46);
            anchorDOM(this.button_MarkHazardWaste, 0.35, 0.495);
            
            anchorDOM(this.button_CompanyInfo, 0.35, 0.535);
            
            //Remove main menu buttons
            if(this.blockTimerUntil == 1)
            {
                this.button_WholeProduct.remove();
                this.button_MarkHazardWaste.remove();
                this.button_CompanyInfo.remove();
                this.button_ClimateBoxDelivery.remove();
            }

            if(currentTime > 315 && this.blockTimerUntil == 0)
            {
                textSize(22);
                noFill();
                stroke(255);
                strokeWeight(2);
                text('Met DRS, waar kan ik u mee helpen?', Main.widthSize * 0.0055, Main.heightSize * 0.5);

                text('Klik op de vraag die u heeft:', Main.widthSize * 0.35, Main.heightSize * 0.4);
                this.button_WholeProduct.show();
                this.button_ClimateBoxDelivery.show();
                this.button_MarkHazardWaste.show();
                this.button_CompanyInfo.show();
                return 2;
            }
            else return this.blockTimerUntil;
        }
    }


    onButtonAllClick()
    {
        Main.blockTimer = false;
        this.blockTimerUntil = 1;
        Main.playTimer = 447;
        Main.scenes.push(new Scene_Cleanup_Game(3100,8000,"Dentist_Office",true));
    }

    onButtonDeliveryClick()
    {
        Main.blockTimer = false;
        this.blockTimerUntil = 1;
        Main.playTimer = 447;
    }

    onButtonHazard()
    {
        this.button_WholeProduct.remove();
        this.button_MarkHazardWaste.remove();
        this.button_ClimateBoxDelivery.remove();
        this.button_CompanyInfo.remove();
        Main.scenes.length = 0;
        Main.playTimer = 455;
        Main.scenes.push(new Scene_Cleanup_Game(0,3000,"Dentist_Office",true));
        this.blockTimerUntil = 1;
        Main.blockTimer = false;
        console.log("klik werkt");
    }

    onButtonClickContact()
    {
        this.button_WholeProduct.remove();
        this.button_MarkHazardWaste.remove();
        this.button_ClimateBoxDelivery.remove();
        this.button_CompanyInfo.remove();
        this.showContactInfo = 1;
        this.blockTimerUntil = 1;
    }
}