import THREE from 'three';
import './controls/ObjectTrackballControls';
import WAGNER from '@superguigui/wagner';
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass';
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass';
import ChristmasBall from './objects/ChristmasBall';

export default class Webgl {
  constructor(width, height) {
    this.params = {
      usePostprocessing: false,
      useVignette: false,
      useFxaa: false,
    };

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.z = 150;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xf8f9f3, 1.0);
    this.renderer.autoClearColor = true;

    this.composer = new WAGNER.Composer(this.renderer);
    this.initPostprocessing();

    this.initLights();

    this.ball = new ChristmasBall();
    this.scene.add(this.ball);

    this.controls = new THREE.ObjectTrackballControls(this.ball, this.camera, this.renderer.domElement);
    this.controls.noZoom = true;
    this.controls.dynamicObjectDampingFactor = 0.2;
  }

  initLights() {
    this.ambient = new THREE.AmbientLight( 0x999999 ); // soft white light
    this.scene.add(this.ambient);

    let lights = []
    lights[0] = new THREE.SpotLight( 0x808080, 0.25 );
    lights[0].position.set( 400, 750, 800 );
    lights[0].castShadow = true;

    this.scene.add(lights[0]);
  }

  initPostprocessing() {
    this.fxaa = new FXAAPass();

    this.vignette = new VignettePass();
    this.params.boost = 2;
    this.params.reduction = 2;
  }

  resize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  render() {
    if (this.params.usePostprocessing) {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      if (this.params.useVignette) this.composer.pass(this.vignette);
      if (this.params.useFxaa) this.composer.pass(this.fxaa);
      this.composer.toScreen();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.controls.update();
  }
}
