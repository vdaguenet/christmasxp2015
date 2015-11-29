import preloader from 'brindille-preloader'
import bindAll from 'lodash.bindAll';
import Mediator from './Mediator';
import THREE from 'three';

class PreloaderInterface {
  constructor() {
    bindAll(this, 'onManifestLoaded', 'onProgress', 'onError');

    this.manifest = [];
    this.textures = {};

    this.manifestLoaded = false;
    this.texturesLoaded = false;

    preloader.on('progress', this.onProgress);
    preloader.on('complete', this.onManifestLoaded);
    preloader.on('error', this.onError);
  }

  load(manifest) {
    this.manifest = manifest;
    preloader.load(manifest);
  }

  loadTextures(textures) {
    const loader = new THREE.TextureLoader();
    const nbTexture = textures.length;
    let nbTextureLoaded = 0;

    textures.forEach((tex) => {
      loader.load(tex.src, (texture) => {
        nbTextureLoaded++;
        this.textures[tex.id] = texture;

        if (nbTextureLoaded >= nbTexture) {
          this.onTexturesLoaded();
        }
      })
    });
  }

  findImage(id) {
    return preloader.getImage(id);
  }

  findTexture(id) {
    return this.textures[id];
  }

  onManifestLoaded() {
    this.manifestLoaded = true;
    this.onComplete();
  }

  onTexturesLoaded() {
    this.texturesLoaded = true;
    this.onComplete();
  }

  onComplete() {
    if (this.texturesLoaded && this.manifestLoaded) {
      Mediator.emit('preload:complete');
    }
  }

  onProgress(e) {
    Mediator.emit('preload:progress', e);
  }

  onError(e) {
    Mediator.emit('preload:error', e);
  }
}

export default new PreloaderInterface();