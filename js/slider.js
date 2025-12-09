/* =========================================
   VOM Lab - Home Page Slider
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const sliderContainer = document.querySelector('.slider-container');
    
    if (!slides.length || !dots.length || !sliderContainer) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlide;
    
    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        
        // Fade out current slide
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active-dot');
        
        // Fade in new slide
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active-dot');
        
        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }
    
    // Next slide
    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        goToSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Auto slide (every 5 seconds)
    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlide);
    }
    
    startAutoSlide();
    
    // Pause on hover
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Drag/swipe support
    let startX = 0;
    let isDragging = false;
    
    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        sliderContainer.style.cursor = 'grabbing';
    });
    
    sliderContainer.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.style.cursor = 'grab';
        
        const diff = e.pageX - startX;
        if (diff > 50) {
            prevSlide();
        } else if (diff < -50) {
            nextSlide();
        }
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        sliderContainer.style.cursor = 'grab';
    });
    
    // Touch support for mobile
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        
        if (diff > 50) {
            prevSlide();
        } else if (diff < -50) {
            nextSlide();
        }
        
        startAutoSlide();
    }, { passive: true });
});
