import "../scss/common.scss";
import * as THREE from "three";
import webGL from "three/examples/jsm/capabilities/WebGL";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class App {
  constructor() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const app = document.getElementById("app");

    this._scene = scene;
    this._renderer = renderer;
    this._app = app;

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._app.appendChild(this._renderer.domElement);

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));

    // if (webGL.isWebGLAvailable()) {
    //   animate();
    // } else {
    //   const warning = webGL.getWebGLErrorMessage();
    //   document.getElementById("app").appendChild(warning);
    // }
  }

  _setupCamera() {
    const width = this._app.clientWidth;
    const height = this._app.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    // ddd
    camera.position.z = 3;
    this._camera = camera;
    this._scene.add(camera);
  }

  _setupLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this._scene.add(ambientLight);

    const color = "#fff";
    const instensity = 1;
    const light = new THREE.DirectionalLight(color, instensity);
    light.position.set(-1, 2, 4);
    this._camera.add(light);
  }

  _setupModel() {
    const rawPositions = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];
    const positions = new Float32Array(rawPositions);

    const rawNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    const normals = new Float32Array(rawNormals);

    const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];
    const colors = new Float32Array(rawColors);

    const rawUVs = [0, 0, 1, 0, 0, 1, 1, 1];
    const uvs = new Float32Array(rawUVs);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // 하나의 정점이 3개의 항목(x, y, z)으로 구성된다는 의미.
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    geometry.setIndex([0, 1, 2, 2, 1, 3]);

    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("/images/texture.jpg");

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      vertexColors: true,
      map: map,
    });

    const box = new THREE.Mesh(geometry, material);
    this._scene.add(box);
  }

  _setupControls() {
    new OrbitControls(this._camera, this._app);
  }

  resize() {
    const width = this._app.clientWidth;
    const height = this._app.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    // time : 렌더링이 처음 시작된 이후 경과된 값으로 밀리세컨드
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
  }
}

window.onload = () => {
  new App();
};
