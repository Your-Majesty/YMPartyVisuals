const THREE = require('three')
const toxi = require('toxiclibsjs')


class Flower {
  
  constructor(armonic, parent) {
    this.m = armonic
    this.scene = parent.scene
    this.resolution = parent.resolution
    this.timeScalingAnimation = 100
    this.camera = parent.camera
    this.parent = parent
    this.durationRandom = parseInt(Math.random() * (35 - 10) + 10)
    this.allVertices = this.parent.tunnelVertices
    this.animationScale = this.durationRandom
    this.sineMovement = parseInt(Math.random() * (2 - 1) + 1)
    this.shouldSine = false
    this.angle = 0

    this.tick = 0

    this.createMaterial()
    this.createMesh()
  }

  createMaterial() {

    // this.color = new THREE.Color( Math.random() * 0x5d5fff);
    this.color = new THREE.Color( Math.random() * 0x9932CC );
    this.material = new THREE.MeshLambertMaterial({opacity: 1.0, color: this.color})
    this.material.side = THREE.DoubleSide
  }

  createMesh() {

    this.scaleRandom = Math.random() * (4.4 - 2) + 2

    this.sh = new toxi.geom.mesh.SphericalHarmonics( this.m )
    this.builder = new toxi.geom.mesh.SurfaceMeshBuilder( this.sh )
    this.toxiMesh = this.builder.createMesh( new toxi.geom.mesh.TriangleMesh(), this.resolution, 1, true)
    this.threeGeometry = toxi.THREE.ToxiclibsSupport.createMeshGeometry(this.toxiMesh)
    this.threeMesh = new THREE.Mesh( this.threeGeometry, this.material )
    this.scene.add(this.threeMesh)

  }

  meshModify(x, y, z) {
    
    this.threeMesh.scale.set(this.scaleRandom, this.scaleRandom, this.scaleRandom)
    this.threeMesh.position.set(x, y, z)
    this.threeMesh.rotation.x = Math.PI / 2
    this.threeMesh.rotation.y = 2 * Math.PI / 2
    this.threeMesh.rotation.z = 2 * Math.PI / 2
    this.threeMesh.scale.set(0, 0, 0)
    this.animationScale = 0
  }

  sineMovement() {

    var counter = 0;
    // 100 iterations
    var increase = Math.PI * 2 / 100;

    for ( i = 0; i <= 1; i += 0.01 ) {
      x = i;
      y = Math.sin( counter ) / 2 + 0.5;
      counter += increase;
    }

  }

  easeInOutCubic (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
     let scale = c/2*((t-=2)*t*t*t*t + 2) + b;

    this.threeMesh.scale.set(scale, scale, scale)
  }

  easeInOutSine (t) {

    this.angle += (Math.random() * (0.009 - 0.001) + 0.001)
    this.threeMesh.position.y = this.threeMesh.position.y + Math.sin(this.angle) * (Math.random() * (0.005 - 0.001) + 0.001)
    this.threeMesh.position.x = this.threeMesh.position.x + Math.sin(this.angle) * (Math.random() * (0.005 - 0.001) + 0.001)
  }


  animate(newPos) {

    this.rotationRandom = parseInt(Math.random() * (400 - 100) + 100)
    this.threeMesh.rotation.x = this.threeMesh.rotation.x + ((Math.random() * (0.5 - -0.1) + -0.1) / this.rotationRandom)
    // this.threeMesh.rotation.z = this.threeMesh.rotation.z + ((Math.random() * (0.5 - -0.1) + -0.1) / this.rotationRandom)
    this.threeMesh.rotation.y = this.threeMesh.rotation.y + ((Math.random() * (0.5 - -0.1) + -0.1) / this.rotationRandom)

    let a = new THREE.Vector3( this.camera.position.x, this.camera.position.y, this.camera.position.z)
    let b = new THREE.Vector3( this.threeMesh.position.x, this.threeMesh.position.y, this.threeMesh.position.z )
    let d = a.distanceTo( b )

    if (d < 120) {
      this.animationScale = this.animationScale + 0.1
      if (this.animationScale < this.durationRandom) {
        this.easeInOutCubic(this.animationScale, 0, this.scaleRandom, this.durationRandom);
      }
      this.shouldSine = true
    }

    if (d < 22) {
      this.shouldSine = false
      this.parent.currentVertice = this.parent.currentVertice + parseInt(Math.random() * (6 - 2) + 2)
      this.threeMesh.position.x = this.allVertices[this.parent.currentVertice].x
      this.threeMesh.position.y = this.allVertices[this.parent.currentVertice].y
      this.threeMesh.position.z = this.allVertices[this.parent.currentVertice].z
      this.threeMesh.scale.set(0, 0, 0)
      this.animationScale = 0
    }

    // this.easeInOutSine(1)
  }
}

export default Flower