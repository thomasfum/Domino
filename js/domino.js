
//-------------------------------------------------------
//Domino
//-------------------------------------------------------
class Domino {
	constructor(_base,_x,_y,_z, _angle,_colorFace1,_colorFace2,_colorSide) {
 
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
			this.box = _base.add.box({ x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { custom: cubeMaterials } )
			this.box.rotation.set(0, _angle, 0)
			_base.physics.add.existing(this.box)
			//return box1
			
  }
  
	destroy(_base)
	{
		_base.destroy(this.box);
	}
	toJson() {
		return JSON.stringify({
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
		return new Domino(_base,data.x, data.y, data.z, data.angle, data.colorFace1, data.colorFace2, data.colorFace3);
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
		this.f1=_base.physics.add.box({mass: 100, x:_x+((nbTorus-0)*0.4), y: _y/2,z:_z-2, height: _y,width: 0.5, depth: 0.5  }, 
		{ lambert: { color: 'GoldenRod' } })
		this.f2=_base.physics.add.box({mass: 100, x:_x+((nbTorus-0)*0.4), y: _y,z:_z-1.25, height: 0.5,width: 0.5, depth: 2  }, 
		{ lambert: { color: 'GoldenRod' } })
		
		

		_base.physics.add.constraints.lock(this.f1.body, this.f2.body)
		
		this.listTorus=[];
		this.listCst=[];
		for (let i = 2; i <= nbTorus; i++) 
		{
			// chain
			let t2 = _base.add.torus(
				{ x: i * 0.4 + _x, y: _y, z: _z,tubularSegments: 16, tube: 0.05, radius: 0.25 },
				{ standard: { emissive: 0x888888, roughness: 0.4, metalness: 1 } }
			)
			if (i % 2 == 0) 
				t2.rotateX(Math.PI / 2)
			let t=_base.physics.add.existing(t2, { mass: i === nbTorus ? 0 : 1 })
				console.log(t)
			this.listTorus.push(t2)
			// ball
			if (i === 2) 
			{
				this.ball = _base.physics.add.sphere(
					{ mass: 2, radius: 0.4, x: + _x+0.2, y: _y,z: _z },
					{ standard: { emissive: 0x222222, roughness: 0.4, metalness: 1 } }
					)
				_base.physics.add.constraints.lock(t2.body, this.ball.body)
				this.starer=_base.physics.add.box({mass:300, x: + _x+2, y: 2.5,z: _z, height: 5,width:1, depth: 1  }, 
				{ lambert: { color: 'GoldenRod' } })
				this.cst=_base.physics.add.constraints.lock(this.starer.body, this.ball.body)
				this.starer.visible = false
				
				
			}
			
		}
		console.log(this.listTorus)
			console.log('this.listTorus')
	}
	launch(){
		console.log('Launch!!!')
		//this.starer.body.physics.constraints.physicsWorld.removeConstraints()
		//this.third.physics.destroy(this.starer)
		this.starer.body.physics.constraints.physicsWorld.removeConstraint(this.cst)
		this.starer.body.setCollisionFlags(6)
		this.starer.visible = false
		this.starer.active = false
		//this.third.destroy(this.starer)
		//this.starer=null
	}
	destroy(_base)
	{
		/*
		this.starer.active = false
		this.f1.active = false
		this.f2.active = false
		this.ball.active = false
		
		this.starer.body.setCollisionFlags(6)
		this.f1.body.setCollisionFlags(6)
		this.f2.body.setCollisionFlags(6)
		this.ball.body.setCollisionFlags(6)
		
		for (const o of this.listTorus) {
				o.active = false
				o.body.setCollisionFlags(6)
				
				console.log(o.body.physics.constraints.physicsWorld)
				o.body.physics.constraints.physicsWorld.removeConstraint(o.body.physics.constraints.physicsWorld)
				console.log(o.body)
				
			}
		//_base.destroy(this.cst)
		
		_base.destroy(this.starer);
		_base.destroy(this.f1);
		_base.destroy(this.f2);
		console.log('---------------destroy Torus');
		
		//_base.destroy(this.ball);
		
		console.log(this.listTorus)
			console.log('this.listTorus')
		for (const o of this.listTorus) {
			console.log(o);
				_base.destroy(o)
			}
			*/
		/*	
			
			while(this.listTorus.length > 0) {
				this.listTorus.pop();
			}
			*/
		
		
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
				
				
			this.arm = _base.physics.add.box({ mass: 2,x:_x, y: _y+1.75,z:_z, height:0.5,width: 0.5, depth: 14  }, 
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
		
		this.box1 = _base.add.box({ x: _x, y: _y,z:_z,height: 2,width: 0.4, depth: _size  }, { lambert: { color: _color } })
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