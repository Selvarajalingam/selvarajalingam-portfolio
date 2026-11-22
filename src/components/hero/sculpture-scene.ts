import { ACESFilmicToneMapping, Color, Curve, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, SRGBColorSpace, TubeGeometry, Vector3, WebGLRenderer, type WebGLRenderTarget } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Original procedural loop: no downloaded model, HDR map or texture.
class ContinuityCurve extends Curve<Vector3> {
  constructor() { super(); }
  getPoint(t: number, target = new Vector3()) {
    const angle = t * Math.PI * 2;
    const radius = 1.22 + 0.34 * Math.cos(3 * angle);
    return target.set(radius * Math.cos(2 * angle), radius * Math.sin(2 * angle) * 0.9, 0.55 * Math.sin(3 * angle));
  }
}

export function mountSculpture(host: HTMLElement, onFailure: () => void, onReady: () => void): () => void {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.debug.onShaderError = () => { throw new Error("Sculpture shader initialization failed"); };
  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.set(0, 0, 6.8);
  const geometry = new TubeGeometry(new ContinuityCurve(), 180, 0.26, 20, true);
  const material = new MeshStandardMaterial({ color: 0xb6a7d4, metalness: 0.92, roughness: 0.27 });
  const sculpture = new Mesh(geometry, material);
  sculpture.rotation.set(0.25, -0.5, -0.4);
  scene.add(sculpture);
  const key = new DirectionalLight(0xf2ecff, 4);
  key.position.set(-3, 4, 4);
  scene.add(key);
  const violet = new DirectionalLight(0x8b5cf6, 5);
  violet.position.set(3, -1, 2);
  scene.add(violet);
  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  let environment: WebGLRenderTarget;
  try {
    environment = pmrem.fromScene(room, 0.04);
  } catch (error) {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    throw error;
  } finally {
    room.dispose();
    pmrem.dispose();
  }
  scene.environment = environment.texture;

  let disposed = false;
  function render() {
    if (disposed || document.hidden) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const light = document.documentElement.dataset.theme === "light";
    material.color.copy(new Color(light ? 0x8c7caf : 0xb6a7d4));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    onReady();
  }
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  function renderSafely() { try { render(); } catch { onFailure(); } }
  const resize = new ResizeObserver(renderSafely);
  const theme = new MutationObserver(renderSafely);
  function fail(event: Event) { event.preventDefault(); onFailure(); }
  function dispose() {
    if (disposed) return;
    disposed = true;
    resize.disconnect();
    theme.disconnect();
    document.removeEventListener("visibilitychange", renderSafely);
    canvas.removeEventListener("webglcontextlost", fail);
    geometry.dispose();
    material.dispose();
    environment.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  try {
    render();
    resize.observe(host);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", renderSafely);
    canvas.addEventListener("webglcontextlost", fail);
  } catch (error) {
    dispose();
    throw error;
  }
  return dispose;
}
