/** Values for sending me testing Data **/
var watcherID;
var timerBeforeClicked;
var registeredMouseClicks;
var registeredScrolling;
/** Because it is an animation, we have a timer that keeps counting up**/
var playTimer;
var scenes = [];
var blockTimer;

let song;
let intro_Phone;



/** Shared global values **/
const Main = 
{
	//Window Size
	widthSize: 0,
	heightSize: 0,
	pickup_DPD: null
};

function setup() 
{
	Main.widthSize = windowWidth;
	Main.heightSize = windowHeight;
	createCanvas(Main.widthSize, Main.heightSize);
	frameRate(20);
	//Set base values
	watcherID = Math.floor(Math.random() * 9999);
	playTimer = 0;
	timerBeforeClicked = 0;
	registeredMouseClicks = 0;
	registeredScrolling = 0;
	//Register if the user is scrolling
	window.addEventListener("scroll", () =>
	{
		++registeredScrolling;
	});
	//End
	//Song: the_mountain-dental-clinic-151199
	song = loadSound('audio/dental_clinic.mp3');
	intro_Phone = loadSound('audio/Opnemen_Telefoon.mp3');
	Main.pickup_DPD = loadSound('audio/Ophalen.mp3');
	//End

	//Setting up Scenes
	scenes.push(new Scene_Intro(0, 200,"backgrounds/black"));
	scenes[(scenes.length - 1)].addText('Er wordt bijgehouden hoe lang u naar dit filmpje kijkt en waar u op klikt.',[0.3,0.25]);
	scenes[(scenes.length - 1)].addText('Dit wordt gebruikt om dit filmpje te verbeteren...',[0.35,0.3]);
	//scenes[(scenes.length - 1)].addText('Klik op het scherm om te starten en te accepteren',[0.4,0.55]);
	scenes[(scenes.length - 1)].addText('Dit filmpje is bedoeld om mogelijk uw vraag te beantwoorden.',[0.33,0.15]);

	this.button = createButton("Klik hier om de voorwaarden te accepteren en het filmpje te starten");
    this.button.mousePressed(onButtonClick);
	//
	scenes.push(new Scene_Office(200, 350,"backgrounds/DRS_background"));
	scenes[(scenes.length - 1)].addObject("items/phone",[0.8, 0.63],0.35);
	scenes[(scenes.length - 1)].addObject("items/phone",[0.95, 0.81],0.365);

	scenes[(scenes.length - 1)].addObject_Timer("items/Ringing_Screen",[0.8, 0.63],0.35,[235,245]);
	scenes[(scenes.length - 1)].addObject_Timer("items/text_popup",[0.71, 0.585],0.25,[235,245]);
	
	scenes[(scenes.length - 1)].addObject_Timer("items/Ringing_Screen",[0.8, 0.63],0.35,[260,270]);
	scenes[(scenes.length - 1)].addObject_Timer("items/text_popup",[0.78, 0.5],0.25,[260,270]);
	
	scenes[(scenes.length - 1)].addObject_Timer("items/Ringing_Screen",[0.8, 0.63],0.35,[285,295]);
	scenes[(scenes.length - 1)].addObject_Timer("items/text_popup",[0.87, 0.56],0.25,[285,295]);
	
	scenes[(scenes.length - 1)].addObject_Timer("items/Picking_Up_Phone",[0.8, 0.63],0.35,[315,350]);
	scenes[(scenes.length - 1)].fadeInStrenght = 6;

	
	//
	scenes.push(new Scene(350, 450,"backgrounds/black"));
	scenes[(scenes.length - 1)].addText('Een aantal dagen eerder....',[0.35,0.5]);
	scenes[(scenes.length - 1)].fadeInStrenght = 8;
	

	scenes.push(new Scene(450, 650,"backgrounds/Loading_Boxes"));
	scenes[(scenes.length - 1)].addObject_Timer("items/loading_boxes_dpd.",[0.5,0.505],1,[450, 550]);


	scenes.push(new Scene(550, 750,"backgrounds/dentistBuilding_background"));
	scenes[(scenes.length - 1)].addObject_Timer("items/dpd_dentist_deliver.",[0.5,0.5],1,[550,630]);
	scenes[(scenes.length - 1)].addObject_Timer("items/dentist_peaking.",[0.5,0.5],1,[630,750]);
	

	scenes.push(new Scene(750, 900,"backgrounds/DRS_Office_Table"));
	scenes[(scenes.length - 1)].addObject_Timer("items/Contract_End_Scene.",[0.5, 0.5],1.0,[750, 900]);

	scenes.push(new Scene_Intro(900, 1000,"backgrounds/black"));
	scenes[(scenes.length - 1)].addText('Einde van de video',[0.4,0.55]);
	scenes[(scenes.length - 1)].addText('is Uw vraag beantwoord?',[0.4,0.6]);
	this.buttonEnd = createButton("Ja");
    this.buttonEnd.mousePressed(yesButtonClick);
	this.buttonEnd.hide();
	this.blockTimer = false;
}

//Window Logic
function windowResized() 
{
	resizeCanvas(widthSize, heightSize);
}
//End

//Button Logic
function anchorDOM(el, x, y) 
{
    el.position(Main.widthSize * x, Main.heightSize * y);
}

function onButtonClick()
{
	if (song.isLoaded() && !song.isPlaying()) 
	{
    	song.play();
		song.setVolume(0.1);
		//Send the first email
		sendMail('Someone started watching the video with ID: ' + watcherID + ' ; Timer before User Clicked video: ' + timerBeforeClicked + ' ; Scrolling: ' + registeredScrolling);
		timerBeforeClicked = 0;
		registeredScrolling = 0;
  	}
	button.hide();
	console.log("klik werkt");
}

function yesButtonClick()
{
	sendMail('User with ID: ' + watcherID + ' clicked Yes for question being answered.');
	console.log("klik werkt");
}
//End

function onUpdate(spawnEachFrame)
{
	if(!this.blockTimer && playTimer < 2000)
	{
		++playTimer;
		if(playTimer < 100)
		{
			playTimer = 150;
		}
	}

	if(playTimer == 890)
	{
		sendMail('Watched whole video with ID: ' + watcherID + ' ; Left Mouse Clicks Amount: ' + registeredMouseClicks);
		this.buttonEnd.show();
	}
}

//Browser ban the auto-plaing of sound and music if the user didn't do an action
function mousePressed() 
{
	if (playTimer > 300 && intro_Phone.isLoaded() && !intro_Phone.isPlaying()) 
	{
    	intro_Phone.play();
		intro_Phone.setVolume(3.0);
  	}
	++registeredMouseClicks;
}

function draw() 
{
	//Register user being on the page without doing anything recarding the video
	if(playTimer < 200 && timerBeforeClicked < 5000)
	{
		++timerBeforeClicked;
	}
	//End

	background(0);
	onUpdate(10);

	for (var i = 0; i < scenes.length; ++i) 
	{
		if(playTimer > scenes[i].timeWhenRenderThis || scenes[i].fadeInStrenght == 0)
        {
			var returnValue = scenes[i].renderScreen(playTimer);
			if(returnValue == 2)
			{
				this.blockTimer = true;
			}
			else if(returnValue == 1)
			{
				this.blockTimer = false;
			}

			if(scenes[i].fadeInStrenght != 0)
       	 	{
				//Fade-in from black screen to the view of the office. Used tint in older versions, which lowers performance(fps) because tint isn't an overlay but a alpha calculation for each frame
				let fadeAlpha = constrain(((playTimer - scenes[i].timeWhenRenderThis))  * scenes[i].fadeInStrenght,0,255)
				noStroke();
				fill(0, 0, 0, 255 - fadeAlpha);
				rect(0, 0, Main.widthSize, Main.heightSize);
			}
        }

		anchorDOM(this.button, 0.45,0.55);
	}

	//textSize(100);
	//noFill();
	//stroke(255);
	//strokeWeight(2);
	
	
	//push();
	//resetMatrix();
	//fill(255);
	//textSize(20);
	//text('Timer: ' + playTimer, width / 35, height / 15);
	//text('' + width + ' : ' + height, width / 35, height / 30);
	//pop();
}