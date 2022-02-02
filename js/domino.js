//-------------------------
//TODO
//
// - place object with mouse
// - save/load from server

//-------------------------------------------------------
//Domino
//-------------------------------------------------------
class Domino {
	constructor(_base,_id,_x,_y,_z, _angle,_colorFace1,_colorFace2,_colorSide) {
 
			this.id=_id
			this.x=_x;
			this.y=_y;
			this.z=_z;
			this.angle=_angle;
			this.colorFace1=_colorFace1;
			this.colorFace2=_colorFace2;
			this.colorSide=_colorSide;
			
 
				_base.textureFace.repeat.set(1, 1)
				_base.textureSide.repeat.set(1, 1)
				//textureCube.texture.left.repeat.set(1, 1)
				//textureCube.texture.right.repeat.set(1, 1)
				
				
				//  const material = new THREE.MeshLambertMaterial({ map: this.textureWood,  transparent: true,      opacity: 1,    color: 0xffffff })
				
			const cubeMaterials = [
				new THREE.MeshLambertMaterial({ map: _base.textureFace }), //right side
				new THREE.MeshLambertMaterial({ map: _base.textureFace}), //left side
				new THREE.MeshLambertMaterial({ map:  _base.textureSide}), //top side
				new THREE.MeshLambertMaterial({ map:  _base.textureSide}), //bottom side
				new THREE.MeshLambertMaterial({ map:  _base.textureSide}), //front side
				new THREE.MeshLambertMaterial({ map:  _base.textureSide}), //back side
			];
	
 
			//var textureCube =new THREE.CubeTexture([_base.textureFace, _base.textureFace, _base.textureSide, _base.textureSide, _base.textureSide, _base.textureSide]);
			//var textureCube = THREE.misc.textureCube([_base.textureFace, _base.textureFace, _base.textureSide, _base.textureSide, _base.textureSide, _base.textureSide])
			//var textureCube = THREE.misc.textureCube([_base.textureFace, _base.textureFace, _base.textureSide, _base.textureSide, _base.textureSide, _base.textureSide])
			/*
				textureCube.texture.front.repeat.set(1, 1)
				textureCube.texture.back.repeat.set(1, 1)
				textureCube.texture.left.repeat.set(1, 1)
				textureCube.texture.right.repeat.set(1, 1)
			*/	
			
			if(_colorFace2==undefined)
				_colorFace2=_colorFace1
			if(_colorSide==undefined)
				_colorSide=_colorFace1
				
			
			var r1=((_colorFace1 >> 16) & 255)/255
			var g1=((_colorFace1 >> 8) & 255)/255
			var b1= (_colorFace1 & 255)/255
			
			var r2=((_colorFace2 >> 16) & 255)/255
			var g2=((_colorFace2 >> 8) & 255)/255
			var b2= (_colorFace2 & 255)/255
			
			var r3=((_colorSide >> 16) & 255)/255
			var g3=((_colorSide >> 8) & 255)/255
			var b3= (_colorSide & 255)/255
			
			//console.log('---'+bigint+"="+r+","+g+","+b)
			//console.log('---'+_colorFace2)
		
			
			cubeMaterials[0].name='Face1'
			cubeMaterials[0].color.r=r1
			cubeMaterials[0].color.g=g1
			cubeMaterials[0].color.b=b1

			cubeMaterials[1].name='Face2'
			cubeMaterials[1].color.r=r2
			cubeMaterials[1].color.g=g2
			cubeMaterials[1].color.b=b2
			
			for (let i = 2; i < 6; i++) 
			{
				cubeMaterials[i].name='Side'+i
				cubeMaterials[i].color.r=r3
				cubeMaterials[i].color.g=g3
				cubeMaterials[i].color.b=b3
			}
			
			//----------------------------------
			//this.box = _base.add.box({ x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { lambert: { color: _colorFace1 } })
			//this.box = _base.add.box({ x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { custom: textureCube.materials } )
			this.box = _base.add.box({ name:'dom_'+_id,x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { custom: cubeMaterials } )
			this.box.rotation.set(0, _angle, 0)
			_base.physics.add.existing(this.box)
			
			
			this.box.body.on.collision((otherObject, event) => {
				if(this.hurt==false)
				{
					if ((otherObject.name !== 'ground') && (otherObject.name !== 'Bridge') )
					{
						//console.log('dom_'+ this.id+' and '+otherObject.name+': '+event)
						this.hurt=true
						if(_base.sound==true)
							_base.audio.play();
					}
					
				}
				
			})
			
		  
	  
			//return box1
			
  }
	launch()
	{
		this.hurt=false;
	}
	destroy(_base)
	{
		_base.destroy(this.box);
	}
	toJson() {
		return JSON.stringify({
			id: this.id,
			x: this.x,
			y: this.y,
			z: this.z,
			angle: this.angle,
			colorFace1: this.colorFace1,
			colorFace2: this.colorFace2,
			colorSide: this.colorSide
		});
	}

	static fromJson (_base,_json)
	{
		//console.log(_json)
		var data = JSON.parse(_json); // Parsing the json string.
		return new Domino(_base,data.id,data.x, data.y, data.z, data.angle, data.colorFace1, data.colorFace2, data.colorFace3);
	}
}
//-------------------------------------------------------
//Ball
//-------------------------------------------------------
class Ball {
	constructor(_base,_x, _y, _z){
		
		this.x=_x;
		this.y=_y;
		this.z=_z;
			
		_y=_y+6.5
		const nbTorus=12
		
		//feet
		this.f1=_base.physics.add.box({mass: 0, x:_x+((nbTorus-0)*0.4), y: _y/2,z:_z-2, height: _y,width: 0.5, depth: 0.5  }, 
		{ lambert: { color: 'GoldenRod' } })
		this.f2=_base.physics.add.box({mass: 0, x:_x+((nbTorus-0)*0.4), y: _y,z:_z-1.25, height: 0.5,width: 0.5, depth: 2  }, 
		{ lambert: { color: 'GoldenRod' } })
		
		

		this.CstFeet=_base.physics.add.constraints.lock(this.f1.body, this.f2.body)
		
		this.listTorus=[];
		
		for (let i = 2; i <= nbTorus; i++) 
		{
			// chain
			let t2 = _base.add.torus(
				{ x: i * 0.4 + _x, y: _y, z: _z,tubularSegments: 16, tube: 0.05, radius: 0.25 },
				{ standard: { emissive: 0x888888, roughness: 0.4, metalness: 1 } }
			)
			if (i % 2 == 0) 
				t2.rotateX(Math.PI / 2)
			_base.physics.add.existing(t2, { mass: i === nbTorus ? 0 : 1 })
				
			this.listTorus.push(t2)
			// ball
			if (i === 2) 
			{
				this.ball = _base.physics.add.sphere(
					{ name: 'Ball',mass: 2, radius: 0.4, x: + _x+0.2, y: _y,z: _z },
					{ standard: { emissive: 0x222222, roughness: 0.4, metalness: 1 } }
					)
				this.CstBall=_base.physics.add.constraints.lock(this.ball.body,t2.body)
				
				this.starer=_base.physics.add.box({mass:300, x: + _x+2, y: 2.5,z: _z, height: 5,width:1, depth: 1  }, 
				{ lambert: { color: 'GoldenRod' } })
				this.cst=_base.physics.add.constraints.lock(this.starer.body, this.ball.body)
				this.starer.visible = false
			}
			
		}
		
	}
	launch(){
		console.log('Launch!!!')
		//this.starer.body.physics.constraints.physicsWorld.removeConstraints()
		//this.third.physics.destroy(this.starer)
		this.starer.body.physics.constraints.physicsWorld.removeConstraint(this.cst)
		this.cst=null
		this.starer.body.setCollisionFlags(6)
		//this.starer.visible = false
		//this.starer.active = false
		//this.third.destroy(this.starer)
		//this.starer=null
	}
	destroy(_base)
	{
		this.ball.body.physics.constraints.physicsWorld.removeConstraint(this.CstBall)
		if(this.cst!=null)
			this.starer.body.physics.constraints.physicsWorld.removeConstraint(this.cst)
		_base.destroy(this.ball);
		this.f1.body.physics.constraints.physicsWorld.removeConstraint(this.CstFeet)
		
		
		_base.destroy(this.f1);
		_base.destroy(this.f2);
		while(this.listTorus.length > 0) {
				const o=this.listTorus.pop();
				_base.destroy(o);
			}
		_base.destroy(this.starer);	
		
	}
	toJson() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z
			
		});
	}

	static fromJson (_base,_json)
	{
		//console.log(_json)
		var data = JSON.parse(_json); // Parsing the json string.
		return new Ball(_base,data.x, data.y, data.z);
	}
}
//-------------------------------------------------------
//Rotator
//-------------------------------------------------------
class Rotator {
	constructor(_base,_x, _y, _z){
		
		this.x=_x;
		this.y=_y;
		this.z=_z;
			/*
			let feet = this.add.box({ x:x_origin, y: _y+0.75,z:_z, height:1.5,width: 0.5, depth: 0.5  }, 
				{ lambert: { color: 'GoldenRod' } })
				*/
			this.feetcyl = _base.physics.add.cylinder({
				mass: 100,
              x: _x,
              y: _y+0.75,
              z: _z,
              radiusTop: 0.5,
              radiusBottom: 0.5,
               height: 1.5
			   },{ lambert: { color: 'GoldenRod' } })
				
				
			this.arm = _base.physics.add.box({name: 'Rotator', mass: 2,x:_x, y: _y+1.75,z:_z, height:0.5,width: 0.5, depth: 14  }, 
				{ lambert: { color: 'GoldenRod' } })
			
			
			
			this.cyl = _base.physics.add.cylinder({
				mass: 0,
              x: _x,
              y: _y+2,
              z: _z,
              radiusTop: 0.15,
              radiusBottom: 0.15,
              height: 0.5
            })
			this.cyl.body.setCollisionFlags(6)
			//cyl.rotation.set( Math.PI/2,0, Math.PI/2)
			//_base.physics.add.existing(cyl)
			
			
			//_base.physics.add.existing(this.feetcyl, { mass: 100 })
			//_base.physics.add.existing(arm, { mass: 2 })
			//this.physics.add.constraints.fixed(feet.body, arm.body)
			
			this.cst=_base.physics.add.constraints.hinge(this.feetcyl.body, this.arm.body, {
				pivotA: { x: 0, y: 1.0, z: 0 },
				axisA: { y: 1 },
				})
		
	}
	
	destroy(_base)
	{
		this.feetcyl.body.physics.constraints.physicsWorld.removeConstraint(this.cst)
		_base.destroy(this.cyl);
		_base.destroy(this.feetcyl);
		_base.destroy(this.arm);
	}
	toJson() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z
			
		});
	}

	static fromJson (_base,_json)
	{
		//console.log(_json)
		var data = JSON.parse(_json); // Parsing the json string.
		return new Rotator(_base,data.x, data.y, data.z);
	}
}
//-------------------------------------------------------
//Bar
//-------------------------------------------------------
class Bar {
	constructor(_base,_x, _y, _z,_angle,_color,_size){
		
		this.x=_x;
		this.y=_y;
		this.z=_z;
		this.angle=_angle;
		this.size=_size;
		this.color=_color;
		
		this.box1 = _base.add.box({name: 'Bar', x: _x, y: _y,z:_z,height: 2,width: 0.4, depth: _size  }, { lambert: { color: _color } })
		this.box1.rotation.set(0, _angle, 0)
		this.box=_base.physics.add.existing(this.box1)
		
		
		
	}
	
	destroy(_base)
	{
		_base.destroy(this.box1);
	}
	toJson() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z,
			angle: this.angle,
			size: this.size,
			color: this.color
			
		});
	}

	static fromJson (_base,_json)
	{
		//console.log(_json)
		var data = JSON.parse(_json); // Parsing the json string.
		return new Bar(_base,data.x, data.y, data.z, data.angle,  data.color, data.size);
	}
}
//-------------------------------------------------------
//Bridge
//-------------------------------------------------------
class Bridge{
	constructor(_base,_x,_y,_z){
		
		//console.log('create bridge,'+_x+','+_y+','+_z)
		this.x=_x;
		this.y=_y;
		this.z=_z;
		
		  // get the shape from the sve file
          //const svg = this.cache.html.get('bridge')
		  
		  
		  //const svg = this.load.file('bridge')
		  //console.log('svg')
		  //console.log(this.bridgeSVG)
		  
		  
          const bridgeShape = _base.transform.fromSVGtoShape(_base.bridgeSVG)
			//console.log('bridgeShape')
		  //console.log(bridgeShape)
		  
          // set scaling variable
          const scale = 20//25
		  
          // extrude the shape to a 3d object
          this.bridge = _base.add.extrude({
			name: 'Bridge',
            shape: bridgeShape[0],
            depth: 120,
			 //amount : 500,
			bevelEnabled: false,
            bevelSize: 2,
            bevelThickness: 2
          },{ lambert: { color: 'DarkKhaki' }} )

          // scale the shape
          this.bridge.scale.set(1 / -scale, 1 / -scale, 1 / scale)

          // add the desired shape (in this case, concave, which is always static)
          this.bridge.shape = 'concave'
		  
	
          // offset the position by the half of the shape's size
          this.bridge.position.setY(this.bridge.geometry.boundingBox.max.y / scale+ _y)
		  this.bridge.position.setX(_x)
		  this.bridge.position.setZ(_z)

          // add a physics body
          _base.physics.add.existing(this.bridge)

          // set some body properties
          this.bridge.body.setAngularFactor(0, 0, 0)
          this.bridge.body.setLinearFactor(0, 0, 0)
		  
		  this.bridge.body.setFriction(0.2)
		}
		destroy(_base)
	{
		_base.destroy(this.bridge);
	}
	toJson() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z,
		});
	}

	static fromJson (_base,_json)
	{
		//console.log(_json)
		var data = JSON.parse(_json); // Parsing the json string.
		return new Bridge(_base,data.x, data.y, data.z);
	}
}
//-------------------------------------------------------
//Balancator
//-------------------------------------------------------
class Balancator{
	constructor(_base,_x,_y,_z){
			this.x=_x;
			this.y=_y;
			this.z=_z;
		
			_y=_y+2.5
			this.box1 = _base.add.box({ x: _x+1, y: _y+0,z:_z+1.1,height: 5,width: 0.4, depth: 0.4  }, { lambert: { color: 'GoldenRod' } })
			this.box1.rotation.set(0, -Math.PI/2, Math.PI/8)
			_base.physics.add.existing(this.box1)
			  // set some body properties
			this.box1.body.setAngularFactor(0, 0, 0)
			this.box1.body.setLinearFactor(0, 0, 0)
		
			this.box2 = _base.add.box({ x: _x+1, y: _y+0,z:_z-1.1,height: 5,width: 0.4, depth: 0.4  }, { lambert: { color: 'GoldenRod' } })
			this.box2.rotation.set(0, Math.PI/2, Math.PI/8)
			_base.physics.add.existing(this.box2)
			//_base.physics.add.constraints.lock (box1.body, box2.body)
			
			this.box2.body.setAngularFactor(0, 0, 0)
			this.box2.body.setLinearFactor(0, 0, 0)
			
			this.box3 = _base.add.box({ x: _x-1, y: _y+0,z:_z+1.1,height: 5,width: 0.4, depth: 0.4  }, { lambert: { color: 'GoldenRod' } })
			this.box3.rotation.set(0, -Math.PI/2, Math.PI/8)
			_base.physics.add.existing(this.box3)
			this.box3.body.setAngularFactor(0, 0, 0)
			this.box3.body.setLinearFactor(0, 0, 0)
		
			this.box4 = _base.add.box({ x: _x-1, y: _y+0,z:_z-1.1,height: 5,width: 0.4, depth: 0.4  }, { lambert: { color: 'GoldenRod' } })
			this.box4.rotation.set(0, Math.PI/2, Math.PI/8)
			_base.physics.add.existing(this.box4)
			this.box4.body.setAngularFactor(0, 0, 0)
			this.box4.body.setLinearFactor(0, 0, 0)
			
			
			//_base.physics.add.constraints.lock (box3.body, box4.body)
			
			this.cyl = _base.add.cylinder({
              x: _x,
              y: _y+2.4,
              z: _z,
              radiusTop: 0.1,
              radiusBottom: 0.1,
              height: 2.4
            })
			this.cyl.rotation.set( Math.PI/2,0, Math.PI/2)
			_base.physics.add.existing(this.cyl)
			//_base.physics.add.constraints.fixed (box1.body, cyl.body)
			//_base.physics.add.constraints.fixed (box3.body, cyl.body)
			this.cyl.body.setAngularFactor(0, 0, 0)
			this.cyl.body.setLinearFactor(0, 0, 0)
			
			
			this.box5 = _base.add.box({ name: 'Balancator A', x: _x, y: _y+1,z:_z+0.6,height: 3,width: 0.1, depth: 0.4  }, { lambert: { color: 'LightGreen' } })
			this.box5.rotation.set(0, -Math.PI/2, Math.PI/8)
			_base.physics.add.existing(this.box5)
		
			this.box6 = _base.add.box({ name: 'Balancator B',x: _x, y: _y+1,z:_z-0.6,height: 3,width: 0.1, depth: 0.4  }, { lambert: { color: 'LightGreen' } })
			this.box6.rotation.set(0, Math.PI/2, Math.PI/8)
			_base.physics.add.existing(this.box6)
			this.cst1=_base.physics.add.constraints.lock(this.box5.body, this.box6.body)
			
			this.cst2=_base.physics.add.constraints.lock(this.box5.body, this.cyl.body)
			
			this.cst3=_base. physics.add.constraints.hinge(this.box5.body, this.cyl.body, {
				pivotA: { x: 0, y: 1.5, z: 0 },
				axisA: { z: 1 },
				})
	}
	destroy(_base)
	{
		_base.destroy(this.box1);
		_base.destroy(this.box2);
		_base.destroy(this.box3);
		_base.destroy(this.box4);
		this.box5.body.physics.constraints.physicsWorld.removeConstraint(this.cst1)
		this.box5.body.physics.constraints.physicsWorld.removeConstraint(this.cst2)
		this.box5.body.physics.constraints.physicsWorld.removeConstraint(this.cst3)
		_base.destroy(this.box5);
		_base.destroy(this.box6);
		_base.destroy(this.cyl);
		
	}
	toJson() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z,
		});
	}

	static fromJson (_base,_json)
	{
		//console.log(_json)
		var data = JSON.parse(_json); // Parsing the json string.
		return new Balancator(_base,data.x, data.y, data.z);
	}
}

//-------------------------------------------------------
//DominoScene
//-------------------------------------------------------
class DominoScene{
	constructor(_base)
	{
		this.base= _base
		this.listDomino=[];
		this.listBall=[];
		this.listRotator=[];
		this.listBar=[];
		this.listBridge=[];
		this.listBalancator=[];
		
		this.listDominoBackup=[];
		this.listBallBackup=[];
		this.listRotatorBackup=[];
		this.listBarBackup=[];
		this.listBridgeBackup=[];
		this.listBalancatorBackup=[];
	}
	
	backup(){
		//empty backup
			while(this.listDominoBackup.length > 0) {
				this.listDominoBackup.pop();
			}
			while(this.listBallBackup.length > 0) {
				this.listBallBackup.pop();
			}
			while(this.listRotatorBackup.length > 0) {
				this.listRotatorBackup.pop();
			}
			while(this.listBarBackup.length > 0) {
				this.listBarBackup.pop();
			}
			while(this.listBridgeBackup.length > 0) {
				this.listBridgeBackup.pop();
			}
			while(this.listBalancatorBackup.length > 0) {
				this.listBalancatorBackup.pop();
			}
			
			//Backup
			for (const o of this.listDomino) {
				this.listDominoBackup.push(o.toJson())
			}
			for (const o of this.listBall) {
				this.listBallBackup.push(o.toJson())
			}
			for (const o of this.listRotator) {
				this.listRotatorBackup.push(o.toJson())
			}
			for (const o of this.listBar) {
				this.listBarBackup.push(o.toJson())
			}
			for (const o of this.listBridge) {
				this.listBridgeBackup.push(o.toJson())
			}
			for (const o of this.listBalancator) {
				this.listBalancatorBackup.push(o.toJson())
			}
	}
	launch(){
		//Launch balls
		for (const o of this.listBall) {
			o.launch()
		}
		
		for (const o of this.listDomino) {
			o.launch()
		}
		
	}
	
	destroy(){
		//console.log('---------------destroy');
		
		for (const o of this.listDomino) {
			o.destroy(this.base)
		}
		for (const o of this.listBall) {
			o.destroy(this.base)
		}
		for (const o of this.listRotator) {
			o.destroy(this.base)
		}
		for (const o of this.listBar) {
			o.destroy(this.base)
		}
		for (const o of this.listBridge) {
			o.destroy(this.base)
		}
		for (const o of this.listBalancator) {
			o.destroy(this.base)
		}
		//console.log('---------------destroy Done');
		while(this.listDomino.length > 0) {
			this.listDomino.pop();
		}
		while(this.listBall.length > 0) {
			this.listBall.pop();
		}
		while(this.listRotator.length > 0) {
			this.listRotator.pop();
		}
		while(this.listBar.length > 0) {
			this.listBar.pop();
		}
		while(this.listBridge.length > 0) {
			this.listBridge.pop();
		}
		while(this.listBalancator.length > 0) {
			this.listBalancator.pop();
		}
			
	}
	restore(){
		//console.log('---------------Restore');
		for (const serialize of this.listDominoBackup) {
			this.listDomino.push(Domino.fromJson(this.base, serialize))
		}
		for (const serialize of this.listBallBackup) {
			this.listBall.push(Ball.fromJson(this.base, serialize))
		}
		for (const serialize of this.listRotatorBackup) {
			this.listRotator.push(Rotator.fromJson(this.base, serialize))
		}
		for (const serialize of this.listBarBackup) {
			this.listBar.push(Bar.fromJson(this.base, serialize))
		}
		for (const serialize of this.listBridgeBackup) {
			this.listBridge.push(Bridge.fromJson(this.base, serialize))
		}
		for (const serialize of this.listBalancatorBackup) {
			this.listBalancator.push(Balancator.fromJson(this.base, serialize))
		}
	}
	save(name){
		this.backup()
		var f=JSON.stringify({
			name: name,
			domino: this.listDominoBackup,
			ball: this.listBallBackup,
			rotator: this.listRotatorBackup,
			bar: this.listBarBackup,
			bridge: this.listBridgeBackup,
			balancator: this.listBalancatorBackup
			})
			console.log(f)
	}
	load(_json){
			//console.log('load')
			var data = JSON.parse(_json); // Parsing the json string.
			//console.log(data)
			//console.log(data.name)
			this.listDominoBackup=data.domino
			this.listBallBackup=data.ball
			this.listRotatorBackup=data.rotator
			this.listBarBackup=data.bar
			this.listBridgeBackup=data.bridge
			this.listBalancatorBackup=data.balancator
			this.destroy()
			this.restore()
			return data.name
	}
		
		
	AddDomino(x,y,z, angle,colorFace1,colorFace2,colorSide) 
	{
		const o=new Domino(this.base,this.listDomino.length,x,y,z, angle,colorFace1,colorFace2,colorSide)
		this.listDomino.push(o);
		return o
	}
	AddBall(x, y,z)
	{
		this.listBall.push(new Ball(this.base,x, y,z));
	}
	AddBar(x, y,z,angle,color,size)
	{
		this.listBar.push(new Bar(this.base,x, y,z,angle,color,size));
	}
	AddBridge(x, y,z)
	{
		this.listBridge.push(new Bridge(this.base,x, y,z));
	}	
	AddRotator(x, y,z)
	{
		this.listRotator.push(new Rotator(this.base,x, y,z));
	}
	AddBalancator(x, y,z)
	{
		this.listBalancator.push(new Balancator(this.base,x, y,z));
	}
}