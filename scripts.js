document.addEventListener("DOMContentLoaded", () => {
    console.log("scripts.js loaded");

    // Define productGrid once at the top
    const productGrid = document.querySelector('.product-grid');

    // Info Block Popup (Holiday Blocks Only)
    const holidayBlocks = document.querySelectorAll('.info-block.holiday-block');
    const popup = document.getElementById('info-popup');
    const overlay = document.getElementById('overlay');
    const closePopup = document.getElementById('close-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupNote = document.getElementById('popup-note');

    if (holidayBlocks.length > 0 && popup && overlay && closePopup && popupTitle && popupNote) {
        console.log("Holiday blocks and popup elements found");
        holidayBlocks.forEach(block => {
            block.addEventListener('click', () => {
                console.log("Holiday block clicked:", block.getAttribute('data-title'));
                const title = block.getAttribute('data-title');
                const note = block.getAttribute('data-note');

                popupTitle.textContent = title;
                popupNote.innerHTML = note;

                popup.style.display = 'block';
                overlay.style.display = 'block';

                // GSAP animation for popup
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(popup, 
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
                    );
                }

                // Vietnamese Flag Animation
                const flag = block.querySelector('.flag-image');
                if (flag && typeof gsap !== 'undefined') {
                    gsap.fromTo(flag, 
                        { scale: 0.9, opacity: 0 },
                        { scale: 1, opacity: 0.8, duration: 0.8, ease: "power3.out" } // Slower fade-in
                    );
                    gsap.to(flag, 
                        { opacity: 0, duration: 0.8, delay: 2, ease: "power3.in" } // Slower fade-out
                    );
                } else if (flag) {
                    flag.style.opacity = 0.8;
                    setTimeout(() => {
                        flag.style.opacity = 0;
                    }, 2000);
                }
            });
        });

        // Close popup
        closePopup.addEventListener('click', () => {
            console.log("Closing popup");
            if (typeof gsap !== 'undefined') {
                gsap.to(popup, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        popup.style.display = 'none';
                        overlay.style.display = 'none';
                    }
                });
            } else {
                popup.style.display = 'none';
                overlay.style.display = 'none';
            }
        });

        overlay.addEventListener('click', () => {
            console.log("Overlay clicked, closing popup");
            if (typeof gsap !== 'undefined') {
                gsap.to(popup, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        popup.style.display = 'none';
                        overlay.style.display = 'none';
                    }
                });
            } else {
                popup.style.display = 'none';
                overlay.style.display = 'none';
            }
        });
    } else {
        console.error("Holiday blocks or popup elements not found");
    }

    // Animation for Info Blocks
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        console.log("GSAP and ScrollTrigger loaded, applying animations");
        gsap.utils.toArray(".info-block").forEach(element => {
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
    } else {
        console.warn("GSAP or ScrollTrigger not loaded, skipping animations");
        document.querySelectorAll(".info-block").forEach(element => {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        });
    }

    // Animation cho Review Cards (Trang Review)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray(".review-card").forEach(card => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                }
            });
        });
    }

    // Animation cho Contact Info và Form (Trang Contact)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray(".social-links, .contact-form").forEach(element => {
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

    // Tìm kiếm sản phẩm (Trang Products)
    const searchInput = document.querySelector('#search');
    const productCards = document.querySelectorAll('.product-card');

    if (searchInput && productGrid) {
        console.log("Search input and product grid found");
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();

            // Lưu trữ các thẻ hiển thị
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

            // Sắp xếp lại lưới
            productGrid.innerHTML = '';
            visibleCards.forEach(card => productGrid.appendChild(card));
        });
    } else {
        console.warn("Search input or product grid not found");
    }

    // Tab Switching (Products Page)
    const productTabButtons = document.querySelectorAll('.products .tab-button');
    if (productTabButtons.length > 0 && productGrid) {
        console.log("Product tab buttons and product grid found");
        productTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');

                // Remove active class from all buttons
                productTabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                // Filter products
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

                // Sắp xếp lại lưới
                productGrid.innerHTML = '';
                visibleCards.forEach(card => productGrid.appendChild(card));

                // Hiệu ứng GSAP
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(productGrid, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                }
            });
        });
    } else {
        console.warn("Product tab buttons or product grid not found");
    }

    // Product Card Popup (Trang Products)
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

                // GSAP animation for popup
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(productPopup, 
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
                    );
                }
            });
        });

        // Copy button in popup
        popupCopyBtn.addEventListener('click', () => {
            const link = popupCopyBtn.getAttribute('data-link');
            navigator.clipboard.writeText(link).then(() => {
                alert('Link copied to clipboard!');
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(popupCopyBtn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
                }
            });
        });

        // Close popup
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
    } else {
        console.warn("Product cards or popup elements not found");
    }

    // Tab Switching (Blog Page)
    const postTabButtons = document.querySelectorAll('.posts .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (postTabButtons.length > 0) {
        console.log("Post tab buttons found");
        // Update badge counts dynamically
        const knowledgePosts = document.querySelectorAll('#knowledge .post-card').length;
        const announcements = document.querySelectorAll('#announcements .announcement-card').length;

        document.getElementById('knowledge-badge').textContent = knowledgePosts;
        document.getElementById('announcements-badge').textContent = announcements;

        postTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');

                // Remove active class from all buttons
                postTabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                // Hide all tab contents
                tabContents.forEach(content => {
                    content.style.display = 'none';
                    if (typeof gsap !== 'undefined') {
                        gsap.to(content, { opacity: 0, duration: 0.3 });
                    }
                });

                // Show selected tab content
                const activeContent = document.getElementById(tabId);
                activeContent.style.display = 'block';
                if (typeof gsap !== 'undefined') {
                    gsap.to(activeContent, { opacity: 1, duration: 0.3 });
                }
            });
        });
    } else {
        console.warn("Post tab buttons not found");
    }

    // Like Button Interaction
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

    // Share Button Interaction
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Placeholder: Copy current page URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
            }
        });
    });

    // Comment Button Interaction (Placeholder)
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
