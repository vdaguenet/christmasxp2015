import Webgl from './Webgl';
import Mediator from './lib/Mediator';
import PreloaderInterface from './lib/PreloaderInterface';
import raf from 'raf';
import 'gsap';
import ColorPicker from './components/ColorPicker';
import PatternPicker from './components/PatternPicker';

let webgl;

loaderAnim();

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

function loaderAnim() {
  [].forEach.call(document.querySelectorAll('#snowball circle'), ($circle, i) => {
    TweenMax.fromTo($circle, 0.8, { y: -100 * Math.random(), alpha: 0.5 },
      { y: 60, alpha: 1, repeat: -1, delay: Math.random() * i * 0.3, ease: Linear.easeNone })
  });
}

function loaderTransitionOut() {
  const start = 1.0;
  const $loaderEls = document.querySelectorAll('.loader-content h1, .loader-content svg, .loader-content p')
  const $loader = document.querySelector('.loader');
  const $selectors = document.querySelectorAll('.picker p, .color-picker, .pattern-picker, .button');

  const tl = new TimelineMax();
  tl.staggerFromTo($loaderEls, 0.8, { y: 0 }, { y: 50, alpha: 0, ease: Expo.easeInOut }, -0.08, start);
  tl.fromTo($loader, 0.8, { scaleX: 1 }, { scaleX: 0.32, ease: Expo.easeInOut }, start + 0.7);
  tl.to($loader, 0.4, { autoAlpha: 0, display: 'none' }, start + 1.3);
  tl.staggerFromTo($selectors, 0.9,
    { y: 50, alpha: 0 },
    { y: 0, alpha: 1, ease: Expo.easeOut }, 0.08, start + 1.3);
  tl.fromTo(webgl.ball.scale, 4.0,
    {x: 0.1, y: 0.1, z: 0.1},
    {x: 1.0, y: 1.0, z: 1.0, ease: Expo.easeOut}, start);
  tl.fromTo(webgl.ball.rotation, 4.0,
    {y: -Math.PI}, {y: Math.PI * -0.08, ease: Expo.easeOut}, start);
}

function initComponents() {
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
  // dom components
  initComponents();
  // handle resize
  window.addEventListener('resize', resizeHandler);
  // let's play !
  animate();

  loaderTransitionOut();
}