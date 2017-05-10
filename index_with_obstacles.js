/*<!DOCTYPE html>
<html>

	<head></head>

	<body>

		<br/>
		SCORE:
		<input id="lblScore" type="text" />
		<br/>
		TIME:
		<input id="lblTime" type="text" />
		<br/>
		LIVES:
		<input id=lbllives type="text"/>
		<br/>
		<canvas id="canvas" height="700" width="1100"></canvas>

<script type="text/javascript">-->*/
var islogout=false;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var shape=new Object();
var monster=new Object();
var monster2=new Object();
var monster3=new Object();
var moving_points=new Object();
var board; var board2;
var score;
var pac_color;
//var start_time;
var time_elapsed;
var interval; var interval2; var interval3; var interval4; var interval5; var interval6;
var before; var before2; var before3; var before4;
var first; var second; var eye1; var eye2; 
var lives;
var b;
var numofmonsters; var gametime;
var lastmonster;var lastmonster2 ;var lastmonster3; var lastprize;
var gold=new Audio('gold.mp3');
var Mon1; var Mon2; var Mon3;


//Start(50, 3, 60);

function Start(food,monsters,duration) {
	gold.play();
	up=new Image();
	up.src="up.png";
	down=new Image();
	down.src="down.png";
	right=new Image();
	right.src="right.png";
	left=new Image();
	left.src="left.png";
	board = new Array();
	board2=new Array();
	score = 0;
	pac_color=1;
	/*
	first=0.15;
	second=1.85;
	eye1=5;
	eye2=15;
	*/
	before=0;
	before2=0;
	before3=0;
	before4=0;
	numofmonsters=monsters;
	time_elapsed=duration;
	b=false;
	//up=false; down=false; right=false; left=false;
	var cnt = 100;
	var food_remain = food;
	var pacman_remain = 1;
	Mon1=new Image();
	Mon1.src="red.png";
	Mon3=new Image();
	Mon3.src="orange.png";
	Mon2=new Image();
	Mon2.src="pink.png";

	//start_time= new Date();
	//currentTime=new Date();
	for (var i = 0; i < 17; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 11; j++) {
			if((i==0 || i==16 || j==0 || j==10) ||(i==2 && j==2) ||(i==2 && j==3) ||(i==3 && j==2)||(i==4 && j==4)||(i==5 && j==4)||(i==4 && j==6)||(i==5 && j==6)||(i==2 && j==7)||(i==2 && j==8)||(i==3 && j==8)||(i==6 && j==2)||(i==7 && j==2)||(i==8 && j==2)||(i==9 && j==2)||(i==10 && j==2)||(i==6 && j==8)||(i==7 && j==8)||(i==8 && j==8)||(i==9 && j==8)||(i==10 && j==8)||(i==8 && j==3)||(i==8 && j==5)||(i==8 && j==7)||(i==11 && j==4)||(i==12 && j==4)||(i==11 && j==6)||(i==12 && j==6)||(i==13 && j==2)||(i==14 && j==2)||(i==14 && j==3)||(i==13 && j==8)||(i==14 && j==8)||(i==14 && j==7)||(i==6 && j==3) ||(i==11 && j==7))
			{
				//wall

				if(i==6 && j==3){
					board[i][j]=1;
				}
				else if(i==11 && j==7){
					board[i][j]=3;
				}
				else {
					board[i][j] = 4;
				}
			}

			else{
				var randomNum = Math.random();
				if (randomNum <= 1.0 * food_remain / cnt) {
					//food
					food_remain--;
					var randomNum1 = Math.random();
					if(randomNum1<=0.1)
						board[i][j] = 7;
					else if(randomNum1<0.4)
						board[i][j] = 8;
					else
						board[i][j] = 9;
				} else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
					if((i==14&&j==1) || (i==15&&j==2)|| (i==14&&j==9)|| (i==15&&j==8)|| (i==1&&j==8)|| (i==2&&j==9)|| (i==15&&j==1)|| (i==15&&j==9)|| (i==1&&j==9)|| (i==1&&j==1)){
						//board[i][j]=0;
					}
					else{
					shape.i=i;
					shape.j=j;
					pacman_remain--;
					//pacman
					board[i][j] = 2;
					}
					
				} else {
					//empty
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	for (var i = 0; i < 17; i++) {
		board2[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 11; j++) {
			if((i==1 && j==1) ||(i==15 && j==1) || (i==15 && j==9) ||(i==1 && j==9)){
				if(i==1 && j==1){
					board2[i][j]=6;
				}
				else if(i==1 && j==9){
					if(numofmonsters==3)
						board2[i][j]=12;
					else
						board2[i][j]=0;
				}
				else if(i==15 && j==1 ){
					board2[i][j]=10;
				}
				else if(i==15 && j==9){
					if(numofmonsters==2 || numofmonsters==3)
						board2[i][j]=11;
					else
						board2[i][j]=0;
				}
			}
			else{
				board2[i][j]=0;
			}
		}
	}
	while(food_remain>0){
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 9;
		food_remain--;
	}
	keysDown = {};
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	addEventListener("keyup", function (e) {
		keysDown[e.keyCode] = false;
	}, false);
	interval=setInterval(UpdatePosition, 200);
	interval2=setInterval(MoveMonster1, 500);
	if(numofmonsters==='2' || numofmonsters==='3')
		interval3=setInterval(MoveMonster2, 500);
	if(numofmonsters==='3')
		interval4=setInterval(MoveMonster3, 500);
	interval5=setInterval(MoveMovingPoints,400);
	interval6=setInterval(clock,1000);
}


function findRandomEmptyCell(board){
	var i = Math.floor((Math.random() * 9) + 1);
	var j = Math.floor((Math.random() * 9) + 1);
	while(board[i][j]!=0)
	{
		i = Math.floor((Math.random() * 9) + 1);
		j = Math.floor((Math.random() * 9) + 1);
	}
	return [i,j];             
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) { 
		return 2;
	}
	if (keysDown[37]) { 
		return 3;
	}
	if (keysDown[39]) { 
		return 4;
	}
}

function Draw() {
	canvas.width=canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lbllives.value=lives;
	for (var i = 0; i < 17; i++) {
		for (var j = 0; j < 11; j++) {
			var center = new Object();
			center.x = i * 35+30;
			center.y = j * 35+30;
			if(board2[i][j]==0){
				if (board[i][j] == 2) {
					if (pac_color===4)
						context.drawImage(right, (i*35)+2, (j*35)+1,30,30);
					else if(pac_color===3)
						context.drawImage(left,(i*35)+2, (j*35)+1,30,30);
					else if(pac_color===1)
						context.drawImage(up, (i*35)+2, (j*35)+1,30,30);
					else if(pac_color===2)
						context.drawImage(down, (i*35)+2, (j*35)+1,30,30);
				} 
				else if (board[i][j] == 7) {
					context.beginPath();
					context.arc(center.x-15, center.y-15, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "purple"; //color 
					context.fill();
				}
				else if (board[i][j] == 8) {
					context.beginPath();
					context.arc(center.x-15, center.y-15, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "silver"; //color 
					context.fill();
				}
				else if (board[i][j] == 9) {
					context.beginPath();
					context.arc(center.x-15, center.y-15, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "green"; //color 
					context.fill();
				}
				else if (board[i][j] == 4) {
					context.beginPath();
					context.rect(center.x-30, center.y-30, 35, 35);
					context.fillStyle = "grey"; //color 
					context.fill();
				}
				else if (board[i][j] == 1) {
					heart=new Image();
					heart.src="heart.png";
					context.drawImage(heart,(i*35)+2, (j*35)+1,30,30);
				}
				else if (board[i][j] == 3) {
					time=new Image();
					time.src="time.png";
					context.drawImage(time,(i*35)+2, (j*35)+1,30,30);
				}

			}
			else{
				if (board2[i][j] == 10) {
					monster.i=i;
					monster.j=j;
					context.drawImage(Mon1,(monster.i*35)+2, (monster.j*35)+5,30,30);
				}
				else if (board2[i][j] == 11) {

					monster2.i=i;
					monster2.j=j;
					context.drawImage(Mon2,(monster2.i*35)+2, (monster2.j*35),30,30);
				}
				else if (board2[i][j] == 12) {

					monster3.i=i;
					monster3.j=j;
					context.drawImage(Mon3,(monster3.i*35)+2, (monster3.j*35)+1,30,30);
				}
				else if (board2[i][j] == 6) {
					moving_points.i=i;
					moving_points.j=j;
					fif=new Image();
					fif.src="50.png";
					context.drawImage(fif,(moving_points.i*35)+2, (moving_points.j*35)+1,30,30);
				}

			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j]=0;
	var x = GetKeyPressed()
	if(x==1)
	{
		if(shape.j>0 && board[shape.i][shape.j-1]!=4)
		{
			/*
			first=-0.25;
			second=1.25;
			eye1=10;
			eye2=0;
			*/
			pac_color=1;
			shape.j--;
		}
	}
	if(x==2)
	{
		if(shape.j<10 && board[shape.i][shape.j+1]!=4)
		{
			/*
			first=0.7;
			second=0.25;
			eye1=-15;
			eye2=5;
			*/
			pac_color=2;
			shape.j++;
		}
	}
	if(x==3)
	{
		if(shape.i>0 && board[shape.i-1][shape.j]!=4)
		{
			/*
			first=-0.85;
			second=0.85;
			eye1=0;
			eye2=15;
			*/
			pac_color=3;
			shape.i--;
		}
	}
	if(x==4)
	{
		if(shape.i<16 && board[shape.i+1][shape.j]!=4)
		{
			/*
			first=0.15;
			second=1.85;
			eye1=5;
			eye2=15;
			*/
			pac_color=4;
			shape.i++;
		}
	}
	if(board[shape.i][shape.j]==1)
		lives=lives+1;
	if(board[shape.i][shape.j]==3)
		time_elapsed=time_elapsed+5;
	if(board[shape.i][shape.j]==7)
		score=score+25;
	if(board[shape.i][shape.j]==8)
		score=score+15;
	if(board[shape.i][shape.j]==9)
		score=score+5;
	if(board2[shape.i][shape.j]==6){
		score=score+50;
		board2[moving_points.i][moving_points.j]=0;
		moving_points.i=null;
		moving_points.j=null;
	}
	if(board2[shape.i][shape.j]==10 || board2[shape.i][shape.j]==11 || board2[shape.i][shape.j]==12){
		gold.pause();
		var dead=new Audio('hegzamta.mp3');
		dead.play();
		lives--;
		gold.play();
		if(lives==0){
			lbllives.value=0;
			//canvas.clearRect(0,0,canvas.width,canvas.height);
			window.clearInterval(interval);
			window.clearInterval(interval2);
			window.clearInterval(interval3);
			window.clearInterval(interval4);
			window.clearInterval(interval5);
			window.clearInterval(interval6);
			gold.pause();
			window.alert("You Lost!\n"+"Score: "+score);

		}
		else{
			//window.alert("you have "+lives+" more lives!");
			var g=true;
			while (g===true){
				var [x,y]=findRandomEmptyCell(board);
				if(board2[x][y]===0){
					board[x][y]=2;
					shape.i=x;
					shape.j=y;
					g=false;
				}
			}
			board[shape.i][shape.j]=0;
			board2[monster.i][monster.j]=0;
			board2[15][1]=10;
			if(numofmonsters==2 || numofmonsters==3){
				board2[monster2.i][monster2.j]=0;
				board2[15][9]=11;
			}
			if(numofmonsters==3){
				board2[monster3.i][monster3.j]=0;
				board2[1][9]=12;
			}
		}
	}
	if(lives!=0){
		board[shape.i][shape.j]=2;

		if(time_elapsed<=0)
		{
            gold.pause();
            if(islogout===false){
			
			var win=new Audio('kal.mp3');
			win.play();
                }
			//wait(4000);

			if(score<150 && islogout===false)
				window.alert("You can do better\n"+"Score: "+score);
			else if(islogout===false)
				window.alert("We have a Winner!!!\n"+"Score: "+score);	
			window.clearInterval(interval);
			window.clearInterval(interval2);
			window.clearInterval(interval3);
			window.clearInterval(interval4);
			window.clearInterval(interval5);
			window.clearInterval(interval6);
		}
		else
		{
			Draw();
		}
	}
}
function wait(ms){
	var start = new Date().getTime();
	var end = start;
	while(end < start + ms) {
		end = new Date().getTime();
	}
}
function clock(){
	//var currentTime=new Date();
	time_elapsed=time_elapsed-1;
	//gametime--;
}
function isitover(x){
	gold.pause();
	var dead=new Audio('hegzamta.mp3');
	dead.play();
	lives--;
	gold.play();
	if(lives==0){
		lbllives.value=0;
		//canvas.clearRect(0,0,canvas.width,canvas.height);
		window.clearInterval(interval);
		window.clearInterval(interval2);
		window.clearInterval(interval3);
		window.clearInterval(interval4);
		window.clearInterval(interval5);
		window.clearInterval(interval6);
		gold.pause();
		window.alert("You Lost!\n"+"Score: "+score);

	}
	else{
		board[shape.i][shape.j]=0;
		var g=true;
		while (g===true){
			var [x,y]=findRandomEmptyCell(board);
			if(board2[x][y]===0){
				board[x][y]=2;
				shape.i=x;
				shape.j=y;
				g=false;
			}
		}
		
		board2[monster.i][monster.j]=0;
		board2[15][1]=10;
		if(numofmonsters==2 || numofmonsters==3){
			board2[monster2.i][monster2.j]=0;
			board2[15][9]=11;
		}
		if(numofmonsters==3){
			board2[monster3.i][monster3.j]=0;
			board2[1][9]=12;
		}
	}
}
function MoveMonster1(){
	var x=shape.i-monster.i;
	var y=shape.j-monster.j;
	var w=Math.abs(x)>=Math.abs(y);
	var wall=false;

	if(x>=0 && w && monster.i<16 && board[monster.i+1][monster.j]!=4 && board2[monster.i+1][monster.j]!=lastmonster &&board2[monster.i+1][monster.j]==0)
	{

		if(board[monster.i+1][monster.j]==2){
			isitover(board[monster.i+1][monster.j])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i+1][monster.j]=10;
		}
	}

	else if( y>0 && !w && monster.j<11 && board[monster.i][monster.j+1]!=4 && board2[monster.i][monster.j+1]!=lastmonster&& board2[monster.i][monster.j+1]==0 )// && board[monster.i][monster.j+1]!=2)
	{

		if(board[monster.i][monster.j+1]==2){
			isitover(board[monster.i][monster.j+1])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i][monster.j+1]=10;
		}
	}

	else if(x<0 && w && monster.i>0 && board[monster.i-1][monster.j]!=4 && board[monster.i-1][monster.j]!=lastmonster &&board2[monster.i-1][monster.j]==0)//&& board[monster.i-1][monster.j]!=2)
	{
		if(board[monster.i-1][monster.j]==2){
			isitover(board[monster.i-1][monster.j])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i-1][monster.j]=10;
		}
	}
	else if(y<=0 && !w && monster.j>0 && board[monster.i][monster.j-1]!=4 && board2[monster.i][monster.j-1]!=lastmonster &&board2[monster.i][monster.j-1]==0)// && board[monster.i][monster.j-1]!=2)
	{
		if(board[monster.i][monster.j-1]==2){
			isitover(board[monster.i][monster.j-1])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i][monster.j-1]=10;
		}
	}
	else if(monster.i<17 && board[monster.i+1][monster.j]!=4 && board2[monster.i+1][monster.j]!=lastmonster && board2[monster.i+1][monster.j]==0){
		if(board[monster.i+1][monster.j]==2){
			isitover(board[monster.i+1][monster.j])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i+1][monster.j]=10;
		}
	}
	else if(monster.j<11 && board[monster.i][monster.j+1]!=4 && board2[monster.i][monster.j+1]!=lastmonster&&board2[monster.i][monster.j+1]==0 )// && board[monster.i][monster.j+1]!=2)
	{

		if(board[monster.i][monster.j+1]==2){
			isitover(board[monster.i][monster.j+1])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i][monster.j+1]=10;
		}
	}

	else if(monster.i>0 && board[monster.i-1][monster.j]!=4 && board2[monster.i-1][monster.j]!=lastmonster &&board2[monster.i-1][monster.j]==0)//&& board[monster.i-1][monster.j]!=2)
	{
		if(board[monster.i-1][monster.j]==2){
			isitover(board[monster.i-1][monster.j])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i-1][monster.j]=10;
		}
	}
	else if(monster.j>0 && board[monster.i][monster.j-1]!=4 && board2[monster.i][monster.j-1]!=lastmonster &&board2[monster.i][monster.j-1]==0)// && board[monster.i][monster.j-1]!=2)
	{
		if(board[monster.i][monster.j-1]==2){
			isitover(board[monster.i][monster.j-1])
		}
		else{
			board2[monster.i][monster.j]=0;
			board2[monster.i][monster.j-1]=10;
		}
	}
	lastmonster=board2[monster.i][monster.j];
	Draw();

}
function isitover2(x){
	gold.pause();
	var dead=new Audio('hegzamta.mp3');
	dead.play();
	lives--;
	gold.play();
	if(lives==0){
		lbllives.value=0;
		//canvas.clearRect(0,0,canvas.width,canvas.height);
		window.clearInterval(interval);
		window.clearInterval(interval2);
		window.clearInterval(interval3);
		window.clearInterval(interval4);
		window.clearInterval(interval5);
		window.clearInterval(interval6);
		gold.pause();
		window.alert("You Lost!\n"+"Score: "+score);

	}
	else{
		board[shape.i][shape.j]=0;
		var g=true;
		while (g===true){
			var [x,y]=findRandomEmptyCell(board);
			if(board2[x][y]===0){
				board[x][y]=2;
				shape.i=x;
				shape.j=y;
				g=false;
			}
		}
		
		board2[monster.i][monster.j]=0;
		board2[15][1]=10;
		if(numofmonsters==2 || numofmonsters==3){
			board2[monster2.i][monster2.j]=0;
			board2[15][9]=11;
		}
		if(numofmonsters==3){
			board2[monster3.i][monster3.j]=0;
			board2[1][9]=12;
		}
	}
}
function MoveMonster2(){
	var x=shape.i-monster2.i;
	var y=shape.j-monster2.j;
	var w=Math.abs(x)>=Math.abs(y);
	var wall=false;

	if(x>=0 && w && monster2.i<16 && board[monster2.i+1][monster2.j]!=4 &&board[monster2.i+1][monster2.j]!=lastmonster2 && board2[monster2.i+1][monster2.j]==0)
	{

		if(board[monster2.i+1][monster2.j]==2){
			isitover2(board[monster2.i+1][monster2.j])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i+1][monster2.j]=11;
		}
	}

	else if( y>0 && !w && monster2.j<11 && board[monster2.i][monster2.j+1]!=4 && board[monster2.i][monster2.j+1]!=lastmonster2 &&board2[monster2.i][monster2.j+1]==0)// && board[monster.i][monster.j+1]!=2)
	{

		if(board[monster2.i][monster2.j+1]==2){
			isitover2(board[monster2.i][monster2.j+1])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i][monster2.j+1]=11;
		}
	}

	else if(x<0 && w && monster2.i>0 && board[monster2.i-1][monster2.j]!=4 && board[monster2.i-1][monster2.j]!=lastmonster2 &&board2[monster2.i-1][monster2.j]==0)//&& board[monster.i-1][monster.j]!=2)
	{
		if(board[monster2.i-1][monster2.j]==2){
			isitover2(board[monster2.i-1][monster2.j])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i-1][monster2.j]=11;
		}
	}
	else if(y<=0 && !w && monster2.j>0 && board[monster2.i][monster2.j-1]!=4 && board[monster2.i][monster2.j-1]!=lastmonster2 &&board2[monster2.i][monster2.j-1]==0)// && board[monster.i][monster.j-1]!=2)
	{
		if(board[monster2.i][monster2.j-1]==2){
			isitover2(board[monster2.i][monster2.j-1])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i][monster2.j-1]=11;
		}
	}
	else if(monster2.i<17 && board[monster2.i+1][monster2.j]!=4 && board[monster2.i+1][monster2.j]!=lastmonster2 && board2[monster2.i+1][monster2.j]==0){
		if(board[monster2.i+1][monster2.j]==2){
			isitover2(board[monster2.i+1][monster2.j])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i+1][monster2.j]=11;
		}
	}
	else if(monster2.j<11 && board[monster2.i][monster2.j+1]!=4 && board[monster2.i][monster2.j+1]!=lastmonster2 &&board2[monster2.i][monster2.j+1]==0)// && board[monster.i][monster.j+1]!=2)
	{

		if(board[monster2.i][monster2.j+1]==2){
			isitover2(board[monster2.i][monster2.j+1])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i][monster2.j+1]=11;
		}
	}

	else if(monster2.i>0 && board[monster2.i-1][monster2.j]!=4 && board[monster2.i-1][monster2.j]!=lastmonster2 &&board2[monster2.i-1][monster2.j]==0)//&& board[monster.i-1][monster.j]!=2)
	{
		if(board[monster2.i-1][monster2.j]==2){
			isitover2(board[monster2.i-1][monster2.j])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i-1][monster2.j]=11;
		}
	}
	else if(monster2.j>0 && board[monster2.i][monster2.j-1]!=4 && board[monster2.i][monster2.j-1]!=lastmonster2 &&board2[monster2.i][monster2.j-1]==0)// && board[monster.i][monster.j-1]!=2)
	{
		if(board[monster2.i][monster2.j-1]==2){
			isitover2(board[monster2.i][monster2.j-1])
		}
		else{
			board2[monster2.i][monster2.j]=0;
			board2[monster2.i][monster2.j-1]=11;
		}
	}
	lastmonster2=board2[monster2.i][monster2.j];
	Draw();
}
function isitover3(x){
	gold.pause();
	var dead=new Audio('hegzamta.mp3');
	dead.play();
	lives--;
	gold.play();
	if(lives==0){
		lbllives.value=0;
		//canvas.clearRect(0,0,canvas.width,canvas.height);
		window.clearInterval(interval);
		window.clearInterval(interval2);
		window.clearInterval(interval3);
		window.clearInterval(interval4);
		window.clearInterval(interval5);
		window.clearInterval(interval6);
		gold.pause();
		window.alert("You Lost!\n"+"Score: "+score);

	}
	else{
		board[shape.i][shape.j]=0;
		var g=true;
		while (g===true){
			var [x,y]=findRandomEmptyCell(board);
			if(board2[x][y]===0){
				board[x][y]=2;
				shape.i=x;
				shape.j=y;
				g=false;
			}
		}
		//board[shape.i][shape.j]=0;
		board2[monster.i][monster.j]=0;
		board2[15][1]=10;
		if(numofmonsters==2 || numofmonsters==3){
			board2[monster2.i][monster2.j]=0;
			board2[15][9]=11;
		}
		if(numofmonsters==3){
			board2[monster3.i][monster3.j]=0;
			board2[1][9]=12;
		}
	}
}
function MoveMonster3(){
	var x=shape.i-monster3.i;
	var y=shape.j-monster3.j;
	var w=Math.abs(x)>=Math.abs(y);
	var wall=false;

	if(x>=0 && w && monster3.i<16 && board[monster3.i+1][monster3.j]!=4 &&board[monster3.i+1][monster3.j]!=lastmonster3 &&board2[monster3.i+1][monster3.j]==0)
	{

		if(board[monster3.i+1][monster3.j]==2){
			isitover3(board[monster3.i+1][monster3.j])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i+1][monster3.j]=12;
		}
	}

	else if( y>0 && !w && monster3.j<11 && board[monster3.i][monster3.j+1]!=4 && board[monster3.i][monster3.j+1]!=lastmonster3&&board2[monster3.i][monster3.j+1]==0)// && board[monster.i][monster.j+1]!=2)
	{

		if(board[monster3.i][monster3.j+1]==2){
			isitover3(board[monster3.i][monster3.j+1])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i][monster3.j+1]=12;
		}
	}

	else if(x<0 && w && monster3.i>0 && board[monster3.i-1][monster3.j]!=4 && board[monster3.i-1][monster3.j]!=lastmonster3 && board2[monster3.i-1][monster3.j]==0)//&& board[monster.i-1][monster.j]!=2)
	{
		if(board[monster3.i-1][monster3.j]==2){
			isitover3(board[monster3.i-1][monster3.j])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i-1][monster3.j]=12;
		}
	}
	else if(y<=0 && !w && monster3.j>0 && board[monster3.i][monster3.j-1]!=4 && board[monster3.i][monster3.j-1]!=lastmonster3 && board2[monster3.i][monster3.j-1]==0)// && board[monster.i][monster.j-1]!=2)
	{
		if(board[monster3.i][monster3.j-1]==2){
			isitover3(board[monster3.i][monster3.j-1])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i][monster3.j-1]=12;
		}
	}
	else if(monster3.i<17 && board[monster3.i+1][monster3.j]!=4 && board[monster3.i+1][monster3.j]!=lastmonster3 && board2[monster3.i+1][monster3.j]==0){
		if(board[monster3.i+1][monster3.j]==2){
			isitover3(board[monster3.i+1][monster3.j])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i+1][monster3.j]=12;
		}
	}
	else if(monster3.j<11 && board[monster3.i][monster3.j+1]!=4 && board[monster3.i][monster3.j+1]!=lastmonster3&&board2[monster3.i][monster3.j+1]==0)// && board[monster.i][monster.j+1]!=2)
	{

		if(board[monster3.i][monster3.j+1]==2){
			isitover3(board[monster3.i][monster3.j+1])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i][monster3.j+1]=12;
		}
	}

	else if(monster3.i>0 && board[monster3.i-1][monster3.j]!=4 && board[monster3.i-1][monster3.j]!=lastmonster3 && board2[monster3.i-1][monster3.j]==0)//&& board[monster.i-1][monster.j]!=2)
	{
		if(board[monster3.i-1][monster3.j]==2){
			isitover3(board[monster3.i-1][monster3.j])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i-1][monster3.j]=12;
		}
	}
	else if(monster3.j>0 && board[monster3.i][monster3.j-1]!=4 && board[monster3.i][monster3.j-1]!=lastmonster3 && board2[monster3.i][monster3.j-1]==0)// && board[monster.i][monster.j-1]!=2)
	{
		if(board[monster3.i][monster3.j-1]==2){
			isitover3(board[monster3.i][monster3.j-1])
		}
		else{
			board2[monster3.i][monster3.j]=0;
			board2[monster3.i][monster3.j-1]=12;
		}
	}
	lastmonster3=board2[monster3.i][monster3.j];
	Draw();
}
function MoveMonsterWall(){

}
function MoveMovingPoints(){
	var mo;
	mo=Math.floor((Math.random()*4)+1);

	if(mo==1 && moving_points.i<15 && board[moving_points.i+1][moving_points.j]!=4 && board[moving_points.i+1][moving_points.j]!=2 && board[moving_points.i+1][moving_points.j]!=lastprize && board2[moving_points.i+1][moving_points.j]==0)
	{
		board2[moving_points.i][moving_points.j]=0;
		board2[moving_points.i+1][moving_points.j]=6;
		Draw();
	}

	else if(mo==2 && moving_points.j<9 && board[moving_points.i][moving_points.j+1]!=4 && board[moving_points.i][moving_points.j+1]!=2 && board[moving_points.i][moving_points.j+1]!=lastprize && board2[moving_points.i][moving_points.j+1]==0)
	{
		board2[moving_points.i][moving_points.j]=0;
		board2[moving_points.i][moving_points.j+1]=6;
		Draw();
	}

	else if(mo==3 && moving_points.i>0 && board[moving_points.i-1][moving_points.j]!=4 && board[moving_points.i-1][moving_points.j]!=2 && board[moving_points.i-1][moving_points.j]!=lastprize && board2[moving_points.i-1][moving_points.j]==0)
	{
		board2[moving_points.i][moving_points.j]=0;
		board2[moving_points.i-1][moving_points.j]=6;
		Draw();
	}
	else if(mo==4 && moving_points.j>0 && board[moving_points.i][moving_points.j-1]!=4 && board[moving_points.i][moving_points.j-1]!=2 && board[moving_points.i][moving_points.j-1]!=lastprize && board2[moving_points.i][moving_points.j-1]==0)
	{
		board2[moving_points.i][moving_points.j]=0;
		board2[moving_points.i][moving_points.j-1]=6;
		Draw();
	}
	lastprize=board2[moving_points.i][moving_points.j];
}

function Restart(){
	//window.alert("NNNNNNNNNNNNNN");
	//tabcontent = document.getElementsByClassName("tabcontent");
	//for (i = 0; i < tabcontent.length; i = i + 1) {
	//	tabcontent[i].style.display = "none";
	//}
	$("#can").show();
	window.clearInterval(interval);
	window.clearInterval(interval2);
	window.clearInterval(interval3);
	window.clearInterval(interval4);
	window.clearInterval(interval5);
	window.clearInterval(interval6);
	//$("#gameBoard").show();
	Start($("#balls")[0].value, $("#ghosts")[0].value, $("#time")[0].value);
	gold.currentTime=0;
	lives=3;
    islogout=false;
	//window.alert("GGGGGGGGGGGG");
}
/*
			}

		</script>
	</body>

</html>-->*/