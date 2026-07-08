/* ==========================================================================
   d8talytics — three-scene.js
   A drifting field of points connected by faint lines (a stand-in "neural
   network"), rendered full-screen behind the page. Rotates slowly on its
   own, and gently steers toward the mouse position for a parallax feel.
   ========================================================================== */

(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ---- Build a loose "neural network": random points + lines between near neighbors ----
  const NODE_COUNT = window.innerWidth < 640 ? 90 : 170;
  const SPREAD = 6;
  const CONNECT_DISTANCE = 1.7;

  const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    positions.push(
      (Math.random() - 0.5) * SPREAD * 2,
      (Math.random() - 0.5) * SPREAD,
      (Math.random() - 0.5) * SPREAD
    );
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x4f7cff,
    size: 0.045,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);

  // Connect nearby nodes with thin violet lines (computed once — topology is static, only rotation moves).
  const linePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
      const d = Math.hypot(ax - bx, ay - by, az - bz);
      if (d < CONNECT_DISTANCE) {
        linePositions.push(ax, ay, az, bx, by, bz);
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x9b5cff,
    transparent: true,
    opacity: 0.12,
  });
  const lineNetwork = new THREE.LineSegments(lineGeometry, lineMaterial);

  const group = new THREE.Group();
  group.add(pointCloud);
  group.add(lineNetwork);
  scene.add(group);

  // ---- Mouse-driven parallax (lerped for smoothness) ----
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  window.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion) return;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = nx * 0.35;
    targetRotX = ny * 0.2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  const baseSpin = prefersReducedMotion ? 0.01 : 0.045;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // gentle autonomous drift
    group.rotation.y += baseSpin * 0.01;

    // ease toward mouse-driven target rotation
    currentRotX += (targetRotX - currentRotX) * 0.03;
    currentRotY += (targetRotY - currentRotY) * 0.03;
    group.rotation.x = currentRotX;
    group.rotation.y += currentRotY * 0.0025;

    // subtle "breathing" pulse on point size
    pointsMaterial.size = 0.045 + Math.sin(t * 0.6) * 0.008;

    renderer.render(scene, camera);
  }

  animate();
})();
