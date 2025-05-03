document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

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
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
        const cubeCount = 30;
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

        // Animation with IntersectionObserver for performance
        let time = 0;
        let isAnimating = true;
        function animate() {
            if (!isAnimating) return;
            requestAnimationFrame(animate);
            time += 0.02;

            cubes.forEach((cube, i) => {
                if (time < 7) {
                    const target = targetPositions[i % targetPositions.length];
                    cube.position.lerp(new THREE.Vector3(...target), 0.05);
                    cube.rotation.x += 0.02;
                    cube.rotation.y += 0.02;
                } else {
                    cube.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01);
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                    cube.material.color.setHSL((Math.sin(time * 0.1 + i) + 1) / 2, 0.7, 0.5);
                }
            });

            camera.position.z = 10;
            renderer.render(scene, camera);
        }

        // Pause animation when canvas is out of view
        const observer = new IntersectionObserver((entries) => {
            isAnimating = entries[0].isIntersecting;
            if (isAnimating) animate();
        }, { threshold: 0 });
        observer.observe(canvas);

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
                    if (tab === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Trigger default filter (tech) on page load
        const defaultTabButton = document.querySelector('.tab-button[data-tab="tech"]');
        if (defaultTabButton) {
            defaultTabButton.click();
        }
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

    // Popup functionality for products
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
                popupCopy.textContent = '✅ Đã sao chép!';
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
    const workBadge = document.querySelector('#work-badge');
    const reviewsBadge = document.querySelector('#reviews-badge');
    const postSearchInput = document.querySelector('#post-search');
    const postCards = document.querySelectorAll('.post-card');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewFilterSelect = document.querySelector('#review-filter-select');
    const reviewFilterDropdown = document.querySelector('.review-filter-dropdown');

    if (postTabButtons.length > 0) {
        postTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                postTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const tab = button.getAttribute('data-tab');
                tabContents.forEach(content => {
                    content.style.display = content.id === tab ? 'block' : 'none';
                });

                // Show/hide review filter dropdown and reset search
                if (reviewFilterDropdown) {
                    reviewFilterDropdown.style.display = tab === 'reviews' ? 'block' : 'none';
                }

                // Reset search filter and trigger default review filter when switching to reviews tab
                if (postSearchInput) {
                    postSearchInput.value = '';
                    postCards.forEach(card => {
                        card.style.display = 'block';
                    });
                    reviewCards.forEach(card => {
                        card.style.display = 'none';
                    });
                    if (tab === 'reviews' && reviewFilterSelect) {
                        reviewFilterSelect.value = 'photo';
                        reviewFilterSelect.dispatchEvent(new Event('change'));
                    }
                }
            });
        });

        // Update badge counts
        if (knowledgeBadge) knowledgeBadge.textContent = document.querySelectorAll('#knowledge .post-card').length;
        if (workBadge) workBadge.textContent = document.querySelectorAll('#work .work-card').length;
        if (reviewsBadge) reviewsBadge.textContent = document.querySelectorAll('#reviews .review-card').length;
    }

    // Post search functionality
    if (postSearchInput) {
        postSearchInput.addEventListener('input', () => {
            const searchTerm = postSearchInput.value.toLowerCase();
            postCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const content = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            reviewCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const content = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Review filter functionality with dropdown
    if (reviewFilterSelect) {
        reviewFilterSelect.addEventListener('change', () => {
            const filter = reviewFilterSelect.value;
            reviewCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Popup functionality for reviews
    const reviewPopup = document.querySelector('#review-popup');
    const reviewPopupTitle = document.querySelector('#review-popup-title');
    const reviewPopupNote = document.querySelector('#review-popup-note');
    const reviewPopupRedirect = document.querySelector('#review-popup-redirect');
    const reviewPopupCopy = document.querySelector('#review-popup-copy');
    const closeReviewPopup = document.querySelector('#close-review-popup');
    const reviewOverlay = document.querySelector('#review-overlay');

    if (reviewCards.length > 0) {
        reviewCards.forEach(card => {
            card.addEventListener('click', () => {
                reviewPopupTitle.textContent = card.querySelector('h3').textContent;
                reviewPopupNote.textContent = card.getAttribute('data-note');
                reviewPopupRedirect.setAttribute('href', card.getAttribute('data-link'));
                reviewPopup.style.display = 'block';
                reviewOverlay.style.display = 'block';
            });
        });
    }

    if (reviewPopupCopy) {
        reviewPopupCopy.addEventListener('click', () => {
            const link = reviewPopupRedirect.getAttribute('href');
            navigator.clipboard.writeText(link).then(() => {
                reviewPopupCopy.textContent = '✅ Đã sao chép!';
                setTimeout(() => {
                    reviewPopupCopy.textContent = '📋 Copy Link';
                }, 2000);
            });
        });
    }

    if (closeReviewPopup && reviewOverlay) {
        closeReviewPopup.addEventListener('click', () => {
            reviewPopup.style.display = 'none';
            reviewOverlay.style.display = 'none';
        });

        reviewOverlay.addEventListener('click', () => {
            reviewPopup.style.display = 'none';
            reviewOverlay.style.display = 'none';
        });
    }
});
