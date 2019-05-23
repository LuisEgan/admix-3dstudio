import React from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import GLTFExporter from 'three-gltf-exporter';
import TransformControls from 'three-transform-ctrls';
import OrbitControls from 'three-orbitcontrols';
import { FBXLoader } from '../lib/three.modules/FBXLoader';
import isEqual from 'lodash/isEqual';
import { PANELS } from '../lib/utils/constants';

class THREEScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: null,
      loadError: {},
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
    const { source, objectScale, panel, panelPreview3D } = this.props;

    if (source !== prevProps.source) {
      this.loadObject();
    }

    if (!isEqual(objectScale, prevProps.objectScale)) {
      this.reScaleObject(objectScale);
    }

    if (panel !== prevProps.panel || panelPreview3D !== prevProps.panelPreview3D) {
      const panelChanged = panel !== prevProps.panel;

      // * Destroy the preview according to the panel that changed
      let destroyObjOfPanel = panelChanged ? prevProps.panel : prevProps.panelPreview3D;
      let showObjOfPanel = panel;

      // * Always show panelPreview3D when at the DOWNLOAD panel
      if (panel === PANELS.DOWNLOAD) {
        showObjOfPanel = panelPreview3D;
      }

      // * When leaving the DOWNLOAD panel
      if (panelChanged && prevProps.panel === PANELS.DOWNLOAD) {
        destroyObjOfPanel = panelPreview3D;
      }

      const currentObj = this.scene.getObjectByName(`ad_${destroyObjOfPanel}`);
      currentObj && this.toggleObject({ obj: currentObj, show: false });

      const newObj = this.scene.getObjectByName(`ad_${showObjOfPanel}`);
      if (newObj) {
        this.toggleObject({ obj: newObj, show: true });
        this.fitCameraToObject(newObj);
      }
    }
  }

  onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer && this.renderer.setSize(width, height);
  };

  threeSetup = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    // this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    //CAMERA
    this.camera = new THREE.PerspectiveCamera(45, width / height);
    this.camera.position.set(0, 100, 300);
    this.cameraOriginalPos = new THREE.Vector3(0, 100, 300);

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

    //LIGHT
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 2000, 100);
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
    const grid = new THREE.GridHelper(20000, 200, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);

    this.clock = new THREE.Clock();

    window.addEventListener('resize', this.onWindowResize, false);
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
    const onLoad = function(object) {
      this.loadedObject = object;
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

      // const box = new THREE.Box3().setFromObject(object);
      // panel === 0 && setObjSize(box.getSize());

      this.scene.add(object);
      this.fitCameraToObject(object);
      setLoading3Dmodel(false);
      this.setState({ loadError: { [panel]: false } });
    }.bind(this);

    const onLoading = xhr => {
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    };

    const onLoaderError = function(error) {
      console.error(error);
      setLoading3Dmodel(false);
      this.setState({ loadError: { [panel]: true } });
    }.bind(this);

    const { setObjSize, panel, setLoading3Dmodel } = this.props;
    setLoading3Dmodel(true);

    const objAlreadyExists = this.scene.getObjectByName(`ad_${panel}`);
    if (objAlreadyExists) this.scene.remove(objAlreadyExists);

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
    }
  };

  fitCameraToObject = (object, offset, controls) => {
    offset = offset || 1.5;

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);

    let center = new THREE.Vector3();
    center = boundingBox.getCenter(center);

    let size = new THREE.Vector3();
    size = boundingBox.getSize(size);

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z).toFixed(1);
    const max10percent = maxDim * 0.1;
    const minDim = Math.min(size.x, size.y, size.z).toFixed(1);
    const fov = (this.camera.fov * (Math.PI / 180)).toFixed(1);
    let cameraZ = maxDim / 2 / Math.tan(fov / 2);

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    if (minDim < max10percent) {
      this.camera.position.y = this.camera.position.y + max10percent * 5;
    } else {
      this.camera.position.y = this.cameraOriginalPos.y;
    }

    this.scene.updateMatrixWorld(); //Update world positions
    const objectWorldPosition = new THREE.Vector3();
    objectWorldPosition.setFromMatrixPosition(object.matrixWorld);

    const directionVector = this.camera.position.sub(objectWorldPosition); //Get vector from camera to object
    const unitDirectionVector = directionVector.normalize(); // Convert to unit vector
    const cameraNewPos = unitDirectionVector.multiplyScalar(cameraZ); //Multiply unit vector times cameraZ distance
    this.camera.position.set(cameraNewPos.x, cameraNewPos.y, cameraNewPos.z);
    this.camera.lookAt(objectWorldPosition); //Look at object

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();

    if (controls) {
      // set camera to rotate around center of loaded object
      controls.target = center;

      // prevent camera from zooming out far enough to create far plane cutoff
      controls.maxDistance = cameraToFarEdge * 2;

      controls.saveState();
    } else {
      this.camera.lookAt(center);
    }
  };

  render() {
    const { id, panel } = this.props;
    const { loadError } = this.state;
    return (
      <div id={id}>
        {panel === PANELS.MODEL && !this.loadedObject && !loadError[panel] && (
          <div id="webgl-placeholder" className="unselectable">
            Create your 3D ad in 5 easy steps
          </div>
        )}
        {loadError[panel] && (
          <div id="webgl-error" className="asyncError mbs">
            FBX file could not be shown but it’s been uploaded successfully
          </div>
        )}
        <div
          ref={mount => {
            this.mount = mount;
          }}
          style={{ display: 'flex' }}
          className={panel !== PANELS.DOWNLOAD ? 'fullscreen-canvas' : 'medium-canvas'}
        />
      </div>
    );
  }
}

export default THREEScene;
