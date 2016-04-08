// *******************************************************
// CS 174a Graphics Example Code
// GL_Context - This class performs all the setup of doing graphics.   It informs OpenGL of which functions to call during events - such as a key getting pressed or it being time to redraw.  
// It also displays any strings requested, and the key controls. 

// *******************************************************
// IMPORTANT -- In the line below, add the filenames of any new images you want to include for textures!

var texture_filenames_to_load = [ "pika.png","winner","bbbb2.png","bbbb.png","ssss.png","GG.png","ddg.png","hkl.png","mwc.png","sjg.png","mwh.png","phl.png", "ball.png", "ball.png" ,"text.png","jieni.png","miao.png","long.png","earth.tga"];

// *******************************************************
// IMPORTANT -- Any new shader variables you define need to have a line added to class Graphics_Addresses below, so their addresses can be retrieved.
		
window.requestAnimFrame = (function() {						// Get system time from requestAnimationFrame, and map in the correct compatible version of it
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
         function( callback, element) { window.setTimeout(callback, 1000/60);  };
})();


function GL_Context( canvas_id )
	{																// Special WebGL-only Initialization
		canvas = document.getElementById( "gl-canvas" ),   	canvas_size = 	 [ canvas.width, canvas.height ];
		if (!window.WebGLRenderingContext) { alert( "http://get.webgl.org to get a compatible browser " );	}
		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		for (var ii = 0; ii < names.length; ++ii) {
			gl = canvas.getContext(names[ii]);
			if (gl) break;	}
		if ( !gl && canvas.parentNode ) ;//	canvas.parentNode.innerHTML = 'Computer won't run WebGL - http://get.webgl.org/troubleshooting/ for help';
		
		for( var i = 0; i < texture_filenames_to_load.length; i++ )
			initTexture( texture_filenames_to_load[i], true );
		
		var program = initShaders( gl, "vertex-shader", "fragment-shader" );											// Load shader from HTML elements
		gl.useProgram( program );
		
		gl.viewport( 0, 0, canvas.width, canvas.height );
		gl.enable(gl.DEPTH_TEST);
		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
			
		this.displayObjects = [];
		this.debug_screen = new Debug_Screen();
		this.register_display_object( this.debug_screen );
		
		function Graphics_Addresses( program )		// Find out the memory addresses internal to the graphics card of each of its variables, and store them here locally for the Javascript to use
		{	
			this.vPosition = gl.getAttribLocation( program, "vPosition");			gl.enableVertexAttribArray( this.vPosition );
			this.vNormal = gl.getAttribLocation( program, "vNormal");				gl.enableVertexAttribArray( this.vNormal );
			this.vTexCoord = gl.getAttribLocation( program, "vTexCoord" );

			this.camera_transform_loc 					= gl.getUniformLocation( program, "camera_transform" );
			this.camera_model_transform_loc 			= gl.getUniformLocation( program, "camera_model_transform" );
			this.projection_camera_model_transform_loc 	= gl.getUniformLocation( program, "projection_camera_model_transform" );
			this.camera_model_transform_normal_loc 		= gl.getUniformLocation( program, "camera_model_transform_normal" );

			this.color_loc 			= gl.getUniformLocation(program, "color" );				this.lightColor_loc 	= gl.getUniformLocation(program, "lightColor" );
			this.ambient_loc 		= gl.getUniformLocation(program, "ambient" );			this.diffuse_loc 		= gl.getUniformLocation(program, "chalkiness");
			this.specular_loc 		= gl.getUniformLocation(program, "shininess" );			this.shininess_loc 		= gl.getUniformLocation(program, "smoothness" );
			
			this.lightPosition_loc 	= gl.getUniformLocation(program, "lightPosition");		this.COLOR_NORMALS_loc 	= gl.getUniformLocation(program, "COLOR_NORMALS");
			this.GOURAUD_loc 		= gl.getUniformLocation(program, "GOURAUD");			this.SOLID_loc 			= gl.getUniformLocation(program, "SOLID");
			this.SOLID_COLOR_loc 	= gl.getUniformLocation(program, "SOLID_COLOR");		this.USE_TEXTURE_loc 	= gl.getUniformLocation(program, "USE_TEXTURE");
		}
		g_addrs = new Graphics_Addresses( program );	
	}

	GL_Context.prototype.register_display_object = function( object ) { this.displayObjects.unshift(object);  object.init_keys(); }
	GL_Context.prototype.render = function( time )
	{ 	
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		for( var i = 0; i < this.displayObjects.length; i++ )
		{
			this.displayObjects[ i ].display( time );
			this.displayObjects[ i ].update_strings( this.debug_screen );
		}
		window.requestAnimFrame( this.render.bind( this ) );			// Now that this frame is drawn, request that it happen again as soon as all other OpenGL events are processed.
	};

// *******************************************************
// Debug_Screen - Displays the text of the user interface
function Debug_Screen()	
{	this.string_map = { };	this.m_text = new text_line( 20 ); 		this.start_index = 0;	this.tick = 0;
}

	Debug_Screen.prototype.display = function(time)
	{
			gl.uniform4fv( g_addrs.color_loc, 			vec4( 0.8,0.8,0.8,1 ) );
			var m_sphere = new sphere( mat4(), 4 );
			var model_transform = mat4();
			model_transform = mult( model_transform, rotate( -90, vec3( 0, 1, 0 ) ) );
			model_transform = mult( model_transform, translate( -15, -6, 10 ) );
			model_transform = mult( model_transform, scale( .5, .5, .5) );
			
			var strings = Object.keys( this.string_map );
			
			for( var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++, idx = (idx + 1) % strings.length )
			{
				this.m_text.set_string( this.string_map[ strings[idx] ] );
				this.m_text.draw( model_transform, mat4(), perspective(45, canvas.width/canvas.height, .1, 100), true );		// Comment this out to not display any strings on the UI			
				model_transform = mult( model_transform, translate( 0, 1, 0 ) );
			} 
			
			model_transform = mat4();
			model_transform = mult( model_transform, rotate( -90, vec3( 0, 1, 0 ) ) );
			model_transform = mult( model_transform, translate( -.1, .04, -.05 ) );
			model_transform = mult( model_transform, scale( .0001, .003, .003) );
			// this.m_text.set_string( "Controls:" );
			// this.m_text.draw( model_transform, mat4(), perspective(45, canvas.width/canvas.height, .1, 100), true );
			// model_transform = mult( model_transform, translate( 0, -1, 0 ) );
			
			// var key_combinations = Object.keys( shortcut.all_shortcuts );
			// for( var i = 0; i < key_combinations.length; i++ )
			// {
				// this.m_text.set_string( key_combinations[i] );
				// this.m_text.draw( model_transform, mat4(), perspective(45, canvas.width/canvas.height, .1, 100), true );		// Comment this out to not list out any controls on the UI
				// model_transform = mult( model_transform, translate( 0, -1, 0 ) );				
			// }
	}

	Debug_Screen.prototype.init_keys = function() 
	{	
		//shortcut.add( "2",     ( function(self) { return function() { self.start_index = ( self.start_index + 1) % Object.keys( self.string_map ).length; };  } ) (this) );	
		//shortcut.add( "1",     ( function(self) { return function() { self.start_index = ( self.start_index - 1  + Object.keys( self.string_map ).length ) % Object.keys( self.string_map ).length; };  } ) (this) );	
	};

	Debug_Screen.prototype.update_strings = function( debug_screen_object ) 			// Strings this particular class contributes to the UI
	{
		debug_screen_object.string_map["tick"] = "Frame: " + this.tick++;
	//	debug_screen_object.string_map["start_index"] = "start_index: " + this.start_index;
	}
