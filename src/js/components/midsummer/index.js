const THREE = require('three')
const toxi = require('toxiclibsjs')
const Stats = require('stats-js')
const OrbitControls = require('three-orbit-controls')(THREE)
const Tone = require('tone')

import Flower from "./flower";
import Tunnel from "./tunnel";

class Midsummer {

  constructor(element, image, parent) {

    this.container = element
    this.resolution = 65
    this.totalParticles = 500
    this.totalFlowers = 25
    this.flowers = []

    this.soundVal = 0

    this.currentVertice = this.totalFlowers
    // this.createStats()
    this.initRenderer()

    this.createLights()
    this.tunnel = new Tunnel(this.scene, this.camera, 25, this.pointLight, this.lightShadow )
    this.tunnelVertices = this.tunnel.tunnel.geometry.vertices
    this.createFlowers()

    for (let i = 0; i < this.totalFlowers; i++) {

      this.currentVertice = this.currentVertice + parseInt(Math.random() * (5 - 1) + 1)
      this.flowers[i].meshModify(this.tunnelVertices[this.currentVertice].x, this.tunnelVertices[this.currentVertice].y, this.tunnelVertices[this.currentVertice].z);
    }

   this.fft = new Tone.Analyser("fft", 32);
    this.waveform = new Tone.Analyser("waveform", 1024);
    this.player = new Tone.Player({
      'url' : '../../../assets/midsummer-loop.mp3',
      'loop' : true,
      'autostart' : true
    }).fan(this.fft, this.waveform).toMaster();
    
    window.addEventListener('resize', () => {
      this.resize()
    })

    window.addEventListener('blur', () => {
      this.player.stop()
    });

    window.addEventListener('focus', () => {
      this.player.start()
    });

    this.animate()
  }

  createStats() {

    this.stats = new Stats()
    this.stats.setMode(0)
    document.body.appendChild( this.stats.domElement )
    this.stats.domElement.style.position = 'absolute'
    this.stats.domElement.style.right = '0px'
    this.stats.domElement.style.top = '0px'

    this.velocity = 0
  }

  createControls() {
    this.controls = new OrbitControls(this.camera)
  }

  initRenderer() {

    this.stage = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight)
    this.camera = new THREE.PerspectiveCamera( 40, this.stage.x / this.stage.y, 0.1, 100000)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: false})
    this.renderer.setClearColor( 0xffffff, 0)
    this.scene.add( this.camera )
    this.renderer.setSize(this.stage.x, this.stage.y)
    this.container.appendChild( this.renderer.domElement)
  }

  animate() {

    requestAnimationFrame(() => { this.animate() })

    this.render()
    


    this.waveformValues = this.fft.analyse();
    this.soundVal = this.analizeSound(this.waveformValues)
    this.tunnel.render()

    this.velocity += 0.0001
    for (var i = 0; i < this.flowers.length; i++) {
      this.flowers[i].animate(0.2);
    }
   }


   analizeSound(values) {
    for (let i = 0; i < values.length; i++){
      return values[i] / 255;
      
    }
  }


  createLights() {
    let d = 500;
    this.scene.add( new THREE.AmbientLight( 0x666666 ) );

    this.light = new THREE.SpotLight(); 

    this.scene.add(this.light); 
    
    this.pointLight = new THREE.PointLight(  0x666666, 1.7, 0, 4 );
 
    this.scene.add( this.pointLight );

    this.lightShadow = new THREE.DirectionalLight( 0xdfebff, 1.75 );
 
    this.lightShadow.position.multiplyScalar( 1.3 );
    this.lightShadow.castShadow = true;
    this.lightShadow.shadow.mapSize.width = 1024;
    this.lightShadow.shadow.mapSize.height = 1024;
       
    this.lightShadow.shadow.camera.left = - d;
    this.lightShadow.shadow.camera.right = d;
    this.lightShadow.shadow.camera.top = d;
    this.lightShadow.shadow.camera.bottom = - d;
    this.lightShadow.shadow.camera.far = 1000;
    this.scene.add( this.lightShadow );
  }

  randomizeHarmonics(){

    let armonic = []

    for(var i = 0; i < 8; i++) {
      armonic.push(parseInt(Math.random() * (10 - 2) + 2))
    }
    return armonic
  }

  createFlowers() {

   for (var i = 0; i < this.totalFlowers; i++) {
      this.flowers.push(new Flower(this.randomizeHarmonics(), this))
    }
  }

  resize (){
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
 }

  addParticles(){

    let positions = [];

    for (let k =0; k < this.totalParticles; k++) {
      positions.push(toxi.geom.Vec3D.randomVector().scale(100+Math.random()*300));
    }



    let geom = new THREE.Geometry();
    geom.vertices = positions.map(function(v) { 
      return new THREE.Vector3(v.x, v.y, v.z); 
    });
      
    let material = new THREE.PointsMaterial({
      color: 0x000000,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    let particleSystem = new THREE.Points( geom, material );
    this.scene.add( particleSystem );
  }

  render() {
    this.renderer.render( this.scene, this.camera )
  }
}

export default Midsummer

