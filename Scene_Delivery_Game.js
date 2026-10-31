function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

class Scene_Delivery_Game extends Scene 
{
    button_Contact;
    blockTimerUntil;
    showContactInfo;
    img_info;

    mainClass;

    //Switch between DPD and DRS, Game Play Element
    button_CarSwitch_GPE;
    button_DropOrCollectBox_GPE;
    isCarDPD;
    currentCar;
    //Info Display text
    questMessage;
    extraMessage;

    //Game Play Element
    houseNumbRendered;
    gameplayTimer_GPE;
    switchTimer_GPE;
    questFailTimer_GPE;
    currentSecond;
    spawnedBoxDelay_GPE;
    spawnedBoxTimer_GPE;
    spawnedHouseNumberTimer_GPE
    pickupBoxTimer_GPE;
    buildingNumberToDeliver_GPE;
    buildingNumberInWorld_GPE;
    deliveryType_GPE;
    coundBackgroundLoop;
    failedCounter_GPE
    //Save ID's of Failed or Succesful delivery Icons
    failOrSuccID_1;
    failOrSuccID_2;
    failOrSuccID_3;
    //
    failOrSuccID_4;
    failOrSuccID_5;
    failOrSuccID_6;


    questType;
    
    Box_Obj;
    droppedBoxPosition = [];
    Contract_Obj;

    DRS_Animation;
    DPD_Animation;
    BoxDropoff_Animation;

//Trees spawn random and get removed like the boxes when outside the screen
    img_background_loop;
    Street_Bckgrnd;
    Dentist_Bckgrnd;

    Country_Side_sundown;
    Dentist_sundown;
    
    spawnChangeHousenumber;

    constructor(minTimeWhenShown, maxTimeWhenShown, background_img, main) 
    {
        super(minTimeWhenShown, maxTimeWhenShown, background_img);
        this.mainClass = main;
        //Set the backgrounds of the game
        this.img_background_loop = this.img_background;

        this.Street_Bckgrnd = this.img_background;
        this.Country_Side_sundown = this.refreshLoadImage("Country_Side_sundown.png");
        this.Dentist_sundown = this.refreshLoadImage("dentistBuilding_background_dawn.png");
        this.Dentist_Bckgrnd = this.refreshLoadImage("dentistBuilding_background.png");
        this.coundBackgroundLoop = 0;
        //End

        this.questMessage = "Box ophalen";
        this.questType = 0;
        
        this.button_CarSwitch_GPE = createButton("Wissel tussen auto's");
        this.button_CarSwitch_GPE.mousePressed(this.onButtonCarSwitchClick.bind(this));
        this.button_CarSwitch_GPE.hide();
        this.button_CarSwitch_GPE.html("Wissel naar DRS auto");
        this.button_CarSwitch_GPE.style("background-color", "#DDFFF0");

        this.button_DropOrCollectBox_GPE = createButton("Bezorg Millieu-box");
        this.button_DropOrCollectBox_GPE.mousePressed(this.onButtonDropBox.bind(this));
        this.button_DropOrCollectBox_GPE.hide();
        this.button_DropOrCollectBox_GPE.style("background-color", "#FFD1D1");

        this.button_DropOrCollectBox_GPE.style("border", "none");
        this.button_DropOrCollectBox_GPE.style("background-image", "url('Climate_Box.png')");
        this.button_DropOrCollectBox_GPE.style("background-size", "cover");
        

        this.button_Contact = createButton("Mijn vraag staat er niet tussen.");
        this.button_Contact.mousePressed(this.onButtonClickContact.bind(this));
        this.button_Contact.hide();
        this.blockTimerUntil = 0;
        this.showContactInfo = 0;
        this.img_info = this.refreshLoadImage("Contact_Info.png");

        //Set time
        this.gameplayTimer_GPE = 0;
        this.currentSecond = new Date().getMilliseconds();
        
        this.switchTimer_GPE = 60;
        this.spawnedBoxTimer_GPE = 0;
        this.spawnedHouseNumberTimer_GPE = 0;
        this.questFailTimer_GPE = 0;
        this.spawnedBoxDelay_GPE = 0;
        this.houseNumbRendered = false;
        this.spawnChangeHousenumber = 50;


        //Set House number of Dentist Clinic, first objective
        this.buildingNumberToDeliver_GPE = Math.floor(Math.random() * 65);
        this.buildingNumberInWorld();

        this.extraMessage = "Milieubox bezorger...";

        //DPD levert een box af bij 
        this.addObject("Contract",[0.065, 0.28],0.55);
        //End


        //Spawning Car parts
        this.addObjectRotation("Car_Wheel",[0.395 - 0.0125, 0.9],0.085,0.085);
	    this.addObjectRotation("Car_Wheel",[0.614 + 0.0125, 0.9],0.085,0.085);

        this.currentCar = this.img_object.length;
        this.addObject_HalfScale("DRS_Car_Metalchem",[0.503, 0.79],0.7);
        this.img_shouldRender[this.currentCar] = 1;
        this.addObject_HalfScale("DPD_Car_Metalchem",[0.503, 0.79],0.7);
        //End

        //DPD levert een box af bij 
        this.addObject("Contract",[0.065, 0.28],0.55);
        //End

        //Popups
        this.failedCounter_GPE = 0;

        this.addObject_HalfScale("todo_popup", [0.45, 0.05], 0.2);
        this.addObject_HalfScale("todo_popup", [0.5, 0.05], 0.2);
        this.addObject_HalfScale("todo_popup", [0.55, 0.05], 0.2);
        //End

        this.failOrSuccID_1 = this.img_object.length;
        this.addObject_HalfScale("cross_popup", [0.45, 0.05], 0.2);
        this.img_shouldRender[this.failOrSuccID_1] = 1;

        this.failOrSuccID_2 = this.img_object.length;
        this.addObject_HalfScale("cross_popup", [0.5, 0.05], 0.2);
        this.img_shouldRender[this.failOrSuccID_2] = 1;

        this.failOrSuccID_3 = this.img_object.length;
        this.addObject_HalfScale("cross_popup", [0.55, 0.05], 0.2);
        this.img_shouldRender[this.failOrSuccID_3] = 1;



        this.failOrSuccID_4 = this.img_object.length;
        this.addObject_HalfScale("check_popup", [0.45, 0.15], 0.2);
        this.img_shouldRender[this.failOrSuccID_4] = 1;

        this.failOrSuccID_5 = this.img_object.length;
        this.addObject_HalfScale("check_popup", [0.5, 0.15], 0.2);
        this.img_shouldRender[this.failOrSuccID_5] = 1;

        this.failOrSuccID_6 = this.img_object.length;
        this.addObject_HalfScale("check_popup", [0.55, 0.15], 0.2);
        this.img_shouldRender[this.failOrSuccID_6] = 1;


        this.addObject_HalfScale("todo_popup", [0.45, 0.15], 0.2);
        this.addObject_HalfScale("todo_popup", [0.5, 0.15], 0.2);
        this.addObject_HalfScale("todo_popup", [0.55, 0.15], 0.2);
    }

    buildingNumberInWorld()
    {
        if(this.spawnedBoxTimer_GPE == 0)
        {
            if(Math.floor(Math.random() * 1) < this.spawnChangeHousenumber && Math.floor(Math.random() * 1) < 25)
            {
                this.buildingNumberInWorld_GPE = this.buildingNumberToDeliver_GPE;  
           
                //Only spawn a Pickup Climate Box when the Dentist Building is rendered as a background and dont spawn it when it is the Street as a Background
                if(this.questType == 0 && (this.img_background_loop == this.Dentist_Bckgrnd || this.img_background_loop == this.Dentist_sundown))
                {
                    this.addObject_HalfScale("Climate_Box_2", [0, 0.8], 0.35);
                    this.droppedBoxPosition[this.img_object.length - 1] = [0, this.gameplayTimer_GPE, this.img_object.length - 1,0];
                }
    
                this.spawnedBoxTimer_GPE = 20;
            }
            else
            {
                this.buildingNumberInWorld_GPE = Math.floor(Math.random() * 65);
            }
        }
    }

    renderFromTimer(currentTime) 
    {
        if(this.currentSecond != new Date().getMilliseconds())
        {
            this.gameplayTimer_GPE += 1;
            this.currentSecond = new Date().getMilliseconds();
            
            if(this.spawnedBoxTimer_GPE > 0)
            {
                --this.spawnedBoxTimer_GPE;
            }

            if(this.pickupBoxTimer_GPE > 0)
            {
                --this.pickupBoxTimer_GPE;
            }

            if(this.spawnedBoxDelay_GPE > 0)
            {
                --this.spawnedBoxDelay_GPE;
            }

            if(this.spawnedHouseNumberTimer_GPE > 0)
            {
                --this.spawnedHouseNumberTimer_GPE;
            }

            if(this.switchTimer_GPE > 0)
            {
                --this.switchTimer_GPE;
            }

            if(this.questFailTimer_GPE > 0)
            {
                --this.questFailTimer_GPE;
            }
        }

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
            //Button Locations
            anchorDOM(this.button_CarSwitch_GPE, 0.5, 0.61);
            anchorDOM(this.button_DropOrCollectBox_GPE, 0.5, 0.65);
            
            anchorDOM(this.button_Contact, 0.4, 0.46);
            //End

            if(currentTime == this.maxTimeWhenRenderThis - 1)
            {
                this.button_CarSwitch_GPE.remove();
                this.button_DropOrCollectBox_GPE.remove();
                this.button_Contact.remove();
            }

            if(currentTime > 220 && this.blockTimerUntil == 0)
            {
                textSize(11);
                noFill();
                stroke(0);
                strokeWeight(1);
                text(this.questMessage, Main.widthSize * 0.007, Main.heightSize * 0.125);
                text('op huisnummer : ' + (this.buildingNumberToDeliver_GPE + 1), Main.widthSize * 0.007, Main.heightSize * 0.15);

                text('' + this.extraMessage, Main.widthSize * 0.007, Main.heightSize * 0.22);

                

                //var time = Math.round(this.gameplayTimer_GPE / 6);
                //text('Seconde deze', Main.widthSize * 0.0055, Main.heightSize * 0.3);
                //text('game ronde: ' + (time), Main.widthSize * 0.0055, Main.heightSize * 0.3);

//text('Debug: ' + (this.mainClass.playTimer), Main.widthSize * 0.0055, Main.heightSize * 0.425);

                var boxExist = 0;
                //Render house numbers
                for (var i = 0; i < this.droppedBoxPosition.length; ++i)
                {
                    if (this.droppedBoxPosition[i] !== undefined)
                    {
                        var objectIndex = this.droppedBoxPosition[i][2];

                        if (this.img_position[objectIndex] !== undefined)
                        {
                            var dropTime = this.droppedBoxPosition[i][1];

                            this.droppedBoxPosition[i][0] = this.droppedBoxPosition[i][3] + ((this.gameplayTimer_GPE - dropTime) / 100.0);
                            this.img_position[objectIndex][0] = this.droppedBoxPosition[i][0];

                            //Check if it was marked as a House Number to render OR the Climate boxes
                            if((this.img_background == this.Dentist_Bckgrnd || this.img_background == this.Dentist_sundown) && this.droppedBoxPosition[i][3] < 0)
                            {
                                this.houseNumbRendered = true;
                                textSize(22);
                                noFill();
                                stroke(255);
                                strokeWeight(1);
                                //House number of building. Has a paralex effect when you drive by it, catching the attention of the Player.
                                text('' + (this.buildingNumberInWorld_GPE + 1), Main.widthSize * ((this.img_position[objectIndex][0] + 0.178) * 1.05), Main.heightSize * 0.6);
                            }
                            else
                            {
                                this.houseNumbRendered = false;
                            }
                            //End
                            boxExist = 1;
                        }
                    }
                }

                //Succesful delivery
                if(boxExist == 0 && this.pickupBoxTimer_GPE > 0)
                {
                    this.addSuccesfulDelivery();
                    this.regenerateQuest();
                }

                if(this.questFailTimer_GPE == 0 && this.spawnedBoxDelay_GPE > 5 && this.spawnedBoxDelay_GPE > 20)
                {
                    this.regenerateQuest();
                    this.addSuccesfulDelivery();
                }
                //End

//text('Klik op de vraag die u heeft:', Main.widthSize * 0.4, Main.heightSize * 0.4);
                this.button_CarSwitch_GPE.show();
                this.button_DropOrCollectBox_GPE.show();
//this.button_Contact.show();
            }

            if(currentTime > 315 && this.blockTimerUntil == 0)
            {
                return 2;
            }
            else return this.blockTimerUntil;
        }
    }

    onButtonCarSwitchClick()
    {
        if(this.switchTimer_GPE == 0)
        {
            this.switchTimer_GPE = 20;

            if(this.isCarDPD)
            {
                if(this.img_background == this.Country_Side_sundown)
                {
                    this.img_background = this.Street_Bckgrnd;
                }

                if(this.img_background_loop == this.Country_Side_sundown )
                {
                    this.img_background_loop = this.Street_Bckgrnd;
                }

                if(this.img_background == this.Dentist_sundown)
                {
                    this.img_background = this.Dentist_Bckgrnd;
                }

                if(this.img_background_loop == this.Dentist_sundown)
                {
                    this.img_background_loop = this.Dentist_Bckgrnd;
                }
                //End

                this.button_DropOrCollectBox_GPE.html("Bezorg Millieu-box");
                this.button_CarSwitch_GPE.html("Wissel naar DRS auto");

                this.extraMessage = "Milieubox bezorger...";

                this.img_shouldRender[this.currentCar] = 1;
                this.img_shouldRender[this.currentCar + 1] = 0;
                this.isCarDPD = false;
            }
            else
            {
                if(this.img_background == this.Street_Bckgrnd)
                {
                    this.img_background = this.Country_Side_sundown;
                }

                if(this.img_background_loop == this.Street_Bckgrnd)
                {
                    this.img_background_loop = this.Country_Side_sundown;
                }

                if(this.img_background == this.Dentist_Bckgrnd)
                {
                    this.img_background = this.Dentist_sundown;
                }

                if(this.img_background_loop == this.Dentist_Bckgrnd)
                {
                    this.img_background_loop = this.Dentist_sundown;
                }
                //End

                this.button_DropOrCollectBox_GPE.html("Haal Millieu-box op");
                this.button_CarSwitch_GPE.html("Wissel naar pakketbezorger");

                this.extraMessage = "Ophalen zo'n 3 weken later...";

                this.img_shouldRender[this.currentCar] = 0;
                this.img_shouldRender[this.currentCar + 1] = 1;
                this.isCarDPD = true;
            }
        }
    }
 
    onButtonDropBox()
    {
        if(this.isCarDPD) 
        {
            if(this.houseNumbRendered)
            {
                //Pickup a box
                this.pickupBoxTimer_GPE = 10;
            }
            else
            {
                this.addFailedDelivery();
            }
        }
        else if(this.spawnedBoxDelay_GPE == 0 && this.switchTimer_GPE < 11)
        {
            //Add position data to list to update x position(because we drive forward, the box stays on the ground)
            this.addObject_HalfScale("Climate_Box", [0.5, 0.775], 0.5);
            this.droppedBoxPosition[this.img_object.length - 1] = [0.5, this.gameplayTimer_GPE, this.img_object.length - 1, 0.5];
            this.spawnedBoxDelay_GPE = 30;
        }
    }

    addFailedDelivery()
    {
        if(this.questFailTimer_GPE == 0)
        {
            if(this.failedCounter_GPE == 0 && this.img_shouldRender[this.failOrSuccID_1] > 0)
            {
                this.img_shouldRender[this.failOrSuccID_1] = 0;
                ++this.failedCounter_GPE;
            }
            else if(this.failedCounter_GPE == 1 && this.img_shouldRender[this.failOrSuccID_2] > 0)
            {
                this.img_shouldRender[this.failOrSuccID_2] = 0;
                ++this.failedCounter_GPE;
            }
            else if(this.failedCounter_GPE == 2 && this.img_shouldRender[this.failOrSuccID_3] > 0)
            {
                this.img_shouldRender[this.failOrSuccID_3] = 0;
                ++this.failedCounter_GPE;
            }
            else if(this.mainClass.playTimer < 2990)
            {
                this.mainClass.playTimer = 2997;
            }

            this.questFailTimer_GPE = 15;
        }
    }

    addSuccesfulDelivery()
    {
        //Cannot deliver a Climate Box when your task is to collect it, results in quest failed
        if(this.questType == 0 && this.spawnedBoxDelay_GPE > 0 && this.questFailTimer_GPE == 0)
        {
            addFailedDelivery();
            this.questFailTimer_GPE = 15;
        }
        else if(this.questFailTimer_GPE == 0)
        {
            if(this.img_shouldRender[this.failOrSuccID_4] == 1)
            {
                this.img_shouldRender[this.failOrSuccID_4] = 0;
            }
            else if(this.img_shouldRender[this.failOrSuccID_5] == 1)
            {
                this.img_shouldRender[this.failOrSuccID_5] = 0;
            }
            else if(this.img_shouldRender[this.failOrSuccID_6] == 1)
            {
                this.img_shouldRender[this.failOrSuccID_6] = 0;
            }
            else if(this.mainClass.playTimer < 2990)
            {
                this.mainClass.playTimer = 2997;
            }

            this.questFailTimer_GPE = 15;
        }
    }


//&& Math.floor(Math.random() * 100) < this.spawnChangeWasteBox 
    spawnHousenumber()
    {
        if(this.spawnedHouseNumberTimer_GPE == 0)
        {
            //Add position data to list to update x position(because we drive forward, the box stays on the ground)
            this.addObject_HalfScale("invis", [0.5, 0.75], 0.5);
            this.droppedBoxPosition[this.img_object.length - 1] = [0.5, this.gameplayTimer_GPE, this.img_object.length - 1, -0.01];
            this.spawnedHouseNumberTimer_GPE = 20;
        }
    }

    onButtonClickContact()
    {
        this.button_CarSwitch_GPE.remove();
        this.this.button_DropOrCollectBox_GPE.remove();
        this.button_Contact.remove();
        this.showContactInfo = 1;
    }

    regenerateQuest()
    {
        var numberGen = Math.floor(Math.random() * 65);
        if(numberGen == this.buildingNumberToDeliver_GPE)
        {
            ++numberGen;
        } 
        
        this.buildingNumberToDeliver_GPE = numberGen; 
        this.buildingNumberInWorld_GPE = Math.floor(Math.random() * 65);

        //Quest setting
        if(Math.floor(Math.random() * 10000) > 5000)
        {
            this.questType = 0;
            this.questMessage = 'Box ophalen';
        }
        else
        {
            this.questType = 1;
            this.questMessage = 'Box afgeven';
        }
    }

    renderBackground(currentTime)
    {
        for (var i = 0; i < this.droppedBoxPosition.length; ++i)
        {
            if (this.droppedBoxPosition[i] !== undefined)
            {
                var objectIndex = this.droppedBoxPosition[i][2];

                if (this.img_position[objectIndex] !== undefined)
                {
                    var dropTime = this.droppedBoxPosition[i][1];

                    this.droppedBoxPosition[i][0] = this.droppedBoxPosition[i][3] + 0.05 + ((this.gameplayTimer_GPE - dropTime) / 100.0);

                    this.img_position[objectIndex][0] = this.droppedBoxPosition[i][0];

                    //Re-generated house number
                    if(this.droppedBoxPosition[i][3] < 0 && this.droppedBoxPosition[i][0] > 0.985 && this.droppedBoxPosition[i][0] <= 1.01)
                    {
                        this.buildingNumberInWorld();
                    }
                    //End

                    if (this.droppedBoxPosition[i][0] > 1.3 || ((this.pickupBoxTimer_GPE > 0 || this.spawnedBoxDelay_GPE > 20) && this.droppedBoxPosition[i][0] > 0.35 && this.droppedBoxPosition[i][0] < 0.65))
                    {
                        //Regenerate Housenumber in Contract and the Clinic House number in the world
                        if((this.questType == 0 || this.questType == 1)  && this.pickupBoxTimer_GPE > 0)
                        {
                            if(this.buildingNumberInWorld_GPE == this.buildingNumberToDeliver_GPE &&
                            (this.img_background == this.Dentist_sundown || this.img_background ==  this.Dentist_Bckgrnd))
                            //Bug fix 18, line 489 only
                            {
                                this.regenerateQuest();
                                this.addSuccesfulDelivery();
                            }
                            else
                            {
                                this.addFailedDelivery();
                            }
                        }
                        //End


                        //Outside view/screen? Pickup climate box? Then, delete. NOT whhen delivering the box
                        if(this.spawnedBoxDelay_GPE == 0)
                        {
                            this.removeObject(objectIndex);
                            this.droppedBoxPosition.splice(i, 1);
                        }

                        if(this.spawnedBoxDelay_GPE == 0)
                        {
                            for (var j = 0; j < this.droppedBoxPosition.length; ++j)
                            {
                                if (this.droppedBoxPosition[j] !== undefined && this.droppedBoxPosition[j][2] > objectIndex)
                                {
                                    --this.droppedBoxPosition[j][2];
                                }
                            }

                            --i;
                        }
                    }
                    else if(this.pickupBoxTimer_GPE > 0 || this.spawnedBoxDelay_GPE > 20)
                    {
                        this.addFailedDelivery();
                    }
                }
            }
        }

        if ((this.fadeInStrenght > 0 && currentTime > this.timeWhenRenderThis) || this.fadeInStrenght == 0)
        {
            if (!this.isForeground)
            {
                let loopPosition = (Main.widthSize * this.gameplayTimer_GPE) / 100 % Main.widthSize;

                //Outside of view? Re-generate house number
                if (loopPosition < 100)
                {
                    this.spawnHousenumber();
                    if (Math.round(loopPosition) == 0)
                    {
                        ++this.coundBackgroundLoop;
                    }

                    if(this.coundBackgroundLoop > 3)
                    {
                        this.coundBackgroundLoop = 0;
                    }
                    
                    if (Math.round(loopPosition) == 0)
                    {
                        if(this.coundBackgroundLoop == 1)
                        {
                            if(this.img_background == this.Country_Side_sundown || this.img_background == this.Dentist_sundown)
                            {
                                this.img_background_loop = this.Dentist_sundown;
                            }
                            else
                            {
                                this.img_background_loop = this.Dentist_Bckgrnd;
                            }
                        }
                        else if(this.coundBackgroundLoop == 2)
                        {
                            if(this.img_background == this.Country_Side_sundown || this.img_background == this.Dentist_sundown)
                            {
                                this.img_background = this.Dentist_sundown;
                                this.img_background_loop = this.Country_Side_sundown;
                            }
                            else
                            {
                                this.img_background = this.Dentist_Bckgrnd;
                                this.img_background_loop = this.Street_Bckgrnd;
                            }
                        }
                        else if(this.coundBackgroundLoop == 3)
                        {
                            if(this.img_background == this.Country_Side_sundown || this.img_background == this.Dentist_sundown)
                            {
                                this.img_background = this.Country_Side_sundown;
                                this.img_background_loop = this.Country_Side_sundown;
                            }
                            else
                            {
                                this.img_background = this.Street_Bckgrnd;
                                this.img_background_loop = this.Street_Bckgrnd;
                            }
                        }
                    }
                }
                
                //Bugfix 2: Main.widthSize * 1.001   that 0.001 was the fix
                push();
                translate(loopPosition, 0);
                image(this.img_background, Main.widthSize / 2, Main.heightSize / 2, Main.widthSize * 1.001, Main.heightSize);
                pop();

                push();
                translate(loopPosition, 0);
                image(this.img_background_loop, -Main.widthSize / 2, Main.heightSize / 2, Main.widthSize * 1.001, Main.heightSize);
                pop();
            }
        }
    }
}