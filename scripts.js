document.addEventListener("DOMContentLoaded", () => {
    // Xử lý active cho thanh điều hướng
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Three.js setup for 3D blocks in index.html
    const canvas = document.querySelector('#three-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Create cubes
        const cubes = [];
        const cubeCount = 50;
        const cubeSize = 0.7;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        for (let i = 0; i < cubeCount; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 50%)`),
                shininess: 100
            });
            const cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            );
            cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(cube);
            cubes.push(cube);
        }

        // Target positions for sphere
        const radius = 3;
        const targetPositions = [];
        for (let i = 0; i < cubeCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / cubeCount);
            const theta = Math.sqrt(cubeCount * Math.PI) * phi;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            targetPositions.push([x, y, z]);
        }

        // Animation
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.02;

            cubes.forEach((cube, i) => {
                if (time < 7) {
                    // Move to sphere positions
                    const target = targetPositions[i % targetPositions.length];
                    cube.position.lerp(new THREE.Vector3(...target), 0.05);
                    cube.rotation.x += 0.02;
                    cube.rotation.y += 0.02;
                } else {
                    // Rotate the sphere
                    cube.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01);
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                    // Change color dynamically
                    cube.material.color.setHSL((Math.sin(time * 0.1 + i) + 1) / 2, 0.7, 0.5);
                }
            });

            camera.position.z = 10;
            renderer.render(scene, camera);
        }
        animate();
    }

    // Tab functionality for products
    const tabButtons = document.querySelectorAll('.tab-button');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.querySelector('#search');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const tab = button.getAttribute('data-tab');
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (tab === 'all' || tab === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            productCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Popup functionality
    const popup = document.querySelector('#product-popup');
    const popupTitle = document.querySelector('#popup-title');
    const popupNote = document.querySelector('#popup-note');
    const popupRedirect = document.querySelector('#popup-redirect');
    const popupCopy = document.querySelector('#popup-copy');
    const closePopup = document.querySelector('#close-popup');
    const overlay = document.querySelector('#overlay');

    if (productCards.length > 0) {
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                popupTitle.textContent = card.querySelector('h3').textContent;
                popupNote.textContent = card.getAttribute('data-note');
                popupRedirect.setAttribute('href', card.getAttribute('data-link'));
                popup.style.display = 'block';
                overlay.style.display = 'block';
            });
        });
    }

    if (popupCopy) {
        popupCopy.addEventListener('click', () => {
            const link = popupRedirect.getAttribute('href');
            navigator.clipboard.writeText(link).then(() => {
                popupCopy.textContent = '✅ Copied!';
                setTimeout(() => {
                    popupCopy.textContent = '📋 Copy Link';
                }, 2000);
            });
        });
    }

    if (closePopup && overlay) {
        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        });

        overlay.addEventListener('click', () => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        });
    }

    // Tab functionality for posts
    const postTabButtons = document.querySelectorAll('.posts .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const knowledgeBadge = document.querySelector('#knowledge-badge');
    const announcementsBadge = document.querySelector('#announcements-badge');
    const workBadge = document.querySelector('#work-badge');

    if (postTabButtons.length > 0) {
        postTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                postTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const tab = button.getAttribute('data-tab');
                tabContents.forEach(content => {
                    content.style.display = content.id === tab ? 'block' : 'none';
                });
            });
        });

        // Update badge counts
        knowledgeBadge.textContent = document.querySelectorAll('#knowledge .post-card').length;
        announcementsBadge.textContent = document.querySelectorAll('#announcements .announcement-card').length;
        workBadge.textContent = document.querySelectorAll('#work .work-card').length;
    }

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            let likes = parseInt(button.getAttribute('data-likes')) + 1;
            button.setAttribute('data-likes', likes);
            button.textContent = `❤️ ${likes}`;
        });
    });
});
