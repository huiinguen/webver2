document.addEventListener("DOMContentLoaded", () => {
    console.log("scripts.js loaded");

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('header nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // GSAP Animations for Split Slides (index.html)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray(".split-slide").forEach(slide => {
            const image = slide.querySelector('.split-slide-image');
            const content = slide.querySelector('.split-slide-content');

            // Animate image (slide in from left)
            gsap.from(image, {
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: slide,
                    start: "top 80%",
                    toggleActions: "play none none reset"
                }
            });

            // Animate content (slide in from right)
            gsap.from(content, {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: slide,
                    start: "top 80%",
                    toggleActions: "play none none reset"
                }
            });
        });
    }

    // Animation cho Social Links (contact.html)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray(".social-links").forEach(element => {
            gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                }
            });
        });
    }

    // Hover effect cho tất cả nút
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseover', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1.1, duration: 0.3 });
            }
        });
        btn.addEventListener('mouseout', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1, duration: 0.3 });
            }
        });
    });

    // Tìm kiếm sản phẩm (products.html)
    const searchInput = document.querySelector('#search');
    const productGrid = document.querySelector('.product-grid');
    const productCards = document.querySelectorAll('.product-card');

    if (searchInput && productGrid) {
        console.log("Search input and product grid found");
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const visibleCards = [];

            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchText)) {
                    card.style.display = 'flex';
                    visibleCards.push(card);
                } else {
                    card.style.display = 'none';
                }
            });

            productGrid.innerHTML = '';
            visibleCards.forEach(card => productGrid.appendChild(card));
        });
    }

    // Tab Switching (products.html)
    const productTabButtons = document.querySelectorAll('.products .tab-button');
    if (productTabButtons.length > 0 && productGrid) {
        console.log("Product tab buttons and product grid found");
        productTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');

                productTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const visibleCards = [];
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (tabId === 'all' || cardCategory === tabId) {
                        card.style.display = 'flex';
                        visibleCards.push(card);
                    } else {
                        card.style.display = 'none';
                    }
                });

                productGrid.innerHTML = '';
                visibleCards.forEach(card => productGrid.appendChild(card));

                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(productGrid, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                }
            });
        });
    }

    // Product Card Popup (products.html)
    const productPopup = document.getElementById('product-popup');
    const productOverlay = document.getElementById('overlay');
    const productClosePopup = document.getElementById('close-popup');
    const popupTitleProduct = document.getElementById('popup-title');
    const popupNoteProduct = document.getElementById('popup-note');
    const popupCopyBtn = document.getElementById('popup-copy');
    const popupRedirectBtn = document.getElementById('popup-redirect');

    if (productCards.length > 0 && productPopup && productOverlay && productClosePopup && popupTitleProduct && popupNoteProduct) {
        console.log("Product cards and popup elements found");
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                console.log("Product card clicked:", card.querySelector('h3').textContent);
                const title = card.querySelector('h3').textContent;
                const note = card.getAttribute('data-note');
                const link = card.getAttribute('data-link');

                popupTitleProduct.textContent = title;
                popupNoteProduct.textContent = note;
                popupCopyBtn.setAttribute('data-link', link);
                popupRedirectBtn.setAttribute('href', link);

                productPopup.style.display = 'block';
                productOverlay.style.display = 'block';

                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(productPopup, 
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
                    );
                }
            });
        });

        popupCopyBtn.addEventListener('click', () => {
            const link = popupCopyBtn.getAttribute('data-link');
            navigator.clipboard.writeText(link).then(() => {
                alert('Link copied to clipboard!');
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(popupCopyBtn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
                }
            });
        });

        productClosePopup.addEventListener('click', () => {
            console.log("Closing product popup");
            if (typeof gsap !== 'undefined') {
                gsap.to(productPopup, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        productPopup.style.display = 'none';
                        productOverlay.style.display = 'none';
                    }
                });
            } else {
                productPopup.style.display = 'none';
                productOverlay.style.display = 'none';
            }
        });

        productOverlay.addEventListener('click', () => {
            console.log("Product overlay clicked, closing popup");
            if (typeof gsap !== 'undefined') {
                gsap.to(productPopup, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        productPopup.style.display = 'none';
                        productOverlay.style.display = 'none';
                    }
                });
            } else {
                productPopup.style.display = 'none';
                productOverlay.style.display = 'none';
            }
        });
    }

    // Tab Switching (posts.html)
    const postTabButtons = document.querySelectorAll('.posts .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (postTabButtons.length > 0) {
        console.log("Post tab buttons found");
        const knowledgePosts = document.querySelectorAll('#knowledge .post-card').length;
        const announcements = document.querySelectorAll('#announcements .announcement-card').length;
        const workPosts = document.querySelectorAll('#work .work-card').length;

        document.getElementById('knowledge-badge').textContent = knowledgePosts;
        document.getElementById('announcements-badge').textContent = announcements;
        document.getElementById('work-badge').textContent = workPosts;

        postTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');

                postTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                tabContents.forEach(content => {
                    content.style.display = 'none';
                    if (typeof gsap !== 'undefined') {
                        gsap.to(content, { opacity: 0, duration: 0.3 });
                    }
                });

                const activeContent = document.getElementById(tabId);
                activeContent.style.display = 'block';
                if (typeof gsap !== 'undefined') {
                    gsap.to(activeContent, { opacity: 1, duration: 0.3 });
                }
            });
        });
    }

    // Like Button Interaction (posts.html)
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            let likes = parseInt(btn.getAttribute('data-likes')) + 1;
            btn.setAttribute('data-likes', likes);
            btn.textContent = `❤️ ${likes}`;
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
            }
        });
    });

    // Share Button Interaction (posts.html)
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
            }
        });
    });

    // Comment Button Interaction (posts.html)
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Comment feature coming soon!');
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
            }
        });
    });
});
