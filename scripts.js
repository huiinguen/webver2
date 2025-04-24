document.addEventListener("DOMContentLoaded", () => {
    // Animation cho Review Cards (Trang Review)
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

    // Animation cho Contact Info và Form (Trang Contact)
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

    // Hover effect cho tất cả nút
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseover', () => {
            gsap.to(btn, { scale: 1.1, duration: 0.3 });
        });
        btn.addEventListener('mouseout', () => {
            gsap.to(btn, { scale: 1, duration: 0.3 });
        });
    });

    // Tìm kiếm sản phẩm (Trang Products)
    const searchInput = document.querySelector('#search');
    const productCards = document.querySelectorAll('.product-card');
    const productGrid = document.querySelector('.product-grid');

    if (searchInput) {
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
    }

    // Tab Switching (Products Page)
    const productTabButtons = document.querySelectorAll('.products .tab-button');
    if (productTabButtons.length > 0) {
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
                gsap.fromTo(productGrid, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            });
        });
    }

    // JavaScript cho popup (Trang Products)
    const infoSquares = document.querySelectorAll('.info-square');
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const closePopup = document.getElementById('closePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDescription = document.getElementById('popupDescription');

    if (infoSquares.length > 0) {
        infoSquares.forEach(square => {
            square.addEventListener('click', () => {
                const productCard = square.closest('.product-card');
                const title = productCard.querySelector('h3').textContent;
                const description = productCard.querySelector('.note').textContent;

                popupTitle.textContent = title;
                popupDescription.textContent = description;

                popup.style.display = 'block';
                overlay.style.display = 'block';
            });
        });

        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        });

        overlay.addEventListener('click', () => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        });
    }

    // Copy Button Interaction (Trang Products)
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const link = btn.getAttribute('data-link');
            navigator.clipboard.writeText(link).then(() => {
                alert('Link copied to clipboard!');
                gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
            });
        });
    });

    // Tab Switching (Blog Page)
    const postTabButtons = document.querySelectorAll('.posts .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (postTabButtons.length > 0) {
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
                    gsap.to(content, { opacity: 0, duration: 0.3 });
                });

                // Show selected tab content
                const activeContent = document.getElementById(tabId);
                activeContent.style.display = 'block';
                gsap.to(activeContent, { opacity: 1, duration: 0.3 });
            });
        });
    }

    // Like Button Interaction
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            let likes = parseInt(btn.getAttribute('data-likes')) + 1;
            btn.setAttribute('data-likes', likes);
            btn.textContent = `❤️ ${likes}`;
            gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
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
            gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
        });
    });

    // Comment Button Interaction (Placeholder)
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Comment feature coming soon!');
            gsap.fromTo(btn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
        });
    });
});