/** Because it is an animation, we have a timer that keeps counting up**/
var playTimer;
var scenes = [];
var blockTimer;

//Sounds
let song;
let intro_Phone;
let start_reminder;

//Buttons
let button;

/** Shared global values **/
const Main = 
{
	//Window Size
	widthSize: 0,
	heightSize: 0,
	pickup_DPD: null,
};

function setup() 
{
	Main.widthSize = 1024;
	Main.heightSize = 682;
	createCanvas(Main.widthSize, Main.heightSize);
	frameRate(20);
	//End

	//Song: the_mountain-dental-clinic-151199
	song = loadSound('dental_clinic.mp3');
	intro_Phone = loadSound('MetDRS.mp3');
	start_reminder = loadSound('Opnemen_Telefoon.mp3');
//Main.pickup_DPD = loadSound('Ophalen.mp3');
	//End

	//Setting up Scenes
	//Scene 1: Introduction
	scenes.push(new Scene_Intro(0, 200,"black"));

	button = createButton("Klik hier om de uitleg te starten");
    button.mousePressed(onButtonClick);
	button.size(400, 80);
	//Emd

	//Set base values
	playTimer = 100;

	//Scene 2: Office, select Question
	scenes.push(new Scene_Office(200, 500,"DRS_background"));

	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[235,245]);
	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[235,245]);
	scenes[(scenes.length - 1)].addObject_Timer("text_popup",[0.71, 0.585],0.25,[235,245]);
	
	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[260,270]);
	scenes[(scenes.length - 1)].addObject_Timer("text_popup",[0.78, 0.4],0.25,[260,270]);
	
	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[285,295]);
	scenes[(scenes.length - 1)].addObject_Timer("text_popup",[0.87, 0.66],0.25,[285,295]);
	
	scenes[(scenes.length - 1)].addObject_Timer("Picking_Up_Phone",[0.8, 0.63],0.35,[315,550]);
	scenes[(scenes.length - 1)].fadeInStrenght = 6;
	scenes[(scenes.length - 1)].addObject("phone",[0.8, 0.63],0.35);
	

	//Scene 3: Loading Clean, empty Climate Boxes at DRS Company
	//scenes.push(new Scene(500, 1100,"black"));
	//scenes[(scenes.length - 1)].addObject_Timer("delivery_animation.",[0.5,0.5],1,[500, 1100]);

	scenes.push(new Scene_Delivery_Game(500,3000,"Country_Side",this));
	//scenes.push(new Scene_Cleanup_Game(500,8000,"Dentist_Office"));




	//Scene 4: the end Prototype
//scenes.push(new Scene_Intro(950, 1100,"black"));
//scenes[(scenes.length - 1)].addText('Einde van de video',[0.4,0.55]);
	blockTimer = false;

	// Force correct resize after browser finished layout
    setTimeout(() => 
    {
        windowResized();
    }, 100);
	window.addEventListener("load", () =>
	{
		setTimeout(() =>
		{
			windowResized();
		}, 100);
	});
}

//Window Logic
function windowResized() 
{
    updateWindowSize();
    resizeCanvas(Main.widthSize, Main.heightSize);
	redraw();
}

function updateWindowSize()
{
    Main.widthSize = windowWidth;
    Main.heightSize = windowHeight;
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
  	}
	button.hide();

//This fixes the bug of the button " self-firing"  without a human clicking it
	if(playTimer != 0)
	{
		playTimer = 170;
	}
	
	console.log("klik werkt");
}

function onUpdate(spawnEachFrame)
{
	//Intro Scene Office
	if(playTimer > 100 && playTimer < 495)
	{
		++playTimer;
	}
	//Delivery game
	else if(!this.blockTimer && playTimer > 400 && playTimer < 2000)
	{
		++playTimer;
	}
	//Cleanup game
	else if(!this.blockTimer && playTimer > 2100 && playTimer < 6000)
	{
		++playTimer;
	}

	if (playTimer == 300 && intro_Phone.isLoaded() && !intro_Phone.isPlaying()) 
	{
    	intro_Phone.play();
		intro_Phone.setVolume(2.0);
  	}

	if (playTimer == 400 && start_reminder.isLoaded() && !start_reminder.isPlaying()) 
	{
    	start_reminder.play();
		start_reminder.setVolume(1.0);
  	}
}

function draw() 
{
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

		anchorDOM(button, 0.45,0.55);
	}
}