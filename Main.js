/** Because it is an animation, we have a timer that keeps counting up**/
var playTimer;
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
	buttonList: [],
	scenes: [],
};

function setup() 
{
	Main.widthSize = windowWidth;
    Main.heightSize = windowHeight;
	createCanvas(Main.widthSize, Main.heightSize);
	frameRate(20);
	//End

	//Song: the_mountain-dental-clinic-151199
	song = loadSound('dental_clinic.mp3');
	intro_Phone = loadSound('MetDRS.mp3');
	start_reminder = loadSound('Opnemen_Telefoon.mp3');
	//End

	//Setting up Main.scenes
	//Scene 1: Introduction
	Main.scenes.push(new Scene_Intro(0, 200,"black"));

	button = createButton("Klik hier om de uitleg te starten");
    button.mousePressed(onButtonClick);
	button.size(400, 80);
	//Emd

	//Set base values
	playTimer = 100;

	//Scene 2: Office, select Question
	Main.scenes.push(new Scene_Office(200, 500,"DRS_background"));

	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[235,245]);
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[235,245]);
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("text_popup",[0.71, 0.585],0.25,[235,245]);
	
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[260,270]);
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("text_popup",[0.78, 0.4],0.25,[260,270]);
	
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[285,295]);
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("text_popup",[0.87, 0.66],0.25,[285,295]);
	
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("Picking_Up_Phone",[0.8, 0.63],0.35,[315,550]);
	Main.scenes[(Main.scenes.length - 1)].fadeInStrenght = 6;
	Main.scenes[(Main.scenes.length - 1)].addObject("phone",[0.8, 0.63],0.35);
	


	Main.scenes.push(new Scene(450, 750,"clear"));
	Main.scenes[(Main.scenes.length - 1)].zeroToLastLoop = true;
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("Game_Intro.",[0.5,0.5],1,[450, 750]);


	Main.scenes.push(new Scene_Delivery_Game(750,3000,"Country_Side",this));

	
	Main.scenes.push(new Scene(3000, 3100,"clear"));
	Main.scenes[(Main.scenes.length - 1)].zeroToLastLoop = true;
	Main.scenes[(Main.scenes.length - 1)].addObject_Timer("arriveatdentist_animation.",[0.5,0.5],1,[3000, 3100]);
	


	//Scene 4: the end Prototype
//Main.scenes.push(new Scene_Intro(950, 1100,"black"));
//Main.scenes[(Main.scenes.length - 1)].addText('Einde van de video',[0.4,0.55]);
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

document.addEventListener("wheel", function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

//Window Logic
function windowResized() 
{
    updateWindowSize();
    resizeCanvas(Main.widthSize, Main.heightSize);
	redraw();

	Main.widthSize = windowWidth;
    Main.heightSize = windowHeight;

    resizeCanvas(Main.widthSize, Main.heightSize);

    // Update alle button-posities
    for (const button of Main.buttonList)
    {
        button.position(
            Main.widthSize * button.positionX,
            Main.heightSize * button.positionY
        );
    }
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
	button.hide();

//This fixes the bug of the button " self-firing"  without a human clicking it
	if(playTimer != 0)
	{
		playTimer = 170;
	}
	
	console.log("klik werkt");
}

//Control the timer of showing which Main.scenes/Mini-Games
function onUpdate(spawnEachFrame)
{
	if (playTimer > 170 && playTimer < 450 && song.isLoaded() && !song.isPlaying()) 
	{
    	song.play();
		song.setVolume(0.1);
  	}

	//Intro Scene Office
	if(playTimer > 100 && playTimer < 448)
	{
		++playTimer;
	}
	//Delivery game
	else if(!this.blockTimer && playTimer > 445 && playTimer < 2070)
	{
		++playTimer;
	}
	else if(playTimer > 2080 && playTimer < 3020)
	{
		++playTimer;
	}
	//Cleanup game
	else if(!this.blockTimer && playTimer > 3000 && playTimer < 6000)
	{
		++playTimer;
	}

	if (playTimer == 300 && intro_Phone.isLoaded() && !intro_Phone.isPlaying()) 
	{
    	intro_Phone.play();
		intro_Phone.setVolume(3.5);
  	}

	if (playTimer == 400 && start_reminder.isLoaded() && !start_reminder.isPlaying() && Main.blockTimer && this.blockTimerUntil == 0) 
	{
    	start_reminder.play();
		start_reminder.setVolume(0.8);
  	}

	if(playTimer > 445 && start_reminder.isPlaying())
	{
		start_reminder.stop();
	}

}

(function () {
    var key = "hard_reset_done";

    if (sessionStorage.getItem(key) !== "1") {
        sessionStorage.setItem(key, "1");
        window.location.reload();
    } else {
        sessionStorage.removeItem(key);
    }
})();

function draw() 
{
	//End
	background(0);
	onUpdate(10);

	for (var i = 0; i < Main.scenes.length; ++i) 
	{
		if(playTimer > Main.scenes[i].timeWhenRenderThis || Main.scenes[i].fadeInStrenght == 0)
		{
			var returnValue = Main.scenes[i].renderScreen(playTimer);
			if(returnValue == 2)
			{
				this.blockTimer = true;
			}
			else if(returnValue == 1)
			{
				this.blockTimer = false;
			}

			if(Main.scenes[i].fadeInStrenght != 0)
			{
				//Fade-in from black screen to the view of the office. Used tint in older versions, which lowers performance(fps) because tint isn't an overlay but a alpha calculation for each frame
				let fadeAlpha = constrain(((playTimer - Main.scenes[i].timeWhenRenderThis))  * Main.scenes[i].fadeInStrenght,0,255)
				noStroke();
				fill(0, 0, 0, 255 - fadeAlpha);
				rect(0, 0, Main.widthSize, Main.heightSize);
			}
		}

		anchorDOM(button, 0.45,0.55);
	}
}