/**
 * VOM Lab - Gallery Page JavaScript
 * Features: Lazy loading, Lightbox with navigation, Touch/Swipe support
 */

$(document).ready(function() {
    loadGallery();
});

// Gallery Data Storage
let galleryItems = [];
let currentIndex = 0;

/**
 * Load gallery data from CSV
 */
function loadGallery() {
    const fileName = "./assets/csv/gallery.csv";
    
    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function(data) {
            parseCSVAndRender(data);
        },
        error: function() {
            $("#gallery-grid").html('<p class="loading-text">Failed to load gallery data.</p>');
        }
    });
}

/**
 * Parse CSV data and render gallery items
 */
function parseCSVAndRender(data) {
    const rows = data.split('\n');
    const $grid = $("#gallery-grid");
    $grid.empty();
    
    galleryItems = []; // Reset
    
    for (let i = 1; i < rows.length; i++) {
        const row = CSVtoArray(rows[i]);
        
        if (row && row[0] !== undefined && row[0].trim() !== '') {
            const title = row[1] ? row[1].trim() : '';
            const imageFile = row[2] ? row[2].trim() : '';
            
            if (imageFile) {
                const imagePath = `assets/images/gallery/${imageFile}`;
                
                // Store for lightbox
                galleryItems.push({
                    title: title,
                    src: imagePath
                });
                
                const index = galleryItems.length - 1;
                
                // Create gallery item with lazy loading
                $grid.append(`
                    <div class="gallery-item" data-index="${index}">
                        <div class="gallery-img-wrap">
                            <img 
                                data-src="${imagePath}" 
                                alt="${title}"
                                loading="lazy"
                            >
                        </div>
                        <div class="gallery-overlay">
                            <p class="gallery-title">${title}</p>
                        </div>
                    </div>
                `);
            }
        }
    }
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize lightbox
    initLightbox();
    
    // Update lightbox total count
    $("#lightbox-total").text(galleryItems.length);
}

/**
 * Lazy Loading with Intersection Observer
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-img-wrap img[data-src]');
    
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px', // Start loading 100px before entering viewport
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback: Load all images immediately
        images.forEach(img => loadImage(img));
    }
}

/**
 * Load single image
 */
function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    // Create new image to preload
    const tempImg = new Image();
    tempImg.onload = function() {
        img.src = src;
        img.removeAttribute('data-src');
        // Add loaded class to remove shimmer effect
        img.closest('.gallery-img-wrap').classList.add('loaded');
    };
    tempImg.onerror = function() {
        // Fallback for failed images
        img.closest('.gallery-img-wrap').classList.add('loaded');
        img.alt = 'Image not available';
    };
    tempImg.src = src;
}

/**
 * Initialize Lightbox functionality
 */
function initLightbox() {
    const $lightbox = $('#lightbox');
    const $lightboxImg = $('#lightbox-img');
    const $lightboxCaption = $('#lightbox-caption');
    const $lightboxContent = $('.lightbox-content');
    
    // Open lightbox on image click
    $(document).on('click', '.gallery-item', function() {
        currentIndex = parseInt($(this).data('index'));
        openLightbox();
    });
    
    // Close lightbox
    $('.lightbox-close').on('click', closeLightbox);
    
    // Close on background click
    $lightbox.on('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Navigation
    $('.lightbox-prev').on('click', function(e) {
        e.stopPropagation();
        showPrevImage();
    });
    
    $('.lightbox-next').on('click', function(e) {
        e.stopPropagation();
        showNextImage();
    });
    
    // Keyboard navigation
    $(document).on('keydown', function(e) {
        if (!$lightbox.hasClass('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
    
    // Touch/Swipe support
    initTouchSupport($lightbox[0]);
}

/**
 * Open Lightbox
 */
function openLightbox() {
    const $lightbox = $('#lightbox');
    const item = galleryItems[currentIndex];
    
    if (!item) return;
    
    // Show lightbox
    $lightbox.addClass('active');
    $('body').addClass('lightbox-open');
    
    // Load image
    loadLightboxImage(item.src, item.title);
    
    // Update counter
    updateCounter();
    
    // Trigger fade-in after display
    setTimeout(() => {
        $lightbox.addClass('fade-in');
    }, 10);
}

/**
 * Close Lightbox
 */
function closeLightbox() {
    const $lightbox = $('#lightbox');
    $lightbox.removeClass('fade-in');
    
    setTimeout(() => {
        $lightbox.removeClass('active');
        $('body').removeClass('lightbox-open');
        $('#lightbox-img').removeClass('loaded').attr('src', '');
        $('.lightbox-content').removeClass('loaded');
    }, 300);
}

/**
 * Load image into lightbox
 */
function loadLightboxImage(src, title) {
    const $img = $('#lightbox-img');
    const $content = $('.lightbox-content');
    const $caption = $('#lightbox-caption');
    
    // Remove loaded class to show spinner
    $img.removeClass('loaded');
    $content.removeClass('loaded');
    
    // Preload image
    const tempImg = new Image();
    tempImg.onload = function() {
        $img.attr('src', src);
        $caption.text(title);
        
        // Add loaded class after brief delay for smooth transition
        setTimeout(() => {
            $img.addClass('loaded');
            $content.addClass('loaded');
        }, 50);
    };
    tempImg.onerror = function() {
        $img.attr('src', '');
        $caption.text('Image not available');
        $content.addClass('loaded');
    };
    tempImg.src = src;
}

/**
 * Show previous image
 */
function showPrevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    loadLightboxImage(item.src, item.title);
    updateCounter();
}

/**
 * Show next image
 */
function showNextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const item = galleryItems[currentIndex];
    loadLightboxImage(item.src, item.title);
    updateCounter();
}

/**
 * Update counter display
 */
function updateCounter() {
    $('#lightbox-current').text(currentIndex + 1);
}

/**
 * Touch/Swipe Support for Lightbox
 */
function initTouchSupport(element) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;
    
    element.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    element.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only handle horizontal swipes (ignore if vertical swipe is larger)
        if (Math.abs(deltaX) < minSwipeDistance || Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }
        
        if (deltaX > 0) {
            // Swipe right -> Previous
            showPrevImage();
        } else {
            // Swipe left -> Next
            showNextImage();
        }
    }
}

/**
 * CSV Parser Function
 */
function CSVtoArray(text) {
    if (!text || text.trim() === '') return null;
    
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    
    var a = [];
    text.replace(re_value, function(m0, m1, m2, m3) {
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return '';
    });
    
    if (/,\s*$/.test(text)) a.push('');
    return a;
}