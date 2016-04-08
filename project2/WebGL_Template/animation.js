// *******************************************************
// CS 174a Graphics Example Code
// animation.js - The main file and program start point.  The class definition here describes how to display an Animation and how it will react to key and mouse input.  Right now it has 
// very little in it - you will fill it in with all your shape drawing calls and any extra key / mouse controls.  

// Now go down to display() to see where the sample shapes are drawn, and to see where to fill in your own code.

"use strict"
var canvas, canvas_size, gl = null, g_addrs,
movement = vec2(),	thrust = vec3(), 	looking = false, prev_time = 0, animate = false, animation_time = 0;
var gouraud = false, color_normals = false, solid = false;
var mvMatrixStack = []; 
var mvMatrixStack1 = [];
var mvMatrixStack2 = [];
var mvMatrixStacko1 = []; 
var mvMatrixStacko2 = [];
var mvMatrixStacko3 = [];
var model_transform = mat4();
var model_transform1 =  new mat4();
var model_transform2 =  new mat4();
var model_transform3 =  new mat4();
var model_transform4 =  new mat4();
var model_transform5 =  new mat4();
var model_transform6 =  new mat4();
var model_transform7 =  new mat4();
var model_transform8 =  new mat4();
var model_transform9 =  new mat4();
var model_transform10 =  new mat4();
var model_transform11=new mat4();
var model_transform12= new mat4();
var model_transform13= new mat4();
var model_transform14=new mat4();
var x,y,z,x1,y1,z1;
var bcamera=false;
 var positionplayer=[];
 var position1=[];
 var position2=[];
 var position3=[];
 var xobj1=false;
 var xobj2=false;
 var xobj3=false;
 var erase1=false;
 var erase2=false;
 var erase3=false;
 var erase4=false;
 var erase5=false;
 var erase6=false;
 var erase7=false;
 var erase8=false;
 var erase9=false;
 var level=1;
 var countl=0;
var count1=false;
var count2=false;
var count3=false;
var count4=false;
var count5=false;
var count6=false;
var count7=false;
var count8=false;
var count9=false;
var win=false;
var start=false;
var lose=false;
var string1="jieni.png",string2= "miao.png"  ,string3="long.png"    ;
var camerar=false;
// *******************************************************	
// When the web page's window loads it creates an Animation object, which registers itself as a displayable object to our other class GL_Context -- which OpenGL is told to call upon every time a
// draw / keyboard / mouse event happens.

window.onload = function init() {	var anim = new Animation();	}
function Animation()
{
	( function init (self) 
	{
		self.context = new GL_Context( "gl-canvas" );
		self.context.register_display_object( self );
		
		gl.clearColor( 0.8, 0.4, 0.7, 1 );			// Background color

		self.m_cube = new cube();
		self.m_obj = new shape_from_file( "teapot.obj" )
		self.m_axis = new axis();
		self.m_sphere = new sphere( mat4(), 4 );	
		self.m_fan = new triangle_fan_full( 10, mat4() );
		self.m_strip = new rectangular_strip( 1, mat4() );
		self.m_cylinder = new cylindrical_strip( 10, mat4() );
		self.m_own1 = new ownshape1( mat4() ); 
		self.camera_transform = translate(0, 0,-40);
		self.projection_transform = perspective(45, canvas.width/canvas.height, .1, 100);		// The matrix that determines how depth is treated.  It projects 3D points onto a plane.
		self.m_own2 = new ownshape2( mat4() ); 
		gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);		gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);		gl.uniform1i( g_addrs.SOLID_loc, solid);
		
		self.animation_time = 0
		self.context.render();	
	} ) ( this );	
	
	canvas.addEventListener('mousemove', function(e)	{		e = e || window.event;		movement = vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2, 0);	});
}


function update_camera( self, animation_delta_time )
	{
		var leeway = 70, border = 50;
		var degrees_per_frame = .00005 * animation_delta_time;
		var meters_per_frame  = .005 * animation_delta_time;
																					// Determine camera rotation movement first
		var movement_plus  = [ movement[0] + leeway, movement[1] + leeway ];		// movement[] is mouse position relative to canvas center; leeway is a tolerance from the center.
		var movement_minus = [ movement[0] - leeway, movement[1] - leeway ];
		var outside_border = false;
		
		for( var i = 0; i < 2; i++ )
			if ( Math.abs( movement[i] ) > canvas_size[i]/2 - border )	outside_border = true;		// Stop steering if we're on the outer edge of the canvas.

		for( var i = 0; looking && outside_border == false && i < 2; i++ )			// Steer according to "movement" vector, but don't start increasing until outside a leeway window from the center.
		{
		
			var velocity = ( ( movement_minus[i] > 0 && movement_minus[i] ) || ( movement_plus[i] < 0 && movement_plus[i] ) ) * degrees_per_frame;	// Use movement's quantity unless the &&'s zero it out
			self.camera_transform = mult( rotate( velocity, i, 1-i, 0 ), self.camera_transform );			// On X step, rotate around Y axis, and vice versa.
				
		}
	
		self.camera_transform = mult( translate( scale_vec( meters_per_frame, thrust ) ), self.camera_transform );		// Now translation movement of camera, applied in local camera coordinate frame
	}

// *******************************************************	
// display(): called once per frame, whenever OpenGL decides it's time to redraw.


Animation.prototype.display = function(time)
	{
		gl.uniform4fv( g_addrs.color_loc, 			vec4( .8,.8,.8,1 ) );
		
		if(!time) time = 0;
		var animation_delta_time = time - prev_time;
		if(animate) this.animation_time += animation_delta_time;
		prev_time = time;
		
		update_camera( this, animation_delta_time );
			
		var basis_id = 0;
		/**********************************
		Start coding here!!!!
		**********************************/
		   		

		 
		
		if(!start)
		this.draw_background(model_transform11,model_transform12);
	if (count1&&count2&&count3&&count4&&count5&&count6&&count7&&count8&&count9)
	{
	win=true;	
	}
		if ((this.animation_time/1000)>70)
			lose=true;
		if(start&&!win&&!lose)
		{
			this.draw_board(model_transform);
		this.draw_Cline(model_transform1);
		this.draw_Robject(model_transform2);
		this.draw_Robject1(model_transform3);
		this.draw_Robject2(model_transform4);
		this.draw_background(model_transform11);
		   if ((this.animation_time/1000)<=70)
	          this.draw_time(model_transform14);
		}
		if(win)
		{
		this.draw_gamewin(model_transform13);	
		}
		if(lose)
		{
		this.draw_gameover(model_transform12);	
		}
		
	}	
	Animation.prototype.update_strings = function( debug_screen_object )		// Strings this particular class contributes to the UI
{
	if (start&&((this.animation_time/1000)<=70)&&(!win)&&(!lose))
	debug_screen_object.string_map["level"] = "Level  : " + level;
	if (start&&((this.animation_time/1000)<=70)&&(!win)&&(!lose))
	debug_screen_object.string_map["time"] = "Time remaining: " + (70-(this.animation_time/1000)) + "s";
	

}
Animation.prototype.draw_gamewin= function(model_transform13)
	{
		model_transform13 = mult( model_transform13, translate( 0, 0, -61 ) );
	model_transform13 = mult( model_transform13, scale( 142, 90, 3) );
		this.m_cube.draw(model_transform13, this.camera_transform, this.projection_transform,"pika.png");
		
	}
Animation.prototype.draw_gameover= function(model_transform12)
	{
		model_transform12 = mult( model_transform12, translate( 0, 0, -61 ) );
	model_transform12 = mult( model_transform12, scale( 142, 90, 3) );
		this.m_cube.draw(model_transform12, this.camera_transform, this.projection_transform,"GG.png");
		
	}
	Animation.prototype.draw_background= function(model_transform11,model_transform12)
	{
		model_transform11 = mult( model_transform11, translate( 0, 0, -61 ) );
	model_transform11 = mult( model_transform11, scale( 142, 90, 3) );
		this.m_cube.draw(model_transform11, this.camera_transform, this.projection_transform,"bbbb.png");
		
	}
Animation.prototype.draw_Robject = function (model_transform2)
{
		
			model_transform2 = mult( model_transform2, translate( -21, 11, -5.8 ) );
	model_transform2 = mult( model_transform2, scale( 3, 3, 3) );
	position1[0]=model_transform2[0][3];
	position1[1]=model_transform2[1][3];
	position1[2]=model_transform2[2][3];
	var xx,yy,zz;
	xx=Math.abs(positionplayer[0]-position1[0]);
	yy=Math.abs(positionplayer[1]-position1[1]);
	zz=Math.abs(positionplayer[2]-position1[2]);
	if (xx<=3&&yy<=3&&zz<=3&&!xobj2&&!xobj3)
		xobj1=true;
	if (!xobj1)
		model_transform2 = mult( model_transform2, rotate( this.animation_time/40, 0, -1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position1[1]);
	checkz=Math.abs(8-position1[2]);
	if (checky<=3&&checkz<=3)
	{
		erase1=true;
		xobj1=false;
		count1=true;	
	}
	if (!erase1)
		this.m_sphere.draw(model_transform2, this.camera_transform, this.projection_transform,string1);
	if (count1&count2&count3)
		{
			level=2;
       // model_transform2=mvMatrixStacko1.pop(model_transform2);
		}
		if (level==2)
		{string1="mwc.png";
	this.draw_Robject3(model_transform5);
		}
		
	
		
	
}
Animation.prototype.draw_Robject3 = function (model_transform5)
{
	
			model_transform5 = mult( model_transform5, translate( -18, 3, -6.8 ) );
	model_transform5 = mult( model_transform5, scale( 3, 3, 3) );
	position1[0]=model_transform5[0][3];
	position1[1]=model_transform5[1][3];
	position1[2]=model_transform5[2][3];
	var xx,yy,zz;
	xx=Math.abs(positionplayer[0]-position1[0]);
	yy=Math.abs(positionplayer[1]-position1[1]);
	zz=Math.abs(positionplayer[2]-position1[2]);
	if (xx<=3&&yy<=3&&zz<=3&&!xobj2&&!xobj3)
		xobj1=true;
	if (!xobj1)
		model_transform5 = mult( model_transform5, rotate( this.animation_time/40, 0, -1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position1[1]);
	checkz=Math.abs(8-position1[2]);
	if (checky<=3&&checkz<=3)
	{
		erase4=true;
		xobj1=false;
		count4=true;	
	}
	if (!erase4)
		this.m_sphere.draw(model_transform5, this.camera_transform, this.projection_transform,string1);
	if (count4&count5&count6)
		{
			level=3;
       // model_transform2=mvMatrixStacko1.pop(model_transform2);
		}
		if (level==3)
		{string1="mwh.png";
	this.draw_Robject6(model_transform8);
		}
	
	
}
Animation.prototype.draw_Robject6 = function (model_transform8)
{
	
	model_transform8 = mult( model_transform8, translate( -22, 12, -7.8 ) );
	model_transform8 = mult( model_transform8, scale( 3, 3, 3) );
	position1[0]=model_transform8[0][3];
	position1[1]=model_transform8[1][3];
	position1[2]=model_transform8[2][3];
	var xx,yy,zz;
	xx=Math.abs(positionplayer[0]-position1[0]);
	yy=Math.abs(positionplayer[1]-position1[1]);
	zz=Math.abs(positionplayer[2]-position1[2]);
	if (xx<=3&&yy<=3&&zz<=3&&!xobj2&&!xobj3)
		xobj1=true;
	if (!xobj1)
		model_transform8 = mult( model_transform8, rotate( this.animation_time/40, 0, -1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position1[1]);
	checkz=Math.abs(8-position1[2]);
	if (checky<=3&&checkz<=3)
	{
		erase7=true;
		xobj1=false;
		count7=true;	
	}
	if (!erase7)
		this.m_sphere.draw(model_transform8, this.camera_transform, this.projection_transform,string1);
	
}
Animation.prototype.draw_Robject1 = function (model_transform3)
{
	
		model_transform3 = mult( model_transform3, translate( -2, 2, -4.2 ) );
		model_transform3 = mult( model_transform3, scale( 5, 5, 5) );
		position2[0]=model_transform3[0][3];
	position2[1]=model_transform3[1][3];
	position2[2]=model_transform3[2][3];
	var xx1,yy1,zz1;
	xx1=Math.abs(positionplayer[0]-position2[0]);
	yy1=Math.abs(positionplayer[1]-position2[1]);
	zz1=Math.abs(positionplayer[2]-position2[2]);
	if (xx1<=5&&yy1<=5&&zz1<=5&&!xobj1&&!xobj3)
		xobj2=true;
	if (!xobj2)
		model_transform3 = mult( model_transform3, rotate( this.animation_time/40, 0, 1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position2[1]);
	checkz=Math.abs(8-position2[2]);
	if (checky<=3&&checkz<=3)
	{
		erase2=true;
		xobj2=false;
	    count2=true;
		}
		if (!erase2)
		this.m_cube.draw(model_transform3, this.camera_transform, this.projection_transform,string2);
	if (count1&count2&count3)
		{
			level=2;
		erase2=false;
	 //model_transform3=mvMatrixStacko2.pop(model_transform3);
		}
	if (level==2)
	{string2="ddg.png";
    this.draw_Robject4(model_transform6); 
	}
	
	
			
}
 Animation.prototype.draw_Robject4=function(model_transform6)
 {
	
		model_transform6 = mult( model_transform6, translate( 1, -7, -6.2 ) );
		model_transform6 = mult( model_transform6, scale( 5, 5, 5) );
		position2[0]=model_transform6[0][3];
	position2[1]=model_transform6[1][3];
	position2[2]=model_transform6[2][3];
	var xx1,yy1,zz1;
	xx1=Math.abs(positionplayer[0]-position2[0]);
	yy1=Math.abs(positionplayer[1]-position2[1]);
	zz1=Math.abs(positionplayer[2]-position2[2]);
	if (xx1<=5&&yy1<=5&&zz1<=5&&!xobj1&&!xobj3)
		xobj2=true;
	if (!xobj2)
		model_transform6 = mult( model_transform6, rotate( this.animation_time/40, 0, 1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position2[1]);
	checkz=Math.abs(8-position2[2]);
	if (checky<=3&&checkz<=3)
	{
		erase5=true;
		xobj2=false;
	    count5=true;
		}
		if (!erase5)
		this.m_cube.draw(model_transform6, this.camera_transform, this.projection_transform,string2);
	if (count4&count5&count6)
		{
			level=3;
       // model_transform2=mvMatrixStacko1.pop(model_transform2);
		}
		if (level==3)
		{string2="phl.png";
	this.draw_Robject7(model_transform9);
		}
	
	
 }
 Animation.prototype.draw_Robject7=function(model_transform9)
 {
	
		model_transform9 = mult( model_transform9, translate( -8, -7, -5.2 ) );
		model_transform9 = mult( model_transform9, scale( 5, 5, 5) );
		position2[0]=model_transform9[0][3];
	position2[1]=model_transform9[1][3];
	position2[2]=model_transform9[2][3];
	var xx1,yy1,zz1;
	xx1=Math.abs(positionplayer[0]-position2[0]);
	yy1=Math.abs(positionplayer[1]-position2[1]);
	zz1=Math.abs(positionplayer[2]-position2[2]);
	if (xx1<=5&&yy1<=5&&zz1<=5&&!xobj1&&!xobj3)
		xobj2=true;
	if (!xobj2)
		model_transform9 = mult( model_transform9, rotate( this.animation_time/40, 0, 1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position2[1]);
	checkz=Math.abs(8-position2[2]);
	if (checky<=3&&checkz<=3)
	{
		erase8=true;
		xobj2=false;
	    count8=true;
		}
		if (!erase8)
		this.m_cube.draw(model_transform9, this.camera_transform, this.projection_transform,string2); 
	 
	 
 }
Animation.prototype.draw_Robject2 = function (model_transform4)
{
	
			model_transform4 = mult( model_transform4, translate(17, 11.6, -6.2 ) );
		model_transform4 = mult( model_transform4, scale( 4, 4, 4) );
		position3[0]=model_transform4[0][3];
		position3[1]=model_transform4[1][3];
	position3[2]=model_transform4[2][3];
	var xx2,yy2,zz2;
	xx2=Math.abs(positionplayer[0]-position3[0]);
	yy2=Math.abs(positionplayer[1]-position3[1]);
	zz2=Math.abs(positionplayer[2]-position3[2]);
	
	if (xx2<=4&&yy2<=4&&zz2<=4&&!xobj2&&!xobj1)
		xobj3=true;
	if (!xobj3)
		model_transform4 = mult( model_transform4, rotate( this.animation_time/40, 0, 1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position3[1]);
	checkz=Math.abs(8-position3[2]);
	if (checky<=3&&checkz<=3)
	{
		erase3=true;
		xobj3=false;
		count3=true;
		  
	}
	if (!erase3)
			this.m_sphere.draw(model_transform4, this.camera_transform, this.projection_transform,string3);
	if (count1&count2&count3)
		{
			level=2;
		erase3=false;
	   
		}
if (level==2)
	{
			string3="hkl.png";
	this.draw_Robject5(model_transform7);	
	}		
	
	
		}
Animation.prototype.draw_Robject5 =function (model_transform7)
{
    		
			model_transform7 = mult( model_transform7, translate(21, 9, -7.2 ) );
		model_transform7 = mult( model_transform7, scale( 4, 4, 4) );
		position3[0]=model_transform7[0][3];
		position3[1]=model_transform7[1][3];
	position3[2]=model_transform7[2][3];
	var xx2,yy2,zz2;
	xx2=Math.abs(positionplayer[0]-position3[0]);
	yy2=Math.abs(positionplayer[1]-position3[1]);
	zz2=Math.abs(positionplayer[2]-position3[2]);
	
	if (xx2<=4&&yy2<=4&&zz2<=4&&!xobj2&&!xobj1)
		xobj3=true;
	if (!xobj3)
		model_transform7 = mult( model_transform7, rotate( this.animation_time/40, 0, 1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position3[1]);
	checkz=Math.abs(8-position3[2]);
	if (checky<=3&&checkz<=3)
	{
		erase6=true;
		xobj3=false;
		count6=true;
		  
	}
	if (!erase6)
			this.m_sphere.draw(model_transform7, this.camera_transform, this.projection_transform,string3);	
if (count4&count5&count6)
		{
			level=3;
       // model_transform2=mvMatrixStacko1.pop(model_transform2);
		}
		if (level==3)
		{
			string3="sjg.png";
	this.draw_Robject8(model_transform10);
		}
		
		}
Animation.prototype.draw_Robject8 =function (model_transform10)
{
	
			model_transform10 = mult( model_transform10, translate(15, 8, -7.2 ) );
		model_transform10 = mult( model_transform10, scale( 4, 4, 4) );
		position3[0]=model_transform10[0][3];
		position3[1]=model_transform10[1][3];
	position3[2]=model_transform10[2][3];
	var xx2,yy2,zz2;
	xx2=Math.abs(positionplayer[0]-position3[0]);
	yy2=Math.abs(positionplayer[1]-position3[1]);
	zz2=Math.abs(positionplayer[2]-position3[2]);
	
	if (xx2<=4&&yy2<=4&&zz2<=4&&!xobj2&&!xobj1)
		xobj3=true;
	if (!xobj3)
		model_transform10 = mult( model_transform10, rotate( this.animation_time/40, 0, 1, 0 ) );
	var checky,checkz;
	checky=Math.abs(-8-position3[1]);
	checkz=Math.abs(8-position3[2]);
	if (checky<=3&&checkz<=3)
	{
		erase9=true;
		xobj3=false;
		count9=true;
		  
	}
	if (!erase9)
			this.m_sphere.draw(model_transform10, this.camera_transform, this.projection_transform,string3);	
	
	
}
Animation.prototype.draw_Cline = function (model_transform1)//y=-8 z=8
{
		//gl.uniform4fv( g_addrs.color_loc, 			vec4( 0.42,.85,.37,0.7 ) );
		
		model_transform1 = mult( model_transform1, translate( -30, -8, 8) );
				model_transform1 = mult( model_transform1, scale( 0.8, 0.4, 0.2 ) );
	this.m_own1.draw( model_transform1, this.camera_transform, this.projection_transform ,"ball.png");	
	for (var x=0;x<55;x++)
	{
		
		model_transform1 = mult( model_transform1, translate( 2, 0, 0) );
		this.m_own1.draw(model_transform1, this.camera_transform, this.projection_transform,"ball.png");
	}
	
	
}

Animation.prototype.draw_board = function (model_transform)
{
	model_transform = mult( model_transform, translate( 0, -8, 17 ) );

		 mvMatrixStack.push(model_transform);
  
       	if (camerar==true)
				{
		this.camera_transform = lookAt(vec3(animation_time, 0, -40), vec3(0,0,0), vec3(0,1,0) ); 		
				}
			else 
				this.camera_transform = lookAt(vec3(animation_time, 0, 40), vec3(0,0,0), vec3(0,1,0) ); 	
		model_transform = mult( model_transform, scale( 5, 2, 1 ) );
       
	
		
	
		this.m_cube.draw( model_transform, this.camera_transform, this.projection_transform, "pika.png" );	

	   this.draw_arms(model_transform);
	
}
Animation.prototype.draw_time = function( model_transform14 )
{   gl.uniform4fv( g_addrs.color_loc, 			vec4( .8,.8,.37,1 ) );
    model_transform14 = mult( model_transform14, translate( -14, -14, 3 ) );
	model_transform14 = mult( model_transform14, scale( 0.2, 0.2, 0.2 ) );
	model_transform14 = mult( model_transform14, rotate( this.animation_time/40, 0, 0, 1 ) );
	this.m_own2.draw( model_transform14, this.camera_transform, this.projection_transform );	
}
Animation.prototype.draw_arms = function( model_transform )
{
	  model_transform=mvMatrixStack.pop();
	  model_transform = mult( model_transform, rotate( 90, -1,0,0 ) );
	      mvMatrixStack.push(model_transform);
		model_transform = mult( model_transform, translate( 2.4, 0.68, 0 ) );
       if (!xobj1&&!xobj2&&!xobj3)			
		model_transform = mult( model_transform, rotate( ((-1+Math.sin(this.animation_time/500))*22), 0,0,1 ) );
		model_transform = mult( model_transform, scale( 0.8, 2.5, 1 ) );
		model_transform = mult( model_transform, translate( 0, .55, 0 ) );
		this.m_cube.draw( model_transform, this.camera_transform, this.projection_transform );
		model_transform = mult( model_transform, translate( 0, 0.86, 0 ) );
		if (!xobj1&&!xobj2&&!xobj3)	
		model_transform = mult( model_transform, rotate( ((1+Math.sin(this.animation_time/500))*22), 0,0,1 ) );
		this.m_cube.draw( model_transform, this.camera_transform, this.projection_transform );
		model_transform = mult( model_transform, translate( 0, 0.95, 0 ) );
		model_transform = mult( model_transform, scale( 0.8, 0.7, 1 ) );
		if (!xobj1&&!xobj2&&!xobj3)	
		model_transform = mult( model_transform, rotate( this.animation_time/20, 0, 1, 0 ) );
		this.m_sphere.draw( model_transform, this.camera_transform, this.projection_transform,"ball.png" );
       model_transform=mvMatrixStack.pop();
	    mvMatrixStack.push(model_transform);		
		model_transform = mult( model_transform, translate( -2.4, 0.68, 0 ) );
      if (!xobj1&&!xobj2&&!xobj3)		
		model_transform = mult( model_transform, rotate( ((-1+Math.sin(this.animation_time/500))*22), 0,0,-1 ) );
		model_transform = mult( model_transform, scale( 0.8, 2.5, 1 ) );
		model_transform = mult( model_transform, translate( 0, .55, 0 ) );
		this.m_cube.draw( model_transform, this.camera_transform, this.projection_transform );
			model_transform = mult( model_transform, translate( 0, 0.86, 0 ) );
		if (!xobj1&&!xobj2&&!xobj3)
		model_transform = mult( model_transform, rotate( ((1+Math.sin(this.animation_time/500))*22), 0,0,-1 ) );
		this.m_cube.draw( model_transform, this.camera_transform, this.projection_transform );
		x=model_transform[0][3];
		y=model_transform[1][3];
		z=model_transform[2][3];
				model_transform = mult( model_transform, translate( 0, 0.95, 0 ) );
		model_transform = mult( model_transform, scale( 0.8, 0.7, 1 ) );
		if (!xobj1&&!xobj2&&!xobj3)
		model_transform = mult( model_transform, rotate( this.animation_time/20, 0, -1, 0 ) );/// model_transform = the position (4th cols is the position) using model_transform inside init key.
		this.m_sphere.draw( model_transform, this.camera_transform, this.projection_transform,"ball.png" );
		x1=model_transform[0][3];
		y1=model_transform[1][3];
		z1=model_transform[2][3];
		positionplayer[0]=(x+x1)/2;
		positionplayer[1]=(y+y1)/2;
		positionplayer[2]=(z+z1)/2;
	     model_transform=mvMatrixStack.pop();
}

// *******************************************************	
// init_keys():  Define any extra keyboard shortcuts here
Animation.prototype.init_keys = function()
{
	shortcut.add( "s", function() { model_transform = mult( model_transform, translate( 0, -.7, 0 ) );
	if (xobj1)
	{
		if (level==1)
		model_transform2 = mult( model_transform2, translate( 0, -.7, 0 ) );
	else if (level==2)
		model_transform5 = mult( model_transform5, translate( 0, -.7, 0 ) );
	else 
		model_transform8 = mult( model_transform8, translate( 0, -.7, 0 ) );
	}
		
	if (xobj2)
{
		if (level==1)
		model_transform3 = mult( model_transform3, translate( 0, -.7, 0 ) );
	else if (level==2)
		model_transform6 = mult( model_transform6, translate( 0, -.7, 0 ) );
	else
		model_transform9 = mult( model_transform9, translate( 0, -.7, 0 ) );
	}
	if (xobj3)
		{
		if (level==1)
		model_transform4 = mult( model_transform4, translate( 0, -.7, 0 ) );
	else if (level==2)
		model_transform7 = mult( model_transform7, translate( 0, -.7, 0 ) );
	else
		model_transform10 = mult( model_transform10, translate( 0, -.7, 0 ) );
	}
	} );	
	shortcut.add( "w",     function() { model_transform = mult( model_transform, translate( 0, 0.7, 0 ) );
    if (xobj1)
	{
		if (level==1)
		model_transform2 = mult( model_transform2, translate( 0, .7, 0 ) );
	else if (level==2)
		model_transform5 = mult( model_transform5, translate( 0, .7, 0 ) );
	else
		model_transform8 = mult( model_transform8, translate( 0, .7, 0 ) );
	}
		
	if (xobj2)
		{
		if (level==1)
		model_transform3 = mult( model_transform3, translate( 0, .7, 0 ) );
	else if (level==2)
		model_transform6 = mult( model_transform6, translate( 0, .7, 0 ) );
	else
		model_transform9 = mult( model_transform9, translate( 0, .7, 0 ) );
	}
	if (xobj3)
		{
		if (level==1)
		model_transform4 = mult( model_transform4, translate( 0, .7, 0 ) );
	else if (level==2)
		model_transform7 = mult( model_transform7, translate( 0, .7, 0 ) );
	else
		model_transform10 = mult( model_transform10, translate( 0, .7, 0 ) );
	}
	} );	
	shortcut.add( "q",     function() { 	model_transform = mult( model_transform, translate( 0, 0, .7 ) );
    if (xobj1)
	{
		if (level==1)
		model_transform2 = mult( model_transform2, translate( 0, 0, 0.7 ) );
	else if (level==2)
		model_transform5 = mult( model_transform5, translate( 0, 0, 0.7 ) );
	else
		model_transform8 = mult( model_transform8, translate( 0, 0, 0.7 ) );
	}
		
	 if (xobj2)
		{
		if (level==1)
		model_transform3 = mult( model_transform3, translate( 0, 0, 0.7 ) );
	else if (level==2)
		model_transform6 = mult( model_transform6, translate( 0, 0, 0.7 ) );
	else
		model_transform9 = mult( model_transform9, translate( 0, 0, 0.7 ) );
	}
	 if (xobj3)
	{
		if (level==1)
		model_transform4 = mult( model_transform4, translate( 0, 0, 0.7 ) );
	else if (level==2)
		model_transform7 = mult( model_transform7, translate( 0, 0, 0.7 ) );
	else
		model_transform10 = mult( model_transform10, translate( 0, 0, 0.7 ) );
	}
	} ); 	
	shortcut.add( "d",     function() { 	model_transform = mult( model_transform, translate( .7, 0, 0 ) ); 
	if (xobj1)
	{
		if (level==1)
		model_transform2 = mult( model_transform2, translate( 0.7, 0, 0 ) );
	else if (level==2)
		model_transform5 = mult( model_transform5, translate( 0.7, 0, 0 ) );
	else
		model_transform8 = mult( model_transform8, translate( 0.7, 0, 0 ) );
	}
		
	if (xobj2)
		{
		if (level==1)
		model_transform3 = mult( model_transform3, translate( 0.7, 0, 0 ) );
	else if (level==2)
		model_transform6 = mult( model_transform6, translate( 0.7, 0, 0 ) );
	else
		model_transform9 = mult( model_transform9, translate( 0.7, 0, 0 ) );
	}
		if (xobj3)
		{
		if (level==1)
		model_transform4 = mult( model_transform4, translate( 0.7, 0, 0 ) );
	else if (level==2)
		model_transform7 = mult( model_transform7, translate( 0.7, 0, 0 ) );
	else
		model_transform10 = mult( model_transform10, translate( 0.7, 0, 0 ) );
	}
	} ); 	
	shortcut.add( "e",     function() { 	model_transform = mult( model_transform, translate( 0, 0, -.7 ) );
if (xobj1)
	{
		if (level==1)
		model_transform2 = mult( model_transform2, translate( 0, 0, -0.7 ) );
	else if (level==2)
		model_transform5 = mult( model_transform5, translate( 0, 0, -0.7 ) );
	else
		model_transform8 = mult( model_transform8, translate( 0, 0, -0.7 ) );
	}
		
	if (xobj2)
		{
		if (level==1)
		model_transform3 = mult( model_transform3, translate( 0, 0, -0.7 ) );
	else if (level==2)
		model_transform6 = mult( model_transform6, translate( 0, 0, -0.7 ) );
	else
		model_transform9 = mult( model_transform9, translate( 0, 0, -0.7 ) );
	}
	if (xobj3)
		{
		if (level==1)
		model_transform4 = mult( model_transform4, translate( 0, 0, -0.7 ) );
	else if (level==2)
		model_transform7 = mult( model_transform7, translate( 0, 0, -0.7 ) );
	else
		model_transform10 = mult( model_transform10, translate( 0, 0, -0.7 ) );
	}
	} );			
	shortcut.add( "a",     function() { model_transform = mult( model_transform, translate( -.7, 0, 0 ) ); 
	if (xobj1)
	{
		if (level==1)
		model_transform2 = mult( model_transform2, translate( -0.7, 0, 0 ) );
	else if (level==2)
		model_transform5 = mult( model_transform5, translate( -0.7, 0, 0 ) );
	else
		model_transform8 = mult( model_transform8, translate( -0.7, 0, 0 ) );
	}
		
	if (xobj2)
		{
		if (level==1)
		model_transform3 = mult( model_transform3, translate( -0.7, 0, 0 ) );
	else if (level==2)
		model_transform6 = mult( model_transform6, translate( -0.7, 0, 0 ) );
	else
	model_transform9 = mult( model_transform9, translate( -0.7, 0, 0 ) );
	}
	if (xobj3)
		{
		if (level==1)
		model_transform4 = mult( model_transform4, translate( -0.7, 0, 0 ) );
	else if (level==2)
		model_transform7 = mult( model_transform7, translate( -0.7, 0, 0 ) );
	else
	model_transform10 = mult( model_transform10, translate( -0.7, 0, 0 ) );
	}
	} );
	shortcut.add( "f",     function() { looking = !looking; } ); 
	 shortcut.add( "g",     function() { camerar=!camerar;} );
	  //shortcut.add( "r",     function() { bcamera=!bcamera;} );
	shortcut.add( "space",     function() { start = true; animate=true;} );
	// shortcut.add( ",",     ( function(self) { return function() { self.camera_transform = mult( rotate( 3, 0, 0,  1 ), self.camera_transform ); }; } ) (this) ) ;
	// shortcut.add( ".",     ( function(self) { return function() { self.camera_transform = mult( rotate( 3, 0, 0, -1 ), self.camera_transform ); }; } ) (this) ) ;

	// shortcut.add( "r",     ( function(self) { return function() { self.camera_transform = mat4(); }; } ) (this) );
	// shortcut.add( "ALT+s", function() { solid = !solid;					gl.uniform1i( g_addrs.SOLID_loc, solid);	
																		// gl.uniform4fv( g_addrs.SOLID_COLOR_loc, vec4(Math.random(), Math.random(), Math.random(), 1) );	 } );
	// shortcut.add( "ALT+g", function() { gouraud = !gouraud;				gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);	} );
	// shortcut.add( "ALT+n", function() { color_normals = !color_normals;	gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);	} );
	// shortcut.add( "ALT+a", function() { animate = !animate; } );
	
	// shortcut.add( "p",     ( function(self) { return function() { self.m_axis.basis_selection++; console.log("Selected Basis: " + self.m_axis.basis_selection ); }; } ) (this) );
	// shortcut.add( "m",     ( function(self) { return function() { self.m_axis.basis_selection--; console.log("Selected Basis: " + self.m_axis.basis_selection ); }; } ) (this) );
	// return model_transform;

}
