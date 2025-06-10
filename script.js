// Global variables
let scene, camera, renderer;
let raycaster, mouse;
let clock;
let interactiveObjects = [];
let galaxyGroup; // Group for galaxy objects
let originalCameraPosition = new THREE.Vector3();
let originalCameraLookAt = new THREE.Vector3();
let isDetailView = false;
let particleSystem; // For background particles
let galaxyRings = []; // For decorative rings
let galaxyPortals = []; // For portal effects
let galaxyStarfield; // For animated starfield
let galaxyNebula; // For nebula effect

const MEMECOIN_ADDRESS = "BF5qhqwrcRBNPcZxgVk5YBpw2q1zyJHB8ZgjcmugTX1z";

let projects = [
    {
        name: "Official Solana Address",
        description: `Our official Solana address is: ${MEMECOIN_ADDRESS}. We use this address for all our memecoin creations, ensuring full transparency. You can check all our activities and created tokens using the buttons below.`,
        model: "torus",
        color: 0xff9500,
        infoType: "address",
        solscanLink: `https://solscan.io/account/${MEMECOIN_ADDRESS}`,
        tokensLink: `https://pump.fun/profile/${MEMECOIN_ADDRESS}?include-nsfw=true`,
        specialEffect: "orbit",
        orbitRadius: 1.2,
        orbitSpeed: 1.0,
        isLarge: true
    },
    {
        name: "Long-lasting Solana Tokens",
        description: "Our goal is to create Solana tokens designed to last, with real utility and a strong community focus. We believe in building projects that stand the test of time.",
        model: "dodecahedron",
        color: 0x0071e3,
        infoType: "longevity",
        specialEffect: "glow",
        orbitRadius: 0.8,
        orbitSpeed: 0.9
    },
    {
        name: "New Features Coming Soon",
        description: "Exciting new features are on the way! Stay tuned for updates and innovations that will enhance your experience.",
        model: "custom-crystal",
        color: 0x86b9ff,
        infoType: "comingsoon",
        specialEffect: "pulse",
        orbitRadius: 0.7,
        orbitSpeed: 1.1
    }
]

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initLoader(); 
    initThree();
    
    window.addEventListener('resize', onWindowResize);
    
    // Add event listeners to the canvas container for better interaction
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.addEventListener('mousemove', onMouseMove);
    canvasContainer.addEventListener('click', onClick);
    
    // Add modal close handler
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideProjectInfoModal();
            returnToGalaxyView();
        });
    }
});

// Hide project info modal with fade out
function hideProjectInfoModal() {
    const modal = document.getElementById('project-info-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1';
        }, 300);
    }
}

// Minimal loader function
function initLoader() {
    const loaderElement = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const dynamicMessage = document.getElementById('loader-dynamic-message');
    if (!loaderElement || !loaderText || !dynamicMessage) return;
    loaderText.textContent = 'Off-Token';
    dynamicMessage.textContent = 'Loading the decentralized galaxy...';
    setTimeout(() => {
        loaderElement.classList.add('hidden');
        setTimeout(() => {
            loaderElement.style.display = 'none';
            animateOffTokenTextEnter();
        }, 800);
    }, 1500);
}

// Three.js initialization
function initThree() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Create clock for animations
    clock = new THREE.Clock();
    
    // Create raycaster for interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create galaxy of projects
    createGalaxy();
    createOffTokenText();

    // Store original camera position and lookAt
    originalCameraPosition.copy(camera.position);
    originalCameraLookAt.copy(scene.position); // Assuming camera looks at scene origin initially
    
    // Start animation loop
    animate();
}

// Create galaxy of projects
function createGalaxy() {
    galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Create decorative galaxy rings
    createGalaxyRings();
    
    // Create animated particle system for background
    createParticleSystem();
    
    // Create nebula effect
    createNebulaEffect();
    
    // Create starfield background
    createStarfieldBackground();
    
    // Create portal effects
    createPortalEffects();

    const radius = 15; // Increased radius of the galaxy for more space
    const numProjects = projects.length;
    projectFloatData = [];
    projects.forEach((project, index) => {
        let geometry;
        switch(project.model) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.7, 32, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(0.7, 0.3, 32, 100);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(0.8, 2); // More detailed
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(0.8, 1); // More detailed
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(0.8, 1); // More detailed
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(0.8, 1); // More detailed
                break;
            case 'custom-crystal':
                // Create a custom crystal shape
                geometry = new THREE.CylinderGeometry(0, 0.8, 1.6, 6, 1);
                break;
            case 'custom-shield':
                // Create a shield-like shape
                geometry = new THREE.ExtrudeGeometry(
                    new THREE.Shape()
                        .moveTo(0, 0.8)
                        .lineTo(0.7, 0.4)
                        .lineTo(0.7, -0.6)
                        .lineTo(0, -0.8)
                        .lineTo(-0.7, -0.6)
                        .lineTo(-0.7, 0.4)
                        .lineTo(0, 0.8),
                    { depth: 0.2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 }
                );
                break;
            case 'custom-atom':
                // Create an atom-like shape with rings
                const atomGroup = new THREE.Group();
                const core = new THREE.SphereGeometry(0.4, 32, 32);
                const coreMesh = new THREE.Mesh(core, new THREE.MeshPhongMaterial({
                    color: project.color,
                    emissive: project.color,
                    emissiveIntensity: 0.5,
                    shininess: 100
                }));
                atomGroup.add(coreMesh);
                
                // Add rings in different orientations
                for (let i = 0; i < 3; i++) {
                    const ring = new THREE.TorusGeometry(0.7, 0.05, 16, 100);
                    const ringMesh = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({
                        color: project.color,
                        transparent: true,
                        opacity: 0.7
                    }));
                    ringMesh.rotation.x = Math.PI / 2 * i;
                    ringMesh.rotation.y = Math.PI / 4 * i;
                    atomGroup.add(ringMesh);
                }
                
                // Return early as we've already created the full object
                const atomWorldPos = new THREE.Vector3();
                const angle = (index / numProjects) * Math.PI * 8; // More spiral loops
                const spiralFactor = 0.8 + (index / numProjects) * 0.7; // Tighter spiral for inner objects
                const x = Math.cos(angle) * radius * spiralFactor;
                const y = (Math.sin(index * 0.9) * 4) + (Math.random() - 0.5) * 3; // More varied height
                const z = Math.sin(angle) * radius * spiralFactor;
                atomGroup.position.set(x, y, z);
                
                // Add random rotation
                atomGroup.rotation.x = Math.random() * Math.PI;
                atomGroup.rotation.y = Math.random() * Math.PI;
                atomGroup.rotation.z = Math.random() * Math.PI;
                
                atomGroup.userData = {
                    type: 'project',
                    action: 'show_project_info',
                    projectIndex: index,
                    ...project // Spread project data into userData
                };
                
                galaxyGroup.add(atomGroup);
                interactiveObjects.push(coreMesh); // Make the core interactive
                return; // Skip the rest of the function for this special case
                
            case 'custom-leaf':
                // Create a leaf-like shape
                const leafShape = new THREE.Shape();
                leafShape.moveTo(0, 0.8);
                leafShape.bezierCurveTo(0.5, 0.5, 0.8, 0, 0, -0.8);
                leafShape.bezierCurveTo(-0.8, 0, -0.5, 0.5, 0, 0.8);
                geometry = new THREE.ExtrudeGeometry(leafShape, {
                    depth: 0.1,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.05
                });
                break;
            default:
                geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        }

        // Create more advanced materials based on special effect
        let material;
        switch(project.specialEffect) {
            case 'glow':
                material = new THREE.MeshPhongMaterial({
                    color: project.color,
                    emissive: project.color,
                    emissiveIntensity: 0.6,
                    shininess: 100,
                    specular: 0xffffff,
                    transparent: true,
                    opacity: 0.9
                });
                break;
            case 'orbit':
                material = new THREE.MeshStandardMaterial({
                    color: project.color,
                    metalness: 0.8,
                    roughness: 0.2,
                    emissive: project.color,
                    emissiveIntensity: 0.3
                });
                break;
            case 'pulse':
                material = new THREE.MeshPhysicalMaterial({
                    color: project.color,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,
                    metalness: 0.5,
                    roughness: 0.5,
                    emissive: project.color,
                    emissiveIntensity: 0.2
                });
                break;
            default:
                material = new THREE.MeshPhongMaterial({
                    color: project.color,
                    emissive: project.color,
                    emissiveIntensity: 0.3,
                    shininess: 80,
                    specular: 0xffffff
                });
        }

        const mesh = new THREE.Mesh(geometry, material);

        // Position objects in a more interesting spiral galaxy pattern
        const angle = (index / numProjects) * Math.PI * 6; // More spiral loops
        const spiralFactor = 0.8 + (index / numProjects) * 0.5; // Tighter spiral for inner objects
        const x = Math.cos(angle) * radius * spiralFactor;
        const y = (Math.sin(index * 0.7) * 3) + (Math.random() - 0.5) * 2; // More varied height
        const z = Math.sin(angle) * radius * spiralFactor;
        mesh.position.set(x, y, z);
        
        // Add random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        // Create a group for the project to add effects
        const projectGroup = new THREE.Group();
        projectGroup.add(mesh);
        
        // Add orbital ring for some projects
        if (project.specialEffect === 'orbit') {
            const ringGeometry = new THREE.RingGeometry(1, 1.05, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: project.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            projectGroup.add(ring);
        }

        projectGroup.userData = {
            type: 'project',
            action: 'show_project_info',
            projectIndex: index,
            ...project // Spread project data into userData
        };

        galaxyGroup.add(projectGroup);
        interactiveObjects.push(mesh); // Only the main mesh is interactive

        // Save base position and random float params for each project
        const basePos = projectGroup.position.clone();
        projectFloatData.push({
            group: projectGroup,
            basePos: basePos,
            floatSpeedX: 0.2 + Math.random() * 0.2,
            floatSpeedY: 0.15 + Math.random() * 0.2,
            floatSpeedZ: 0.18 + Math.random() * 0.2,
            floatAmpX: 1.2 + Math.random() * 0.7,
            floatAmpY: 0.7 + Math.random() * 0.5,
            floatAmpZ: 1.2 + Math.random() * 0.7
        });
    });

    // Add more stars/dust to the galaxy background with varied sizes
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starSizes = [];
    const starColors = [];
    
    for (let i = 0; i < 8000; i++) {
        starPositions.push(
            (Math.random() - 0.5) * 70,
            (Math.random() - 0.5) * 70,
            (Math.random() - 0.5) * 70
        );
        
        // Varied sizes for stars
        starSizes.push(Math.random() * 0.08 + 0.02);
        
        // Varied colors for stars
        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.2, 0.8);
        starColors.push(color.r, color.g, color.b);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Create decorative galaxy rings
function createGalaxyRings() {
    const ringColors = [0x0071e3, 0xff9500, 0x2ecc71, 0x9b59b6, 0xe74c3c];
    
    for (let i = 0; i < 5; i++) {
        const radius = 18 + i * 6;
        const thickness = 0.1 + (i * 0.05);
        const ringGeometry = new THREE.RingGeometry(radius, radius + thickness, 128);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: ringColors[i],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.15 + (Math.random() * 0.1),
            blending: THREE.AdditiveBlending
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.y = Math.random() * Math.PI;
        ring.rotation.z = Math.random() * 0.2;
        
        // Add slight tilt for more dynamic appearance
        ring.rotation.x += (Math.random() - 0.5) * 0.2;
        
        galaxyGroup.add(ring);
        galaxyRings.push(ring);
    }
    
    // Add some decorative dust along the rings
    for (let i = 0; i < 3; i++) {
        const radius = 20 + i * 7;
        const particleCount = 500;
        const ringDustGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        
        for (let j = 0; j < particleCount; j++) {
            const angle = Math.random() * Math.PI * 2;
            const radiusVariation = (Math.random() - 0.5) * 2;
            const x = Math.cos(angle) * (radius + radiusVariation);
            const y = (Math.random() - 0.5) * 0.5; // Slight vertical spread
            const z = Math.sin(angle) * (radius + radiusVariation);
            
            positions.push(x, y, z);
            
            // Use the ring color with slight variations
            const color = new THREE.Color(ringColors[i % ringColors.length]);
            color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
            colors.push(color.r, color.g, color.b);
            
            sizes.push(Math.random() * 0.2 + 0.05);
        }
        
        ringDustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        ringDustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        ringDustGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const ringDustMaterial = new THREE.PointsMaterial({
            size: 0.15,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const ringDust = new THREE.Points(ringDustGeometry, ringDustMaterial);
        galaxyGroup.add(ringDust);
    }
}

// Create animated particle system
function createParticleSystem() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    
    const positions = [];
    const velocities = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Position particles in a spherical volume
        const radius = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        // Random velocities for animation
        velocities.push(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        );
        
        // Random colors with blue/purple hue
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.6, 0.8, 0.8);
        colors.push(color.r, color.g, color.b);
        
        // Random sizes
        sizes.push(Math.random() * 0.5 + 0.1);
    }
    
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

function createOffTokenText() {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry('Off-Token', {
            font: font,
            size: 1.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });
        textGeometry.center(); // Center the text

        const textMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff, 
            emissive: 0xaaaaaa,
            specular: 0xffffff,
            shininess: 100
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 5, -15); // Position it further back and higher up
        textMesh.scale.set(0.01, 0.01, 0.01); // Start very small
        textMesh.name = "OffTokenText";
        scene.add(textMesh);
    });
}

function animateOffTokenTextEnter() {
    const offTokenText = scene.getObjectByName("OffTokenText");
    if (offTokenText) {
        gsap.to(offTokenText.scale, { x: 1, y: 1, z: 1, duration: 3, ease: "elastic.out(1, 0.5)" });
        gsap.to(offTokenText.rotation, { y: Math.PI * 2, duration: 20, repeat: -1, ease: "none" }); // Slow continuous rotation
    }
}

// Functions for initProjects, createProjectVisual, createApproachVisualization are removed as they are part of the old design.

// Create nebula effect
function createNebulaEffect() {
    // Create a volumetric nebula using particle system
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaCount = 1000;
    const nebulaPositions = [];
    const nebulaColors = [];
    const nebulaSizes = [];
    
    // Create nebula in a cloud-like formation
    for (let i = 0; i < nebulaCount; i++) {
        // Use gaussian distribution for more natural cloud appearance
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 25 + (Math.random() * 15);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // Flatten vertically
        const z = radius * Math.cos(phi);
        
        nebulaPositions.push(x, y, z);
        
        // Create beautiful nebula colors (blues, purples, pinks)
        const hue = 0.6 + (Math.random() * 0.2); // Blue to purple range
        const saturation = 0.5 + (Math.random() * 0.5);
        const lightness = 0.5 + (Math.random() * 0.3);
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        nebulaColors.push(color.r, color.g, color.b);
        
        // Varied sizes for depth effect
        nebulaSizes.push(Math.random() * 2 + 0.5);
    }
    
    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.Float32BufferAttribute(nebulaColors, 3));
    nebulaGeometry.setAttribute('size', new THREE.Float32BufferAttribute(nebulaSizes, 1));
    
    const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png') }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            void main() {
                vColor = color;
                vec3 pos = position;
                // Subtle movement
                pos.x += sin(time * 0.1 + position.z * 0.05) * 0.2;
                pos.y += cos(time * 0.15 + position.x * 0.05) * 0.1;
                pos.z += sin(time * 0.05 + position.y * 0.05) * 0.2;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 0.4);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    galaxyNebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(galaxyNebula);
}

// Create starfield background
function createStarfieldBackground() {
    const starfieldGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starPositions = [];
    const starColors = [];
    const starSizes = [];
    
    // Create stars in a spherical distribution
    for (let i = 0; i < starCount; i++) {
        const radius = 80 + Math.random() * 40; // Far background
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        starPositions.push(x, y, z);
        
        // Star colors with slight variations
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.6) {
            // White/blue stars (most common)
            color = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.2, 0.8 + Math.random() * 0.2);
        } else if (colorChoice < 0.8) {
            // Yellow/orange stars
            color = new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.7, 0.8);
        } else if (colorChoice < 0.95) {
            // Red stars
            color = new THREE.Color().setHSL(0.0 + Math.random() * 0.05, 0.8, 0.7);
        } else {
            // Blue giants (rare)
            color = new THREE.Color().setHSL(0.7 + Math.random() * 0.1, 0.9, 0.9);
        }
        
        starColors.push(color.r, color.g, color.b);
        
        // Star sizes with occasional larger stars
        const size = Math.random() < 0.98 ? Math.random() * 0.5 + 0.1 : Math.random() * 2 + 1;
        starSizes.push(size);
    }
    
    starfieldGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starfieldGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starfieldGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    
    const starfieldMaterial = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        opacity: 1.0,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    galaxyStarfield = new THREE.Points(starfieldGeometry, starfieldMaterial);
    scene.add(galaxyStarfield);
}

// Create portal effects
function createPortalEffects() {
    // Create a few portal-like effects at strategic locations
    const portalLocations = [
        new THREE.Vector3(25, 5, -15),
        new THREE.Vector3(-20, -8, 10),
        new THREE.Vector3(5, 15, 25)
    ];
    
    portalLocations.forEach((position, index) => {
        // Create a torus for the portal rim
        const portalRimGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
        const portalRimMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const portalRim = new THREE.Mesh(portalRimGeometry, portalRimMaterial);
        portalRim.position.copy(position);
        portalRim.lookAt(scene.position); // Face toward center
        
        // Create portal interior (disc)
        const portalDiscGeometry = new THREE.CircleGeometry(1.8, 32);
        const portalDiscMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const portalDisc = new THREE.Mesh(portalDiscGeometry, portalDiscMaterial);
        portalDisc.position.copy(position);
        portalDisc.position.z += 0.01; // Slight offset to avoid z-fighting
        portalDisc.lookAt(scene.position);
        
        // Create energy particles around the portal
        const particleCount = 200;
        const portalParticlesGeometry = new THREE.BufferGeometry();
        const particlePositions = [];
        const particleColors = [];
        const particleSizes = [];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.5 + Math.random() * 1.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 0.5;
            
            particlePositions.push(x, y, z);
            
            // Portal colors based on index
            let color;
            if (index === 0) {
                color = new THREE.Color().setHSL(0.6, 0.8, 0.5 + Math.random() * 0.5); // Blue
            } else if (index === 1) {
                color = new THREE.Color().setHSL(0.3, 0.8, 0.5 + Math.random() * 0.5); // Green
            } else {
                color = new THREE.Color().setHSL(0.8, 0.8, 0.5 + Math.random() * 0.5); // Purple
            }
            
            particleColors.push(color.r, color.g, color.b);
            particleSizes.push(Math.random() * 0.2 + 0.05);
        }
        
        portalParticlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        portalParticlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
        portalParticlesGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
        
        const portalParticlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const portalParticles = new THREE.Points(portalParticlesGeometry, portalParticlesMaterial);
        
        // Create a group for the portal
        const portalGroup = new THREE.Group();
        portalGroup.add(portalRim);
        portalGroup.add(portalDisc);
        portalGroup.add(portalParticles);
        portalGroup.position.copy(position);
        
        scene.add(portalGroup);
        galaxyPortals.push({
            group: portalGroup,
            rim: portalRim,
            disc: portalDisc,
            particles: portalParticles,
            initialPosition: position.clone()
        });
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Rotate the galaxy
    if (galaxyGroup) {
        galaxyGroup.rotation.y += 0.0002; // Slower, more majestic rotation
    }

    // Animate galaxy rings
    galaxyRings.forEach((ring, index) => {
        ring.rotation.z += 0.0001 * (index % 2 === 0 ? 1 : -1); // Alternate directions
        // Add subtle wobble
        ring.rotation.x = Math.sin(time * 0.1 + index) * 0.02 + Math.PI / 2;
    });
    
    // Animate nebula effect
    if (galaxyNebula && galaxyNebula.material.uniforms) {
        galaxyNebula.material.uniforms.time.value = time;
        galaxyNebula.rotation.y = time * 0.01;
    }
    
    // Animate starfield with subtle twinkle
    if (galaxyStarfield) {
        const sizes = galaxyStarfield.geometry.attributes.size;
        for (let i = 0; i < sizes.count; i++) {
            if (Math.random() < 0.001) { // Only change a few stars each frame
                const originalSize = sizes.array[i];
                sizes.array[i] = originalSize * (0.8 + Math.random() * 0.4);
            }
        }
        sizes.needsUpdate = true;
        galaxyStarfield.rotation.y = time * 0.0001; // Very slow rotation
    }
    
    // Animate portal effects
    galaxyPortals.forEach((portal, index) => {
        // Rotate the rim
        portal.rim.rotation.z += 0.01;
        
        // Pulse the portal
        const pulseScale = 1 + Math.sin(time * (0.5 + index * 0.2)) * 0.05;
        portal.group.scale.set(pulseScale, pulseScale, 1);
        
        // Make the portal float slightly
        portal.group.position.y = portal.initialPosition.y + Math.sin(time * 0.5 + index) * 0.3;
        
        // Rotate the particles
        if (portal.particles) {
            portal.particles.rotation.z -= 0.005;
        }
    });

    // Animate particle system
    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.geometry.attributes.velocity.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i+1] += velocities[i+1];
            positions[i+2] += velocities[i+2];
            
            // Reset particles that drift too far
            const distance = Math.sqrt(
                positions[i] * positions[i] + 
                positions[i+1] * positions[i+1] + 
                positions[i+2] * positions[i+2]
            );
            
            if (distance > 60) {
                const factor = 20 / distance;
                positions[i] *= factor;
                positions[i+1] *= factor;
                positions[i+2] *= factor;
            }
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Animate individual objects in the galaxy with special effects
    galaxyGroup.children.forEach(projectGroup => {
        if (projectGroup.userData && projectGroup.userData.type === 'project') {
            const mesh = projectGroup.children[0]; // Main mesh is the first child
            const specialEffect = projectGroup.userData.specialEffect;
            const index = projectGroup.userData.projectIndex;
            const orbitRadius = projectGroup.userData.orbitRadius || 0.5;
            const orbitSpeed = projectGroup.userData.orbitSpeed || 1.0;
            
            switch(specialEffect) {
                case 'glow':
                    // Enhanced pulsating glow effect
                    const glowIntensity = 0.3 + Math.sin(time * 2) * 0.3;
                    mesh.material.emissiveIntensity = glowIntensity;
                    // Add subtle rotation
                    mesh.rotation.y += 0.005;
                    mesh.rotation.z += 0.002;
                    break;
                    
                case 'orbit':
                    // Enhanced orbital rotation with satellite
                    projectGroup.rotation.y += 0.01 * orbitSpeed;
                    if (projectGroup.children.length > 1) {
                        const ring = projectGroup.children[1];
                        ring.scale.set(
                            1 + Math.sin(time) * 0.15,
                            1 + Math.sin(time) * 0.15,
                            1
                        );
                        ring.rotation.z += 0.01;
                    }
                    break;
                    
                case 'pulse':
                    // Enhanced size pulsing with color shift
                    const scale = 1 + Math.sin(time * 3) * 0.15;
                    mesh.scale.set(scale, scale, scale);
                    if (mesh.material.emissive) {
                        const hue = (time * 0.05) % 1;
                        mesh.material.emissive.setHSL(hue, 0.7, 0.5);
                    }
                    break;
                    
                case 'rotate':
                    // Enhanced complex rotation
                    mesh.rotation.x += 0.01;
                    mesh.rotation.y += 0.02;
                    mesh.rotation.z += 0.005;
                    // Add wobble
                    mesh.position.y = Math.sin(time * 1.5) * 0.1;
                    break;
                    
                case 'bounce':
                    // Enhanced bouncing effect with rotation
                    mesh.position.y = Math.sin(time * 2) * 0.3;
                    mesh.rotation.x = Math.sin(time) * 0.2;
                    mesh.rotation.z = Math.cos(time * 1.5) * 0.2;
                    break;
                    
                case 'spin':
                    // Enhanced spinning effect with wobble
                    mesh.rotation.y += 0.03;
                    mesh.rotation.x = Math.sin(time) * 0.1;
                    mesh.position.y = Math.sin(time * 2) * 0.1;
                    break;
                    
                case 'float':
                    // Floating effect for crystal
                    mesh.position.y = Math.sin(time * 1.2) * 0.2;
                    mesh.rotation.y += 0.01;
                    mesh.rotation.z = Math.sin(time * 0.5) * 0.1;
                    break;
                    
                case 'shield':
                    // Shield effect with pulsing
                    mesh.rotation.y += 0.02;
                    const shieldScale = 1 + Math.sin(time * 2.5) * 0.08;
                    mesh.scale.set(shieldScale, shieldScale, shieldScale);
                    if (mesh.material.opacity) {
                        mesh.material.opacity = 0.7 + Math.sin(time * 3) * 0.2;
                    }
                    break;
                    
                case 'atom':
                    // Atom effect with rotating rings
                    if (projectGroup.children.length > 1) {
                        for (let i = 1; i < projectGroup.children.length; i++) {
                            projectGroup.children[i].rotation.x += 0.01 * (i % 2 ? 1 : -1);
                            projectGroup.children[i].rotation.y += 0.01 * (i % 3 ? 1 : -1);
                        }
                    }
                    break;
                    
                case 'grow':
                    // Growing/shrinking effect for leaf
                    const growScale = 1 + Math.sin(time * 1.5) * 0.15;
                    mesh.scale.set(growScale, growScale, growScale * 0.5); // Flatten in z
                    mesh.rotation.z += 0.01;
                    break;
                    
                default:
                    // Default animation
                    mesh.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
                    mesh.rotation.y += 0.002;
            }
            
            // Add orbital motion to all projects EXCEPT the first 3
            if (!isDetailView && orbitRadius > 0 && index >= 3) {
                const orbitAngle = time * 0.2 * orbitSpeed + index * (Math.PI * 2 / projects.length);
                const orbitX = Math.cos(orbitAngle) * orbitRadius * 0.1;
                const orbitZ = Math.sin(orbitAngle) * orbitRadius * 0.1;
                projectGroup.position.x += (orbitX - projectGroup.position.x) * 0.01;
                projectGroup.position.z += (orbitZ - projectGroup.position.z) * 0.01;
            }
        }
    });
    
    // Fluctuating floating movement for each project (keep in view)
    if (!isDetailView && projectFloatData && projectFloatData.length) {
        projectFloatData.forEach((data, i) => {
            const group = data.group;
            // Only for the first 3 projects (the main ones): always keep in view
            if (i < 3) {
                // Calculate floating offset
                const fx = Math.sin(time * data.floatSpeedX + i) * data.floatAmpX;
                const fy = Math.cos(time * data.floatSpeedY + i * 2) * data.floatAmpY;
                const fz = Math.sin(time * data.floatSpeedZ + i * 3) * data.floatAmpZ;
                // New candidate position
                let newPos = data.basePos.clone().add(new THREE.Vector3(fx, fy, fz));
                // Clamp to camera frustum (keep in view)
                let ndc = newPos.clone().project(camera);
                ndc.x = Math.max(-0.85, Math.min(0.85, ndc.x));
                ndc.y = Math.max(-0.85, Math.min(0.85, ndc.y));
                let clamped = ndc.unproject(camera);
                group.position.copy(clamped);
            } else {
                // For all other objects, allow normal orbital motion (no forced clamping)
                // (No action needed here, handled by their own animation logic)
            }
        });
    }
    
    // Render scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// onScroll function is removed as the new design is a single 3D scene.

// Handle mouse move
function onMouseMove(event) {
    if (isDetailView) return;

    // Calculate mouse position relative to the canvas container
    const canvasContainer = document.getElementById('canvas-container');
    const rect = canvasContainer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with interactive objects
    const intersects = raycaster.intersectObjects(interactiveObjects, true);
    
    // Reset all objects
    interactiveObjects.forEach(obj => {
        if (obj.material && obj.material.emissive) {
            obj.material.emissive.setHex(obj.userData.originalEmissive || 0x000000);
            obj.material.emissiveIntensity = 0.3;
        }
    });

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const projectData = findProjectData(intersectedObject);

        if (projectData) {
            document.body.style.cursor = 'pointer';
            if (intersectedObject.material && intersectedObject.material.emissive) {
                intersectedObject.userData.originalEmissive = intersectedObject.material.emissive.getHex();
                intersectedObject.material.emissive.setHex(0xff0000);
                intersectedObject.material.emissiveIntensity = 1.0;
                
                // Add a subtle scale animation
                gsap.to(intersectedObject.scale, {
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    } else {
        document.body.style.cursor = 'default';
        // Reset all object scales
        interactiveObjects.forEach(obj => {
            gsap.to(obj.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }
}

// initScrollAnimations and animateSections are removed as they are not needed for the galaxy view.

// Helper function to find project data
function findProjectData(object) {
    // First check the object itself
    if (object.userData && object.userData.type === 'project') {
        return object.userData;
    }
    
    // Then check its parent group
    if (object.parent && object.parent.userData && object.parent.userData.type === 'project') {
        return object.parent.userData;
    }
    
    // Finally check if it's part of a project group (for complex objects like atoms)
    let current = object;
    while (current.parent) {
        if (current.userData && current.userData.type === 'project') {
            return current.userData;
        }
        current = current.parent;
    }
    
    return null;
}

// Handle click events
function onClick(event) {
    event.preventDefault();
    
    // Calculate mouse position relative to the canvas container
    const canvasContainer = document.getElementById('canvas-container');
    const rect = canvasContainer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster and check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const projectData = findProjectData(intersectedObject);

        if (projectData) {
            // Add click feedback animation
            gsap.to(intersectedObject.scale, {
                x: 1.4,
                y: 1.4,
                z: 1.4,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    showProjectInfoModal(projectData);
                    focusOnProject(intersectedObject);
                }
            });
        }
    } else if (isDetailView) {
        hideProjectInfoModal();
        returnToGalaxyView();
    }
}

function focusOnProject(projectObject) {
    isDetailView = true;
    const targetPosition = new THREE.Vector3();
    projectObject.getWorldPosition(targetPosition);

    // Store original object rotation
    const originalRotation = projectObject.rotation.clone();

    // Calculate a camera position slightly offset from the object
    const offset = new THREE.Vector3(2, 1, 3); // Adjusted for better viewing angle
    const cameraTargetPosition = targetPosition.clone().add(offset);

    // Animate camera movement
    gsap.to(camera.position, {
        x: cameraTargetPosition.x,
        y: cameraTargetPosition.y,
        z: cameraTargetPosition.z,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: function() {
            camera.lookAt(targetPosition);
        }
    });

    // Animate object rotation
    gsap.to(projectObject.rotation, {
        x: originalRotation.x,
        y: originalRotation.y + Math.PI * 2,
        z: originalRotation.z,
        duration: 2,
        ease: "power2.inOut"
    });

    // Add a subtle floating animation
    gsap.to(projectObject.position, {
        y: projectObject.position.y + 0.5,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
    });

    // Highlight the object
    if (projectObject.material) {
        gsap.to(projectObject.material, {
            emissiveIntensity: 1,
            duration: 1,
            ease: "power2.out"
        });
    }
}

function returnToGalaxyView() {
    isDetailView = false;
    const modal = document.getElementById('project-info-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    gsap.to(camera.position, {
        x: originalCameraPosition.x,
        y: originalCameraPosition.y,
        z: originalCameraPosition.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function() {
            // Smoothly transition lookAt back to the center of the galaxy or original lookAt point
            const lookAtTarget = originalCameraLookAt.clone().lerp(camera.position, 0.05); // Adjust lerp factor for smoothness
            camera.lookAt(lookAtTarget);
        },
        onComplete: function() {
            camera.lookAt(originalCameraLookAt); // Ensure it ends up looking at the exact original point
        }
    });
}

// Show project info modal
function showProjectInfoModal(projectData) {
    const modal = document.getElementById('project-info-modal');
    if (!modal) return;
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;
    // Scegli una icona moderna coerente
    let iconHtml = '';
    switch (projectData.infoType) {
        case 'address': iconHtml = '<span class="simple-modal-icon">🔗</span>'; break;
        case 'longevity': iconHtml = '<span class="simple-modal-icon">⏳</span>'; break;
        case 'comingsoon': iconHtml = '<span class="simple-modal-icon">✨</span>'; break;
        default: iconHtml = '<span class="simple-modal-icon">🌟</span>';
    }
    // Struttura semplice e coerente
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="simple-modal-header">
            ${iconHtml}
            <h2>${projectData.name}</h2>
        </div>
        <div class="simple-modal-content">
            <p>${projectData.description}</p>
            ${projectData.infoType === 'address' ? `
                <div class="simple-action-buttons">
                    <a href="${projectData.solscanLink}" target="_blank" class="simple-action-button">View Transactions</a>
                    <a href="${projectData.tokensLink}" target="_blank" class="simple-action-button">View Tokens</a>
                </div>
            ` : ''}
        </div>
    `;
    // Close button event
    const closeBtn = modalContent.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideProjectInfoModal();
            returnToGalaxyView();
        });
    }
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('visible'), 10);
}