// WebGL sculpture for the home hero. Loaded with a dynamic import so Three.js and the
// model stay out of the initial bundle.
import * as THREE from "three";
import davidUrl from "../../assets/models/david.bin?url";

/**
 * @param {object} o
 * @param {HTMLCanvasElement} o.canvas
 * @param {boolean} o.reduced            prefers-reduced-motion at mount
 * @param {{ paused: boolean }} o.motion shared with the motion toggle
 * @param {() => void} o.onError         called when WebGL is unavailable
 * @returns {() => void} cleanup
 */
export function mountSculpture({ canvas, reduced, motion, onError }) {
  const ac = new AbortController();
  const signal = ac.signal;
  const cleanups = [];
  const on = (el, type, fn, opts) => el?.addEventListener(type, fn, { ...opts, signal });
  const raf = (loop) => {
    let id = requestAnimationFrame(function tick(t) {
      id = requestAnimationFrame(tick);
      loop(t);
    });
    cleanups.push(() => cancelAnimationFrame(id));
  };
  const observe = (Observer, cb, el, opts) => {
    const o = new Observer(cb, opts);
    o.observe(el);
    cleanups.push(() => o.disconnect());
  };
  const view = { drag: false, targetX: 0, targetY: 0.22 };

  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    cleanups.push(() => renderer.dispose());
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    // Actual scan: SMK, Head of Michelangelo's David. Simplified mesh via Thomas Flynn / jirenmaa.
    scene.add(
      new THREE.HemisphereLight(
        new THREE.Color(1, 1, 1),
        new THREE.Color(0.24, 0.26, 0.3),
        2.2,
      ),
    );
    const light = (color, intensity, x, y, z) => {
      const l = new THREE.DirectionalLight(color, intensity);
      l.position.set(x, y, z);
      scene.add(l);
    };
    light(new THREE.Color(1, 0.96, 0.9), 3.4, -4, 6, 5);
    light(new THREE.Color(0.8, 0.88, 1), 1.15, 4, 2, 1);
    light(new THREE.Color(1, 0.43, 0.18), 2.5, 3, 2, -3);
    const group = new THREE.Group();
    scene.add(group);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.84, 0.85, 0.86),
      metalness: 0.06,
      roughness: 0.73,
      side: THREE.DoubleSide,
    });
    cleanups.push(() => material.dispose());
    let mesh = null;
    fetch(davidUrl, { signal })
      .then((r) => r.arrayBuffer())
      .then((buffer) => {
        if (signal.aborted) return;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(buffer), 3),
        );
        geometry.center();
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        const k = 4.5 / size.y;
        geometry.scale(k, k, k);
        cleanups.push(() => geometry.dispose());
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = 1.1;
        group.add(mesh);
      })
      .catch(() => {});
    camera.position.set(0, 0.05, 9.5);
    camera.lookAt(0, 0, 0);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    observe(ResizeObserver, resize, canvas);
    resize();

    on(canvas, "pointerdown", (e) => {
      view.drag = true;
      canvas.setPointerCapture(e.pointerId);
    });
    on(canvas, "pointerup", () => (view.drag = false));
    on(canvas, "pointercancel", () => (view.drag = false));
    on(canvas, "pointermove", (e) => {
      if (view.drag) {
        view.targetY += e.movementX * 0.008;
        view.targetX += e.movementY * 0.008;
      } else if (!reduced && !motion.paused) {
        const r = canvas.getBoundingClientRect();
        view.targetY = ((e.clientX - r.left) / r.width) * 0.32 + 0.06;
        view.targetX = ((e.clientY - r.top) / r.height) * 0.12 - 0.06;
      }
    });
    on(canvas, "keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        view.targetY +=
          e.key === "ArrowLeft" ? -0.18 : e.key === "ArrowRight" ? 0.18 : 0;
        view.targetX +=
          e.key === "ArrowUp" ? -0.18 : e.key === "ArrowDown" ? 0.18 : 0;
      } else if (e.key === "Home") {
        e.preventDefault();
        view.targetX = 0;
        view.targetY = 0.22;
      }
    });
    let visible = true;
    observe(
      IntersectionObserver,
      (es) => (visible = es[0].isIntersecting),
      canvas,
    );
    raf((t) => {
      if (!visible || document.hidden) return;
      group.rotation.x += (view.targetX - group.rotation.x) * 0.045;
      group.rotation.y += (view.targetY - group.rotation.y) * 0.045;
      if (!motion.paused && !view.drag && !reduced) {
        group.position.y = Math.sin(t * 0.00065) * 0.045;
        if (mesh) mesh.rotation.y = 1.1 + Math.sin(t * 0.00022) * 0.09;
      } else {
        group.position.y = 0;
      }
      renderer.render(scene, camera);
    });
  } catch {
    onError();
  }


  return () => {
    ac.abort();
    cleanups.reverse().forEach((fn) => fn());
  };
}
