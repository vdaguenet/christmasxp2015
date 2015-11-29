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
  let gBulb = gui.addFolder('Bulb')
  gBulb.addColor(webgl.ball, 'color').onChange(function(value) {
    webgl.ball.changeColor(value);
  });
  gBulb.addColor(webgl.ball, 'patternColor').onChange(function(value) {
    webgl.ball.changePatternColor(value);
  });
  gBulb.add(webgl.ball, 'patternTop',
    ['none', 'gift', 'holy', 'knot', 'pin', 'star', 'star-2']).onChange(function(value) {
    if (value === 'none') value = null;
    webgl.ball.changePatternTop(value);
  });
  gBulb.add(webgl.ball, 'patternCenter',
    ['none', 'gift', 'holy', 'knot', 'pin', 'star', 'star-2']).onChange(function(value) {
    if (value === 'none') value = null;
    webgl.ball.changePatternCenter(value);
  });
  gBulb.add(webgl.ball, 'patternBottom',
    ['none', 'gift', 'holy', 'knot', 'pin', 'star', 'star-2']).onChange(function(value) {
    if (value === 'none') value = null;
    webgl.ball.changePatternBottom(value);
  });
  gBulb.add(webgl.ball, 'exportToImage');
  let gPost = gui.addFolder('Post processing')
  gPost.add(webgl.params, 'usePostprocessing');
  gPost.add(webgl.params, 'useVignette');
  gPost.add(webgl.params, 'useFxaa');
}

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  raf(animate);

  webgl.render();
}
