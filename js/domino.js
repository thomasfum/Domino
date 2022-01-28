
//https://stackoverflow.com/questions/6487699/best-way-to-serialize-unserialize-objects-in-javascript

class Domino {
  constructor(base,_x,_y,_z, _angle,_colorFace1,_colorFace2,_colorSide) {
 
			this.x=_x;
			this.y=_y;
			this.z=_z;
			this.angle=_angle;
			this.colorFace1=_colorFace1;
			this.colorFace2=_colorFace2;
			this.colorSide=_colorSide;
			
 
				base.textureFace.repeat.set(1, 1)
				base.textureSide.repeat.set(1, 1)
				//textureCube.texture.left.repeat.set(1, 1)
				//textureCube.texture.right.repeat.set(1, 1)
				
				
				//  const material = new THREE.MeshLambertMaterial({ map: this.textureWood,  transparent: true,      opacity: 1,    color: 0xffffff })
				
			const cubeMaterials = [
				new THREE.MeshLambertMaterial({ map: base.textureFace }), //right side
				new THREE.MeshLambertMaterial({ map: base.textureFace}), //left side
				new THREE.MeshLambertMaterial({ map:  base.textureSide}), //top side
				new THREE.MeshLambertMaterial({ map:  base.textureSide}), //bottom side
				new THREE.MeshLambertMaterial({ map:  base.textureSide}), //front side
				new THREE.MeshLambertMaterial({ map:  base.textureSide}), //back side
			];
	
 
			//var textureCube =new THREE.CubeTexture([base.textureFace, base.textureFace, base.textureSide, base.textureSide, base.textureSide, base.textureSide]);
			//var textureCube = THREE.misc.textureCube([base.textureFace, base.textureFace, base.textureSide, base.textureSide, base.textureSide, base.textureSide])
			//var textureCube = THREE.misc.textureCube([base.textureFace, base.textureFace, base.textureSide, base.textureSide, base.textureSide, base.textureSide])
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
			//this.box = base.add.box({ x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { lambert: { color: _colorFace1 } })
			//this.box = base.add.box({ x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { custom: textureCube.materials } )
			this.box = base.add.box({ x: _x, y: _y,z:_z,height: 3,width: 0.4, depth: 1  }, { custom: cubeMaterials } )
			this.box.rotation.set(0, _angle, 0)
			base.physics.add.existing(this.box)
			//return box1
			
  }
  
		toJson() {
			return JSON.stringify({x: this.x,
				y: this.y,
				z: this.z,
				angle: this.angle,
				colorFace1: this.colorFace1,
				colorFace2: this.colorFace2,
				colorSide: this.colorSide
			});
		}
		
		static fromJson (base,json)
		{
			//console.log(json)
			var data = JSON.parse(json); // Parsing the json string.
			return new Domino(base,data.x, data.y, data.z, data.angle, data.colorFace1, data.colorFace2, data.colorFace3);
		}
		
		
		
/*
	Domino.prototype.toJson = function() {
		return JSON.stringify({x: this.x,
			y: this.y,
			z: this.z,
			angle: this.angle,
			colorFace1: this.colorFace1,
			colorFace2: this.colorFace2,
			colorSide: this.colorSide
		});
	};
	
	Domino.fromJson = function(json) {
    var data = JSON.parse(json); // Parsing the json string.
    return new Domino(data.x, data.y);
	*/
//};

/*
Person.prototype.toJson = function() {
    return JSON.stringify({age: this.age});
};
Similar for deserializing:

Person.fromJson = function(json) {
    var data = JSON.parse(json); // Parsing the json string.
    return new Person(data.age);
};
The usage would be:

var serialize = p1.toJson();
var _p1 = Person.fromJson(serialize);
alert("Is old: " + _p1.isOld());

*/
}