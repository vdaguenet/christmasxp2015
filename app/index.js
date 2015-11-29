import Webgl from './Webgl';
import Mediator from './lib/Mediator';
import PreloaderInterface from './lib/PreloaderInterface';
import raf from 'raf';
import dat from 'dat-gui';
import 'gsap';

let webgl;
let gui;

Mediator.once('preload:complete', main);

PreloaderInterface.load([
  { id: 'gift', src: 'assets/patterns/gift.png' },
  { id: 'holy', src: 'assets/patterns/holy.png' },
  { id: 'knot', src: 'assets/patterns/knot.png' },
  { id: 'pin', src: 'assets/patterns/pin.png' },
  { id: 'star', src: 'assets/patterns/star.png' },
  { id: 'star-2', src: 'assets/patterns/star-2.png' },
  { id: 'template', src: 'assets/print-template.png' }
]);

PreloaderInterface.loadTextures([
  { id: 'mcap3', src: 'assets/textures/mcap3.png' }
]);

function main() {
  webgl = new Webgl(window.innerWidth, window.innerHeight);
  document.body.appendChild(webgl.renderer.domElement);
  //
  initGUI();
  // handle resize
  window.addEventListener('resize', resizeHandler);
  // let's play !
  animate();
}

function initGUI () {
  gui = new dat.GUI();
  let gPost = gui.addFolder('Post processing')
  gPost.add(webgl.params, 'usePostprocessing');
  gPost.add(webgl.params, 'useVignette');
  gPost.add(webgl.params, 'useFxaa');
  gui.addColor(webgl.ball, 'color').onChange(function(value) {
    webgl.ball.changeColor(value);
  });
  gui.addColor(webgl.ball, 'patternColor').onChange(function(value) {
    webgl.ball.changePatternColor(value);
  });
  gui.add(webgl.ball, 'exportToImage');
}

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  raf(animate);

  webgl.render();
}
