import Webgl from './Webgl';
import Mediator from './lib/Mediator';
import PreloaderInterface from './lib/PreloaderInterface';
import raf from 'raf';
import 'gsap';
import ColorPicker from './components/ColorPicker';
import PatternPicker from './components/PatternPicker';

let webgl;

Mediator.once('preload:complete', main);

PreloaderInterface.load([
  { id: 'gift', src: 'assets/patterns/gift.png' },
  { id: 'holy', src: 'assets/patterns/holy.png' },
  { id: 'knot', src: 'assets/patterns/knot.png' },
  { id: 'pin', src: 'assets/patterns/pin.png' },
  { id: 'star', src: 'assets/patterns/star.png' },
  { id: 'reindeer', src: 'assets/patterns/reindeer.png' },
  { id: 'preview-gift', src: 'assets/previews/gift.png' },
  { id: 'preview-holy', src: 'assets/previews/holy.png' },
  { id: 'preview-knot', src: 'assets/previews/knot.png' },
  { id: 'preview-pin', src: 'assets/previews/pin.png' },
  { id: 'preview-star', src: 'assets/previews/star.png' },
  { id: 'preview-reindeer', src: 'assets/previews/reindeer.png' },
  { id: 'template', src: 'assets/print-template.png' }
]);

PreloaderInterface.loadTextures([
  { id: 'mcap3', src: 'assets/textures/mcap3.png' }
]);

function bindEvents() {
  const bulbColorPick = new ColorPicker(document.querySelector('#bulbColor'), 'bulb', webgl.ball.availableColors, webgl.ball.color);
  const patternColorPick = new ColorPicker(document.querySelector('#patternColor'), 'pattern', webgl.ball.availablePatternColors, webgl.ball.patternColor);
  const patternTopPicker = new PatternPicker(document.querySelector('#patternTop'), 'top', webgl.ball.availblePatterns, webgl.ball.patternTop);
  const patternMiddlePicker = new PatternPicker(document.querySelector('#patternMiddle'), 'middle', webgl.ball.availblePatterns, webgl.ball.patternCenter);
  const patternBottomPicker = new PatternPicker(document.querySelector('#patternBottom'), 'bottom', webgl.ball.availblePatterns, webgl.ball.patternBottom);

  document.querySelector('#export').addEventListener('click', function() {
    webgl.ball.exportToImage();
  });
}

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  raf(animate);

  webgl.render();
}

function main() {
  webgl = new Webgl(window.innerWidth, window.innerHeight);
  document.body.appendChild(webgl.renderer.domElement);
  // events
  bindEvents();
  // handle resize
  window.addEventListener('resize', resizeHandler);
  // let's play !
  animate();
}