import THREE from 'three';
import PreloaderInterface from '../lib/PreloaderInterface';
import Mediator from '../lib/Mediator';
import bindAll from 'lodash.bindAll';

export default class ChristmasBall extends THREE.Object3D {
  constructor() {
    super();

    bindAll(this, 'changeColor', 'changePatternColor', 'changePatternTop', 'changePatternCenter', 'changePatternBottom');

    this.color = '#a70006';
    this.availableColors = ['#ffffff', '#FF9900', '#00A0B0', '#424242', '#a70006', '#437600', '#B5AFDD', '#F8CA00'];
    this.patternColor = '#ffffff';
    this.availablePatternColors = ['#ffffff', '#FF9900', '#00A0B0', '#424242', '#a70006', '#437600', '#B5AFDD', '#F8CA00'];

    this.availblePatterns = ['none', 'gift', 'holy', 'knot', 'pin', 'star', 'reindeer', 'snowflake'];
    this.patternTop = 'reindeer';
    this.patternCenter = 'knot';
    this.patternBottom = 'reindeer';

    this.texture = null;
    this.textureCtx = null;

    this.canvasPattern = null;
    this.mainCanvas = document.createElement('canvas');

    this.patternCtx = null;
    this.textureWidth = this.textureHeight = 2048;
    this.initCanvas();
    this.texture.needsUpdate = true;

    const shinyMap = PreloaderInterface.findTexture('mcap3');
    shinyMap.mapping = THREE.SphericalReflectionMapping;

    /* The cap */
    const cylGeom = new THREE.CylinderGeometry(5, 5, 10, 32);
    const torusGeom = new THREE.TorusGeometry(3, 1, 16, 100);
    const capMat = new THREE.MeshBasicMaterial({
      envMap: shinyMap
    });
    this.capCyl = new THREE.Mesh(cylGeom, capMat);
    this.capCyl.position.set(0, 29, 0);
    this.add(this.capCyl);
    this.capTorus = new THREE.Mesh(torusGeom, capMat);
    this.capTorus.position.set(0, 37, 0);
    this.add(this.capTorus);

    /* The ball */
    const geom = new THREE.SphereGeometry(30, 64, 64);
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

    Mediator.on('picker:bulb:change', this.changeColor);
    Mediator.on('picker:pattern:change', this.changePatternColor);
    Mediator.on('picker:top:change', this.changePatternTop);
    Mediator.on('picker:middle:change', this.changePatternCenter);
    Mediator.on('picker:bottom:change', this.changePatternBottom);
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

    this.patternCtx.clearRect(0, 0, this.textureWidth, this.textureHeight);
    this.patternCtx.save();

    this.patternCtx.drawImage(this.colorizeImage(img), dx, dy, imgW, imgH);
    this.patternCtx.restore();

    this.textureCtx.drawImage(this.canvasPattern, 0, 0, this.textureWidth, this.textureHeight);

  }

  drawTexture() {
    this.textureCtx.clearRect(0, 0, this.textureWidth, this.textureHeight);
    this.textureCtx.save();

    this.textureCtx.fillStyle = this.color;
    this.textureCtx.fillRect(0, 0, this.textureWidth, this.textureHeight);

    if (this.patternTop) this.drawPattern(this.patternTop, 'top');
    if (this.patternCenter) this.drawPattern(this.patternCenter, 'center');
    if (this.patternBottom)  this.drawPattern(this.patternBottom, 'bottom');

    this.textureCtx.restore();
  }

  initCanvas() {
    this.mainCanvas.width = this.textureWidth;
    this.mainCanvas.height = this.textureHeight;
    this.textureCtx = this.mainCanvas.getContext('2d');

    this.canvasPattern = this.mainCanvas.cloneNode();
    this.patternCtx = this.canvasPattern.getContext('2d');

    this.drawTexture();

    this.texture = new THREE.Texture(this.mainCanvas);
  }

  changeColor(value) {
    this.color = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }

  changePatternTop(value) {
    if (value === 'none') value = null;

    this.patternTop = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }

  changePatternCenter(value) {
    if (value === 'none') value = null;

    this.patternCenter = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }

  changePatternBottom(value) {
    if (value === 'none') value = null;

    this.patternBottom = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }

  changePatternColor(value) {
    this.patternColor = value;
    this.drawTexture();
    this.texture.needsUpdate = true;
  }

  colorizeImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.patternColor;
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return canvas;
  }

  drawPattern2d(ctx, img, position = 'top') {
    const rectoTop = 167;
    const rectoLeft = 58;
    const circleDiameter = 585;
    const circleRadius = 0.5 * circleDiameter;
    const versoTop = 975;
    const versoLeft = rectoLeft;

    const imgColorized = this.colorizeImage(img);
    const ratio = img.height / img.width;
    const w = circleDiameter * 2;
    const h = ratio * w;
    const dxRecto = rectoLeft + circleRadius - 0.5 * w;
    const dxVerso = versoLeft + circleRadius - 0.5 * w;

    let dyRecto
    let dyVerso;

    switch(position) {
    case 'top':
      dyRecto = rectoTop + 0.2 * circleDiameter - 0.5 * h;
      dyVerso = versoTop + 0.2 * circleDiameter - 0.5 * h;
      break;
    case 'center':
      dyRecto = rectoTop + circleRadius - 0.5 * h;
      dyVerso = versoTop + circleRadius - 0.5 * h;
      break;
    case 'bottom':
      dyRecto = rectoTop + 0.8 * circleDiameter - 0.5 * h;
      dyVerso = versoTop + 0.8 * circleDiameter - 0.5 * h;
      break;
    }

    ctx.drawImage(imgColorized, dxRecto, dyRecto, w, h);
    ctx.drawImage(imgColorized, dxVerso - circleDiameter, dyVerso, w, h);
    ctx.drawImage(imgColorized, dxVerso + circleDiameter, dyVerso, w, h);
  }

  canvasForExport(canvas) {
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (this.patternTop) this.drawPattern2d(ctx, PreloaderInterface.findImage(this.patternTop), 'top');
    if (this.patternCenter) this.drawPattern2d(ctx, PreloaderInterface.findImage(this.patternCenter), 'center');
    if (this.patternBottom) this.drawPattern2d(ctx, PreloaderInterface.findImage(this.patternBottom), 'bottom');

    return canvas;
  }

  exportToImage() {
    const template = PreloaderInterface.findImage('template');
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');
    const canvasExported = this.canvasForExport(canvas.cloneNode());

    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(template, 0, 0);
    ctx.drawImage(canvasExported, 0, 0);

    window.open(canvas.toDataURL('image/png'), 'Your Christmas tree bulb');
  }
}