/** Values for sending me testing Data **/
var timerBeforeClicked;
var registeredMouseClicks;
var registeredScrolling;
/** Because it is an animation, we have a timer that keeps counting up**/
var playTimer;
var scenes = [];
var blockTimer;

let song;
let intro_Phone;

let voorwaarden = [];
let scrollY = 0;
var showVoorwaarden;

let button;
let button_voorwaarden;
let buttonEnd;

/** Shared global values **/
const Main = 
{
	//Window Size
	widthSize: 0,
	heightSize: 0,
	pickup_DPD: null,
	watcherID: 0
};

function setup() 
{
	Main.widthSize = 1024;
	Main.heightSize = 682;
	createCanvas(Main.widthSize, Main.heightSize);
	frameRate(20);

	voorwaarden = loadStrings('Voorwaarden.txt');
	//Set base values
	Main.watcherID = Math.floor(Math.random() * 9999);
	playTimer = 0;
	timerBeforeClicked = 0;
	registeredMouseClicks = 0;
	registeredScrolling = 0;

	showVoorwaarden = 0;
	//Register if the user is scrolling
	window.addEventListener("scroll", () =>
	{
		++registeredScrolling;
	});
	//End
	//Song: the_mountain-dental-clinic-151199
	song = loadSound('dental_clinic.mp3');
	intro_Phone = loadSound('Opnemen_Telefoon.mp3');
	Main.pickup_DPD = loadSound('Ophalen.mp3');
	//End

	//Setting up Scenes
	//Scene 1: Prototype Introduction
	scenes.push(new Scene_Intro(0, 200,"black"));
	//scenes[(scenes.length - 1)].addText('Er wordt bijgehouden hoe lang u naar dit filmpje kijkt en waar u op klikt op het scherm.',[0.3,0.25]);
	//scenes[(scenes.length - 1)].addText('Dit wordt gebruikt om dit filmpje te verbeteren en uw vragen beter te beantwoorden...',[0.35,0.3]);
    
	scenes[(scenes.length - 1)].addText('This animation is meant to answer your questions about the delivery and pickup of the climate box.',[0.17,0.15]);

	button = createButton("Click here to accept the Terms of Service and start the animation.");
    button.mousePressed(onButtonClick);

	button_voorwaarden = createButton("Click here to read the Terms and Conditions.");
    button_voorwaarden.mousePressed(onButtonClickVoorwaarden);

	//Scene 2: Office, select Question
	scenes.push(new Scene_Office(200, 350,"DRS_background"));
	scenes[(scenes.length - 1)].addObject("phone",[0.8, 0.63],0.35);
	scenes[(scenes.length - 1)].addObject("phone",[0.95, 0.81],0.365);

	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[235,245]);
	scenes[(scenes.length - 1)].addObject_Timer("text_popup",[0.71, 0.585],0.25,[235,245]);
	
	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[260,270]);
	scenes[(scenes.length - 1)].addObject_Timer("text_popup",[0.78, 0.5],0.25,[260,270]);
	
	scenes[(scenes.length - 1)].addObject_Timer("Ringing_Screen",[0.8, 0.63],0.35,[285,295]);
	scenes[(scenes.length - 1)].addObject_Timer("text_popup",[0.87, 0.56],0.25,[285,295]);
	
	scenes[(scenes.length - 1)].addObject_Timer("Picking_Up_Phone",[0.8, 0.63],0.35,[315,350]);
	scenes[(scenes.length - 1)].fadeInStrenght = 6;

	
	//Scene 3: Loading Clean, empty Climate Boxes at DRS Company
	scenes.push(new Scene(350, 450,"black"));
	scenes[(scenes.length - 1)].addText('A few day earlier....',[0.375,0.5]);
	scenes[(scenes.length - 1)].fadeInStrenght = 8;
	scenes.push(new Scene(450, 650,"Loading_Boxes"));
	scenes[(scenes.length - 1)].addObject_Timer("loading_boxes_dpd.",[0.5,0.505],1,[450, 550]);

	//Scene 4: Quick Delivery at the Dentist Clinic
	scenes.push(new Scene(550, 800,"dentistBuilding_background"));
	scenes[(scenes.length - 1)].addObject_Timer("dpd_dentist_deliver.",[0.5,0.5],1,[550,630]);
	scenes[(scenes.length - 1)].addObject_Timer("dentist_peaking.",[0.5,0.5],1,[620,790]);
	scenes[(scenes.length - 1)].setEndsWithBlackScreen();
	
	//Scene 5: the contract and conclusion
	scenes.push(new Scene(800, 950,"DRS_Office_Table"));
	scenes[(scenes.length - 1)].addObject_Timer("Contract_End_Scene.",[0.5, 0.5],1.0,[800, 950]);
	scenes[(scenes.length - 1)].fadeInStrenght = 6;

	//Scene 6: the end Testing Prototype
	scenes.push(new Scene_Intro(950, 1100,"black"));
	scenes[(scenes.length - 1)].addText('End of the video',[0.4,0.55]);
	scenes[(scenes.length - 1)].addText('id it answer your question?',[0.4,0.6]);
	buttonEnd = createButton("Ja");
    buttonEnd.mousePressed(yesButtonClick);
	buttonEnd.hide();
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
		//Send the first email
		sendMail('Someone started watching the video with ID: ' + Main.watcherID + ' ; Timer before User Clicked video: ' + timerBeforeClicked + ' ; Scrolling: ' + registeredScrolling);
		timerBeforeClicked = 0;
		registeredScrolling = 0;
  	}
	button_voorwaarden.hide();
	button.hide();
	console.log("klik werkt");
}

function onButtonClickVoorwaarden()
{
	if(showVoorwaarden == 0)
	{
		showVoorwaarden = 1;
		button_voorwaarden.hide();
		button.hide();
	}
	else
	{
		playTimer = 0;
		this.blockTimer = true;
		showVoorwaarden = 0;
		button_voorwaarden.show();
		button.show();
		button_voorwaarden.html("Click here to read the Terms and Conditions.");
	}
	console.log("klik werkt");
}

function yesButtonClick()
{
	sendMail('User with ID: ' + Main.watcherID + ' clicked Yes for question being answered.');
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

	if (playTimer == 300 && intro_Phone.isLoaded() && !intro_Phone.isPlaying()) 
	{
    	intro_Phone.play();
		intro_Phone.setVolume(1.0);
  	}

	if(playTimer == 950)
	{
		sendMail('Watched whole video with ID: ' + Main.watcherID + ' ; Left Mouse Clicks Amount: ' + registeredMouseClicks);
		buttonEnd.show();
	}
}

//Browser ban the auto-plaing of sound and music if the user didn't do an action
function mousePressed() 
{
	++registeredMouseClicks;
}

// Scrolling
function mouseWheel(event) 
{
    scrollY += event.delta;
    scrollY = Math.max(0, scrollY);
    return true;
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

	if(showVoorwaarden == 0)
	{
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
			anchorDOM(button_voorwaarden, 0.48,0.62);
			anchorDOM(buttonEnd, 0.45,0.65);
		}
	}
	else
	{
		fill(255);
		textSize(13);
		let x = 0.1;
		let startY = 0.0;
		let regelHoogte = 16;

		for (let i = 0; i < voorwaarden.length; i++) 
		{
			let maxScroll = Math.max(0, voorwaarden.length * regelHoogte - Main.heightSize);
			scrollY = constrain(scrollY, 0, maxScroll);

			let y = Main.heightSize *  startY + i * regelHoogte - scrollY;

			// Alleen renderen als zichtbaar
			if (y > -regelHoogte && y < Main.heightSize + regelHoogte) 
			{
				text(voorwaarden[i], Main.widthSize * x,y);

				if (button_voorwaarden.elt.style.display === "none")
				{
					button_voorwaarden.html("Click here to go back to the aniamtion");
					anchorDOM(button_voorwaarden, 0.48,0.875);
					button_voorwaarden.show();
				}
			}
			else if (button_voorwaarden.elt.style.display !== "none")
			{
				button_voorwaarden.hide();
			}
		}
	}	
}