import preloader from 'brindille-preloader'
import bindAll from 'lodash.bindAll';
import Mediator from './Mediator';

class PreloaderInterface {
  constructor() {
    bindAll(this, 'onComplete', 'onProgress', 'onError');

    this.manifest = [];

    preloader.on('progress', this.onProgress);
    preloader.on('complete', this.onComplete);
    preloader.on('error', this.onError);
  }

  load(manifest) {
    this.manifest = manifest;
    preloader.load(manifest);
  }

  findImage(id) {
    return preloader.getImage(id);
  }

  onComplete(ressources) {
    Mediator.emit('preload:complete', ressources);
  }

  onProgress(e) {
    Mediator.emit('preload:progress', e);
  }

  onError(e) {
    Mediator.emit('preload:error', e);
  }
}

export default new PreloaderInterface();