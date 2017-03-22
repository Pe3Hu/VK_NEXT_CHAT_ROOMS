/*
Охотятся за юзером.
Питаются его Энергией.
*/
var _BadBlocks = function (scene, local_user_mesh, callback)
{
	this.Scene = scene;

	this.ObjectsArray = [];
	this.LocalUserMesh = local_user_mesh;
	this.temp_v= null;
	this.BoundingRadius = 100;
	this.Callback = callback;

	this.createObjects();
};
_BadBlocks.prototype.update = function (mul)
{
	for(var i=0; i< this.ObjectsArray.length; i++)
	{	
		var distTo = this.LocalUserMesh.position.distanceTo(this.ObjectsArray[i].position);
		if(distTo < this.BoundingRadius)
		{
			this.Callback();
		}

		if(this.ObjectsArray[i].MovingType === 0)
		{	
			this.temp_v = this.LocalUserMesh.position.clone();
			this.temp_v.sub(this.ObjectsArray[i].position);
			this.temp_v.normalize();
			this.temp_v.multiplyScalar(mul*7);
			this.ObjectsArray[i].position.add(this.temp_v);
			this.ObjectsArray[i].lookAt(this.LocalUserMesh.position);
			this.ObjectsArray[i].MovingTimeCounter += mul;
			if(this.ObjectsArray[i].MovingTimeCounter > this.ObjectsArray[i].TargetMovingTimeBorder)
			{
				this.ObjectsArray[i].RandomMovingVector.set(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
				this.ObjectsArray[i].RandomMovingVector.multiplyScalar(mul);
				this.ObjectsArray[i].MovingTimeCounter = 0;
				this.ObjectsArray[i].MovingType = 1;				
			}
		} else
		{
			this.ObjectsArray[i].position.add(this.ObjectsArray[i].RandomMovingVector);			
			this.ObjectsArray[i].MovingTimeCounter += mul;
			if(this.ObjectsArray[i].MovingTimeCounter > this.ObjectsArray[i].RandomMovingTimeBorder)
			{
				this.ObjectsArray[i].MovingTimeCounter = 0;
				this.ObjectsArray[i].MovingType = 0;				
			}
		}
	}
};

_BadBlocks.prototype.resetObjectsPositions = function ()
{
	for(var i=0; i< this.ObjectsArray.length; i++)
	{
		this.ObjectsArray[i].position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
		this.ObjectsArray[i].position.y = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.y;
		this.ObjectsArray[i].position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
	}
};

_BadBlocks.prototype.createObjects = function ()
{

	var materials = [
	    new THREE.MeshStandardMaterial( { color: 0xff0000 } ), // right
	    new THREE.MeshStandardMaterial( { color: 0x0000ff } ), // left
	    new THREE.MeshStandardMaterial( { color: 0x00ff00 } ), // top
	    new THREE.MeshStandardMaterial( { color: 0xffff00 } ), // bottom
	    new THREE.MeshStandardMaterial( { map: THREE.ImageUtils.loadTexture('./models/bad_block_256.png') } ), // back
	    new THREE.MeshStandardMaterial( { color: 0x00ffff } )  // front
	];

	var tMesh = new THREE.Mesh(
		new THREE.BoxGeometry(140, 140, 140), 
		new THREE.MultiMaterial( materials )
	);

	for (var i=0; i< 40; i++)
	{
		var el = tMesh.clone();
		el.position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
		el.position.y = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.y;
		el.position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
		el.MoveSpeed = Math.random()*BAD_SCENE.OBJECTS_SPEED;
		el.RandomMovingTimeBorder = Math.random()*2000+3000;
		el.MovingTimeCounter = 0;
		el.TargetMovingTimeBorder = Math.random()*5000+5000;
		el.MovingType = 0;
		el.RandomMovingVector = new THREE.Vector3();

		this.ObjectsArray.push(el);
		this.Scene.add(el);
	}
};
_BadBlocks.prototype.deleteObjects = function ()
{

	while(this.ObjectsArray.length > 0)
	{
		this.Scene.remove(this.ObjectsArray[this.ObjectsArray.length-1]);
		this.ObjectsArray.splice(this.ObjectsArray.length-1,1);
	}
};