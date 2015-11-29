import THREE from 'three';
import PreloaderInterface from '../lib/PreloaderInterface';

export default class ChristmasBall extends THREE.Object3D {
  constructor() {
    super();

    this.color = '#7800ff';
    this.patternColor = '#e1ff00';

    //

    this.texture = null;
    this.textureCtx = null;
    this.canvasPattern = null;
    this.patternCtx = null;
    this.textureWidth = this.textureHeight = 2048;
    this.initCanvas();
    this.texture.needsUpdate = true;

    const shinyMap = PreloaderInterface.findTexture('mcap3');
    shinyMap.mapping = THREE.SphericalReflectionMapping;

    /* The cap */
    const cylGeom = new THREE.CylinderGeometry( 5, 5, 10, 32 );
    const torusGeom = new THREE.TorusGeometry( 3, 1, 16, 100 );
    const capMat = new THREE.MeshBasicMaterial({
      envMap: shinyMap
    });
    this.capCyl = new THREE.Mesh(cylGeom, capMat);
    this.capCyl.position.set(0, 29, 0);
    this.add(this.capCyl);
    this.capTorus = new THREE.Mesh(torusGeom, capMat),
    this.capTorus.position.set(0, 37, 0);
    this.add(this.capTorus);

    /* The ball */
    const geom = new THREE.SphereGeometry( 30, 64, 64 );
    const mat = new THREE.MeshPhongMaterial({
      map: this.texture,
      wireframe: false,
      shininess: 40,
      lightMap: shinyMap,
      specularMap: shinyMap,
      envMap: shinyMap
    });

    this.ball = new THREE.Mesh(geom, mat);
    this.ball.rotation.y = -0.5 * Math.PI;

    this.add(this.ball);
  }

  update() {
    // this.rotation.y += 0.005;
  }

  drawPattern(id, position = 'top', width = 1.0) {
    const img = PreloaderInterface.findImage(id);
    const ratio = img.height / img.width;
    const imgW = width * this.textureWidth;
    const imgH = 1.8 * ratio * imgW;
    const dx = 0.5 * this.textureWidth - 0.5 * imgW;
    let dy;
    switch(position) {
      case 'top':
        dy = 0.25 * this.textureHeight - 0.5 * imgH;
        break;
      case 'center':
        dy = 0.5 * this.textureHeight - 0.5 * imgH;
        break;
      case 'bottom':
        dy = 0.75 * this.textureHeight - 0.5 * imgH;
        break;
    }

    this.patternCtx.save();
    this.patternCtx.fillStyle = this.patternColor;
    this.patternCtx.fillRect(dx, dy, imgW, imgH);
    this.patternCtx.globalCompositeOperation = 'destination-atop';
    this.patternCtx.drawImage(img, dx, dy, imgW, imgH);
    this.patternCtx.restore();

    this.textureCtx.drawImage(this.canvasPattern, 0, 0, this.textureWidth, this.textureHeight);
  }

  drawTexture() {
    this.textureCtx.save();
    this.textureCtx.fillStyle = this.color;
    this.textureCtx.fillRect(0, 0, this.textureWidth, this.textureHeight);
    this.drawPattern('pin', 'top');
    this.drawPattern('star-2', 'center');
    this.drawPattern('star', 'bottom');
    this.textureCtx.restore();
  }

  initCanvas() {
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = this.textureWidth;
    canvasTexture.height = this.textureHeight;
    this.textureCtx = canvasTexture.getContext('2d');

    this.canvasPattern = canvasTexture.cloneNode();
    this.patternCtx = this.canvasPattern.getContext('2d');

    this.drawTexture();

    this.texture = new THREE.Texture(canvasTexture);
  }

  changeColor(value) {
    this.color = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }

  changePatternColor(value) {
    this.patternColor = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }
}