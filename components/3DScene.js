import React from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import GLTFExporter from 'three-gltf-exporter';
import TransformControls from 'three-transform-ctrls';
import OrbitControls from 'three-orbitcontrols';
import FBXLoader from 'three-fbxloader-offical';
// import FBXLoader from 'three-fbx-loader';
// import OBJLoader from 'three/examples/jsm/loaders/OBJLoader';
import isEqual from 'lodash/isEqual';

class THREEScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: null,
    };
  }

  componentDidMount() {
    const { source } = this.props;
    this.threeSetup();
    source && this.loadObject();
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  componentDidUpdate(prevProps, prevState) {
    const { source, objectScale, panel } = this.props;

    if (source !== prevProps.source) {
      this.loadObject();
    }

    if (!isEqual(objectScale, prevProps.objectScale)) {
      this.reScaleObject(objectScale);
    }

    if (panel !== prevProps.panel) {
      const currentObj = this.scene.getObjectByName(`ad_${prevProps.panel}`);
      currentObj && this.toggleObject({ obj: currentObj, show: false });

      const newObj = this.scene.getObjectByName(`ad_${panel}`);
      newObj && this.toggleObject({ obj: newObj, show: true });
    }
  }

  threeSetup = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    // this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    //CAMERA
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    this.camera.position.set(0, 100, 300);

    //RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.mount.appendChild(this.renderer.domElement);

    //CONTROLS
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.target.set(0, 100, 0);
    // this.controls.update();
    // this.scene.add(this.controls);

    //LIGHT
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    this.scene.add(light);

    //GROUND
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    //GRID
    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);

    this.clock = new THREE.Clock();
  };

  threeLoadingManager = () => {
    const manager = new THREE.LoadingManager();

    manager.onStart = function(url, itemsLoaded, itemsTotal) {
      console.log(
        'Started loading file: ' +
          url +
          '.\nLoaded ' +
          itemsLoaded +
          ' of ' +
          itemsTotal +
          ' files.',
      );
    };

    manager.onLoad = function() {
      console.log('Loading complete!');
    };

    manager.onProgress = function(url, itemsLoaded, itemsTotal) {
      console.log(
        'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
      );
    };

    manager.onError = function(url) {
      console.log('There was an error loading ' + url);
    };

    return manager;
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    this.renderer.render(this.scene, this.camera);
    this.frameId = window.requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }
  };

  toggleObject = ({ obj, show }) => {
    obj.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.visible = show;
      }
    });
  };

  exportGLTF = input => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      metalness: 0.5,
      roughness: 1.0,
      flatShading: true,
    });
    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(70, 10, 10), material);
    sphere.position.set(0, 0, 0);
    sphere.name = 'Sphere';

    const gltfExporter = new GLTFExporter();
    let output;

    const options = {
      trs: false,
      onlyVisible: true,
      truncateDrawRange: false,
      binary: false,
      forceIndices: false,
      forcePowerOfTwoTextures: false,
    };

    gltfExporter.parse(
      input,
      function(result) {
        output = JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: 'text/plain' });
        output = URL.createObjectURL(blob);
        console.log('PARSE - output: ', output);
        this.loadGTLF(output);
      }.bind(this),
      options,
    );
  };

  loadObject = () => {
    const { source, fileType } = this.props;

    if (!fileType) return;

    switch (fileType.toUpperCase()) {
      case 'FBX':
        this.loadFBX(source);
        break;
      case 'GLTF':
        this.loadGTLF(source);
        break;
      default:
        break;
    }
  };

  loadFBX = source => {
    const { setObjSize, panel } = this.props;

    const objAlreadyExists = this.scene.getObjectByName(`ad_${panel}`);
    if (objAlreadyExists) this.scene.remove(objAlreadyExists);

    const onLoad = function(object) {
      object.name = `ad_${panel}`;
      object.position.set(0, 0, 0);
      // this.exportGLTF(object);

      if (object.animations[0]) {
        this.mixer = new THREE.AnimationMixer(object);
        const action = this.mixer.clipAction(object.animations[0]);
        action.play();
      }

      object.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(object);
      panel === 0 && setObjSize(box.getSize());

      this.scene.add(object);
    }.bind(this);

    const onLoading = xhr => {
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    };

    const onLoaderError = error => {
      console.error(error);
    };

    // const loader = new FBXLoader(this.threeLoadingManager());
    const loader = new FBXLoader();
    loader.load(source, onLoad, onLoading, onLoaderError);
  };

  loadGTLF = source => {
    const loader = new GLTFLoader();
    loader.load(
      source,
      gltf => {
        const model = gltf.scene;

        this.mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
          this.mixer.clipAction(clip).play();
        });

        this.scene.add(model);
      },
      xhr => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      error => {
        console.error('An error happened', error);
      },
    );
  };

  reScaleObject = newScale => {
    newScale = 1 + (newScale - 1) / 50;
    const object = this.scene.getObjectByName('ad');
    if (object) {
      object.scale.set(newScale, newScale, newScale);
      const box = new THREE.Box3().setFromObject(object);
      console.log('box.getSize(): ', box.getSize());
    }
  };

  render() {
    const { id } = this.props;
    return (
      <div id={id}>
        <div
          style={{ width: '400px', height: '400px' }}
          ref={mount => {
            this.mount = mount;
          }}
        />
      </div>
    );
  }
}

export default THREEScene;
