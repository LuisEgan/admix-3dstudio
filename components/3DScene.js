import React from 'react';
import * as THREE from 'three';
import TransformControls from 'three-transform-ctrls';
import OrbitControls from 'three-orbitcontrols';
import FBXLoader from 'three-fbx-loader';

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
    source && this.loadFBX(source);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  componentDidUpdate(prevProps, prevState) {
    const { source } = this.props;

    if (source !== prevProps.source) {
      this.loadFBX(source);
    }
  }

  threeSetup = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    //CAMERA
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    this.camera.position.set(100, 200, 300);

    //RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.mount.appendChild(this.renderer.domElement);

    //CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 100, 0);
    this.controls.update();
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
  };

  loadFBX = source => {
    const onLoad = function(object) {
      const mixer = new THREE.AnimationMixer(object);
      const action = mixer.clipAction(object.animations[0]);
      action.play();
      object.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.scene.add(object);
    }.bind(this);

    const onLoaderError = error => {
      console.log(error);
    };

    const loader = new FBXLoader(this.threeLoadingManager());
    loader.load(source, fbx => onLoad(fbx), null, onLoaderError);
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
