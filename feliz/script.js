var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		hw = w / 2, // half-width
		hh = h / 2,
		
		opts = {
			strings: [ 'FELIZ', 'CUMPLEAÑOS', 'DARNEL'],
			charSize: 30,
			charSpacing: 35,
			lineHeight: 40,
			
			cx: w / 2,
			cy: h / 2,
			
			fireworkPrevPoints: 10,
			fireworkBaseLineWidth: 5,
			fireworkAddedLineWidth: 8,
			fireworkSpawnTime: 200,
			fireworkBaseReachTime: 30,
			fireworkAddedReachTime: 30,
			fireworkCircleBaseSize: 20,
			fireworkCircleAddedSize: 10,
			fireworkCircleBaseTime: 30,
			fireworkCircleAddedTime: 30,
			fireworkCircleFadeBaseTime: 10,
			fireworkCircleFadeAddedTime: 5,
			fireworkBaseShards: 5,
			fireworkAddedShards: 5,
			fireworkShardPrevPoints: 3,
			fireworkShardBaseVel: 4,
			fireworkShardAddedVel: 2,
			fireworkShardBaseSize: 3,
			fireworkShardAddedSize: 3,
			gravity: .1,
			upFlow: -.1,
			letterContemplatingWaitTime: 360,
			balloonSpawnTime: 20,
			balloonBaseInflateTime: 10,
			balloonAddedInflateTime: 10,
			balloonBaseSize: 20,
			balloonAddedSize: 20,
			balloonBaseVel: .4,
			balloonAddedVel: .4,
			balloonBaseRadian: -( Math.PI / 2 - .5 ),
			balloonAddedRadian: -1,
		},
		calc = {
			totalWidth: opts.charSpacing * Math.max( opts.strings[0].length, opts.strings[1].length )
		},
		
		Tau = Math.PI * 2,
		TauQuarter = Tau / 4,
		
		letters = [];

ctx.font = opts.charSize + 'px Verdana';

function Letter( char, x, y ){
	this.char = char;
	this.x = x;
	this.y = y;
	
	this.dx = -ctx.measureText( char ).width / 2;
	this.dy = +opts.charSize / 2;
	
	this.fireworkDy = this.y - hh;
	
	var hue = x / calc.totalWidth * 360;
	
	this.color = 'hsl(hue,80%,50%)'.replace( 'hue', hue );
	this.lightAlphaColor = 'hsla(hue,80%,light%,alp)'.replace( 'hue', hue );
	this.lightColor = 'hsl(hue,80%,light%)'.replace( 'hue', hue );
	this.alphaColor = 'hsla(hue,80%,50%,alp)'.replace( 'hue', hue );
	
	this.reset();
}
Letter.prototype.reset = function(){
	
	this.phase = 'firework';
	this.tick = 0;
	this.spawned = false;
	this.spawningTime = opts.fireworkSpawnTime * Math.random() |0;
	this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() |0;
	this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
	this.prevPoints = [ [ 0, hh, 0 ] ];
}
Letter.prototype.step = function(){
	
	if( this.phase === 'firework' ){
		
		if( !this.spawned ){
			
			++this.tick;
			if( this.tick >= this.spawningTime ){
				
				this.tick = 0;
				this.spawned = true;
			}
			
		} else {
			
			++this.tick;
			
			var linearProportion = this.tick / this.reachTime,
					armonicProportion = Math.sin( linearProportion * TauQuarter ),
					
					x = linearProportion * this.x,
					y = hh + armonicProportion * this.fireworkDy;
			
			if( this.prevPoints.length > opts.fireworkPrevPoints )
				this.prevPoints.shift();
			
			this.prevPoints.push( [ x, y, linearProportion * this.lineWidth ] );
			
			var lineWidthProportion = 1 / ( this.prevPoints.length - 1 );
			
			for( var i = 1; i < this.prevPoints.length; ++i ){
				
				var point = this.prevPoints[ i ],
						point2 = this.prevPoints[ i - 1 ];
					
				ctx.strokeStyle = this.alphaColor.replace( 'alp', i / this.prevPoints.length );
				ctx.lineWidth = point[ 2 ] * lineWidthProportion * i;
				ctx.beginPath();
				ctx.moveTo( point[ 0 ], point[ 1 ] );
				ctx.lineTo( point2[ 0 ], point2[ 1 ] );
				ctx.stroke();
			
			}
			
			if( this.tick >= this.reachTime ){
				
				this.phase = 'contemplate';
				
				this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
				this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() |0;
				this.circleCreating = true;
				this.circleFading = false;
				
				this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() |0;
				this.tick = 0;
				this.tick2 = 0;
				
				this.shards = [];
				
				var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() |0,
						angle = Tau / shardCount,
						cos = Math.cos( angle ),
						sin = Math.sin( angle ),
						
						x = 1,
						y = 0;
				
				for( var i = 0; i < shardCount; ++i ){
					var x1 = x;
					x = x * cos - y * sin;
					y = y * cos + x1 * sin;
					
					this.shards.push( new Shard( this.x, this.y, x, y, this.alphaColor ) );
				}
			}
			
		}
	} else if( this.phase === 'contemplate' ){
		
		++this.tick;
		
		if( this.circleCreating ){
			
			++this.tick2;
			var proportion = this.tick2 / this.circleCompleteTime,
					armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;
			
			ctx.beginPath();
			ctx.fillStyle = this.lightAlphaColor.replace( 'light', 50 + 50 * proportion ).replace( 'alp', proportion );
			ctx.beginPath();
			ctx.arc( this.x, this.y, armonic * this.circleFinalSize, 0, Tau );
			ctx.fill();
			
			if( this.tick2 > this.circleCompleteTime ){
				this.tick2 = 0;
				this.circleCreating = false;
				this.circleFading = true;
			}
		} else if( this.circleFading ){
		
			ctx.fillStyle = this.lightColor.replace( 'light', 70 );
			ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
			
			++this.tick2;
			var proportion = this.tick2 / this.circleFadeTime,
					armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;
			
			ctx.beginPath();
			ctx.fillStyle = this.lightAlphaColor.replace( 'light', 100 ).replace( 'alp', 1 - armonic );
			ctx.arc( this.x, this.y, this.circleFinalSize, 0, Tau );
			ctx.fill();
			
			if( this.tick2 >= this.circleFadeTime )
				this.circleFading = false;
			
		} else {
			
			ctx.fillStyle = this.lightColor.replace( 'light', 70 );
			ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
		}
		
		for( var i = 0; i < this.shards.length; ++i ){
			
			this.shards[ i ].step();
			
			if( !this.shards[ i ].alive ){
				this.shards.splice( i, 1 );
				--i;
			}
		}
		
		if( this.tick > opts.letterContemplatingWaitTime ){
			
			this.phase = 'balloon';
			
			this.tick = 0;
			this.spawning = true;
			this.spawnTime = opts.balloonSpawnTime * Math.random() |0;
			this.inflating = false;
			this.inflateTime = opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random() |0;
			this.size = opts.balloonBaseSize + opts.balloonAddedSize * Math.random() |0;
			
			var rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
					vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
			
			this.vx = Math.cos( rad ) * vel;
			this.vy = Math.sin( rad ) * vel;
		}
	} else if( this.phase === 'balloon' ){
			
		ctx.strokeStyle = this.lightColor.replace( 'light', 80 );
		
		if( this.spawning ){
			
			++this.tick;
			ctx.fillStyle = this.lightColor.replace( 'light', 70 );
			ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
			
			if( this.tick >= this.spawnTime ){
				this.tick = 0;
				this.spawning = false;
				this.inflating = true;	
			}
		} else if( this.inflating ){
			
			++this.tick;
			
			var proportion = this.tick / this.inflateTime,
			    x = this.cx = this.x,
					y = this.cy = this.y - this.size * proportion;
			
			ctx.fillStyle = this.alphaColor.replace( 'alp', proportion );
			ctx.beginPath();
			generateBalloonPath( x, y, this.size * proportion );
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo( x, y );
			ctx.lineTo( x, this.y );
			ctx.stroke();
			
			ctx.fillStyle = this.lightColor.replace( 'light', 70 );
			ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
			
			if( this.tick >= this.inflateTime ){
				this.tick = 0;
				this.inflating = false;
			}
			
		} else {
			
			this.cx += this.vx;
			this.cy += this.vy += opts.upFlow;
			
			ctx.fillStyle = this.color;
			ctx.beginPath();
			generateBalloonPath( this.cx, this.cy, this.size );
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo( this.cx, this.cy );
			ctx.lineTo( this.cx, this.cy + this.size );
			ctx.stroke();
			
			ctx.fillStyle = this.lightColor.replace( 'light', 70 );
			ctx.fillText( this.char, this.cx + this.dx, this.cy + this.dy + this.size );
			
			if( this.cy + this.size < -hh || this.cx < -hw || this.cy > hw  )
				this.phase = 'done';
			
		}
	}
}
function Shard( x, y, vx, vy, color ){
	
	var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
	
	this.vx = vx * vel;
	this.vy = vy * vel;
	
	this.x = x;
	this.y = y;
	
	this.prevPoints = [ [ x, y ] ];
	this.color = color;
	
	this.alive = true;
	
	this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function(){
	
	this.x += this.vx;
	this.y += this.vy += opts.gravity;
	
	if( this.prevPoints.length > opts.fireworkShardPrevPoints )
		this.prevPoints.shift();
	
	this.prevPoints.push( [ this.x, this.y ] );
	
	var lineWidthProportion = this.size / this.prevPoints.length;
	
	for( var k = 0; k < this.prevPoints.length - 1; ++k ){
		
		var point = this.prevPoints[ k ],
				point2 = this.prevPoints[ k + 1 ];
		
		ctx.strokeStyle = this.color.replace( 'alp', k / this.prevPoints.length );
		ctx.lineWidth = k * lineWidthProportion;
		ctx.beginPath();
		ctx.moveTo( point[ 0 ], point[ 1 ] );
		ctx.lineTo( point2[ 0 ], point2[ 1 ] );
		ctx.stroke();
		
	}
	
	if( this.prevPoints[ 0 ][ 1 ] > hh )
		this.alive = false;
}
function generateBalloonPath( x, y, size ){
	
	ctx.moveTo( x, y );
	ctx.bezierCurveTo( x - size / 2, y - size / 2,
									 	 x - size / 4, y - size,
									   x,            y - size );
	ctx.bezierCurveTo( x + size / 4, y - size,
									   x + size / 2, y - size / 2,
									   x,            y );
}

function anim(){
	
	window.requestAnimationFrame( anim );
	
	ctx.fillStyle = '#111';
	ctx.fillRect( 0, 0, w, h );
	
	ctx.translate( hw, hh );
	
	var done = true;
	for( var l = 0; l < letters.length; ++l ){
		
		letters[ l ].step();
		if( letters[ l ].phase !== 'done' )
			done = false;
	}
	
	ctx.translate( -hw, -hh );
	
	if( done )
		for( var l = 0; l < letters.length; ++l )
			letters[ l ].reset();
}

for( var i = 0; i < opts.strings.length; ++i ){
	for( var j = 0; j < opts.strings[ i ].length; ++j ){
		letters.push( new Letter( opts.strings[ i ][ j ], 
														j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[ i ].length * opts.charSize / 2,
														i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2 ) );
	}
}

anim();

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	
	hw = w / 2;
	hh = h / 2;
	
	ctx.font = opts.charSize + 'px Verdana';
})

/* Mensaje en el body */
// Seleccionamos el body
const body = document.body;

// Creamos el elemento h1 dinámicamente
const mensaje = document.createElement('h1');
mensaje.classList.add('titulo');
mensaje.innerHTML = 'Aunque ya no estés conmigo... <br>yo sigo amandote.';

// Estilo básico para el mensaje
mensaje.style.position = 'absolute';
mensaje.style.top = '60%'; // Ajusta según sea necesario
mensaje.style.left = '50%';
mensaje.style.transform = 'translateX(-50%)';
//mensaje.style.color = 'blueviolet';
mensaje.style.textAlign = 'center';
mensaje.style.zIndex = '10'; // Asegura que esté sobre el canvas

// Añadimos el h1 al body
body.appendChild(mensaje);

// Creamos un elemento <style> para añadir los media queries
const style = document.createElement('style');
style.innerHTML = `
  h1 {
    margin: 0;
    padding: 0;
    font-size: 2em;
    line-height: 1.5;
    margin-bottom: 20px;
    font-family: 'Dancing Script', cursive;
    color: white; /* Texto blanco */
    text-shadow: 
      -1px -1px 0 rgba(0, 0, 0, 0.9),  
       1px -1px 0 rgba(0, 0, 0, 0.9),  
      -1px  1px 0 rgba(0, 0, 0, 0.9),  
       1px  1px 0 rgba(0, 0, 0, 0.9); /* Borde negro más oscuro */
  }

  

  /* Media Queries para tamaños de pantalla diferentes */
  @media screen and (max-width: 600px) {
    h1 {
      font-size: 1.5em;
    }
  }

  @media screen and (min-width: 601px) and (max-width: 1024px) {
    h1 {
      font-size: 1.8em;
    }
  }

  @media screen and (min-width: 1025px) {
    h1 {
      font-size: 2em;
    }
  }
`;

// Añadimos el elemento <style> al head
document.head.appendChild(style);

/* Imagen Foto*/
const foto = document.createElement('img');
foto.src = 'img/Juntos.jpg'; // Reemplaza por la ruta correcta de tu imagen
foto.alt = 'Foto juntos'; // Texto alternativo para la imagen
foto.style.position = 'absolute';
foto.style.top = '75%'; // Ajusta para colocarla justo debajo del h1
foto.style.left = '50%';
foto.style.transform = 'translateX(-50%)';
foto.style.width = '250px'; // Ajusta el tamaño de la imagen según sea necesario
foto.style.zIndex = '9'; // Ajusta el z-index si la imagen debe ir por debajo del texto

// bordes y sombra
foto.style.borderRadius = '17px';

foto.style.transition = 'transform 0.3s'; // Transición suave para efectos
foto.addEventListener('mouseover', () => {
  foto.style.transform = 'translateX(-50%) scale(1.1)'; // Aumentar la imagen un 10% al pasar el cursor
});
foto.addEventListener('mouseout', () => {
  foto.style.transform = 'translateX(-50%) scale(1)'; // Volver al tamaño original cuando el cursor sale
});

// Añadir la imagen al body
body.appendChild(foto);

/* Imagen Saturno */
const saturno = document.createElement('img');
saturno.src = 'img/Saturno.png'; // Ruta de la segunda imagen
saturno.alt = 'Saturno'; // Texto alternativo para la segunda imagen
saturno.style.position = 'absolute';
saturno.style.top = '15%'; // Ajusta la posición de la segunda imagen
saturno.style.left = '50%'; // Cambia ligeramente la posición horizontal
saturno.style.transform = 'translateX(5%)';
saturno.style.width = '200px'; // Puedes cambiar el tamaño si lo deseas
saturno.style.zIndex = '8'; // Ajusta el z-index para control de superposición

// Añadir la segunda imagen al body
document.body.appendChild(saturno);

/* Imagen Luna */
const luna = document.createElement('img');
luna.src = 'img/Luna.png'; // Ruta de la segunda imagen
luna.alt = 'Luna'; // Texto alternativo para la segunda imagen
luna.style.position = 'absolute';
luna.style.top = '1%'; // Ajusta la posición de la segunda imagen
luna.style.left = '50%'; // Cambia ligeramente la posición horizontal
luna.style.transform = 'translateX(-98%)';
luna.style.width = '200px'; // Puedes cambiar el tamaño si lo deseas
luna.style.zIndex = '8'; // Ajusta el z-index para control de superposición

// Añadir la segunda imagen al body
document.body.appendChild(luna);

/* Imagen jet'aime */
const JeTaime = document.createElement('img');
JeTaime.src = 'img/TeAmo.png'; // Ruta de la segunda imagen
JeTaime.alt = 'Te Amo'; // Texto alternativo para la segunda imagen
JeTaime.style.position = 'absolute';
JeTaime.style.top = '7%'; // Ajusta la posición de la segunda imagen
JeTaime.style.left = '50%'; // Cambia ligeramente la posición horizontal
JeTaime.style.transform = 'translateX(-112%)';
JeTaime.style.width = '200px'; // Puedes cambiar el tamaño si lo deseas
JeTaime.style.zIndex = '8'; // Ajusta el z-index para control de superposición

// Añadir la segunda imagen al body
document.body.appendChild(JeTaime);

/* Imagen Galaxia */
const galaxia = document.createElement('img');
galaxia.src = 'img/Galaxia1.png'; // Ruta de la segunda imagen
galaxia.alt = 'Galaxia'; // Texto alternativo para la segunda imagen
galaxia.style.position = 'absolute';
galaxia.style.top = '-5%'; // Ajusta la posición de la segunda imagen
galaxia.style.left = '50%'; // Cambia ligeramente la posición horizontal
galaxia.style.transform = 'translateX(5%)';
galaxia.style.width = '200px'; // Puedes cambiar el tamaño si lo deseas
galaxia.style.zIndex = '8'; // Ajusta el z-index para control de superposición

// Añadir la segunda imagen al body
document.body.appendChild(galaxia);

/* Imagen DyA */
const DyA = document.createElement('img');
DyA.src = 'img/DyA_png.png'; // Ruta de la segunda imagen
DyA.alt = 'D y A'; // Texto alternativo para la segunda imagen
DyA.style.position = 'absolute';
DyA.style.top = '23%'; // Ajusta la posición de la segunda imagen
DyA.style.left = '30%'; // Colocar la imagen en el centro
DyA.style.transform = 'translateX(-50%)'; // Ajustar la posición relativa para centrar
DyA.style.width = '250px'; // Puedes cambiar el tamaño si lo deseas
DyA.style.zIndex = '8'; // Ajusta el z-index para control de superposición

// Añadir la segunda imagen al body
document.body.appendChild(DyA);


/* Estrellas */
/* Estrella 1 */
const e1 = document.createElement('img');
e1.src = 'img/Estrellas.png'; // Ruta de la segunda imagen
e1.alt = 'Estrella'; // Texto alternativo para la segunda imagen
e1.style.position = 'absolute';
e1.style.top = '30%'; // Ajusta la posición de la segunda imagen
e1.style.left = '55%'; // Cambia ligeramente la posición horizontal
e1.style.transform = 'translateX(5%)';
e1.style.width = '100px'; // Puedes cambiar el tamaño si lo deseas
e1.style.zIndex = '8'; // Ajusta el z-index para control de superposición

// Añadir la segunda imagen al body
document.body.appendChild(e1);