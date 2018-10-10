const THREE = require('three')

class Tunnel {

  constructor(scene, camera, points, light, lightShadow) {

    this.scene = scene
    this.camera = camera

    this.pointsSpline = points
    this.light = light
    this.lightShadow = lightShadow
    this.cameraTravelledStep = 0
    this.cameraRotationStep = 0.0

    this.cameraTravelIncrement = 0.000013
    this.cameraRotationIncrement = 0.0002

    this.pointsPerTunnel = []

    this.createTunnel();
  }

  createTunnel() {

    this.geom = this.createTunnelGeometry(this.pointsSpline, 512, 20, 10);
    this.tunnel = this.createTunnelMesh(this.geom);
    this.scene.add(this.tunnel);
  }

  createTunnelMesh () {

    this.material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, side:THREE.DoubleSide, wireframe: true});
    return new THREE.Mesh(this.geom, this.material);
  }

  createTunnelGeometry(nbPoints, segments, radius, radiusSegments) {

    this.points = [];
    let previousPoint = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < nbPoints; i++)
    {
      let randomX = previousPoint.x + 5 + Math.round(Math.random() * 500)
      let randomY = previousPoint.y + 5 + Math.round(Math.random() * 500)
      let randomZ = previousPoint.z + 5 + Math.round(Math.random() * 500)

      previousPoint.x = randomX
      previousPoint.y = randomY
      previousPoint.z = randomZ

      this.points.push(new THREE.Vector3(randomX, randomY, randomZ))
    }

    this.spline = new THREE.CatmullRomCurve3(this.points)
    for (var i = (1/500); i < 1; i+= (1/500)) {
      this.pointsPerTunnel.push(this.spline.getPointAt(i))
    }

    return new THREE.TubeGeometry(this.spline, segments, radius, radiusSegments, false)
  }

  render() {

    if (this.cameraTravelledStep > 0.5 - this.cameraTravelIncrement) {
      this.cameraTravelledStep = 0.0;
    }

    let pos1 = this.spline.getPointAt(this.cameraTravelledStep)
    let pos2 = this.spline.getPointAt(this.cameraTravelledStep + this.cameraTravelIncrement)


    // let a = new THREE.Vector3( this.tunnel.geometry.vertices[1000].x, this.tunnel.geometry.vertices[1000].y, this.tunnel.geometry.vertices[1000].z)
    // let b = new THREE.Vector3( pos2.x, pos2.y, pos2.z )
    // let d = a.distanceTo( b )

    this.camera.position.set(pos1.x, pos1.y, pos1.z);
    this.camera.lookAt(pos2);

    this.light.position.set(pos2.x, pos2.y, pos2.z); 
    this.lightShadow.position.set( pos2.x, pos2.y, pos2.z );
    this.camera.rotation.z = -Math.PI/2 + (Math.sin(this.cameraRotationStep) * Math.PI);
    
    this.cameraTravelledStep += this.cameraTravelIncrement;
    this.cameraRotationStep += this.cameraRotationIncrement;
  }
}

export default Tunnel