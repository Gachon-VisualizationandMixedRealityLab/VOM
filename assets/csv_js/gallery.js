/**
 * VOM Lab - Gallery Page JavaScript
 * Features: Lazy loading, Lightbox, Hidden Gallery (Firework trigger with Insertion)
 */

$(document).ready(function() {
    loadGallery();
    
    // 폭죽 버튼 이벤트
    $('#btn-show-hidden').on('click', function() {
        revealHiddenItems();
        // 버튼 자체에도 애니메이션을 주며 사라지게 함
        $(this).parent().fadeOut(500, function() {
            $(this).remove();
        });
    });
});

// 데이터 저장소
let galleryItems = []; // 라이트박스용 (현재 화면 순서와 동기화)
let allRawData = [];   // CSV 원본 데이터

/**
 * 1. CSV 로드
 */
function loadGallery() {
    $.ajax({
        url: "./assets/csv/gallery.csv",
        dataType: 'text',
        success: function(data) {
            parseCSV(data);
        },
        error: function() {
            $("#gallery-grid").html('<p class="loading-text">Failed to load gallery data.</p>');
        }
    });
}

/**
 * 2. 데이터 파싱 및 초기 렌더링 (Type 1만)
 */
function parseCSV(data) {
    const rows = data.split('\n');
    allRawData = [];
    
    for (let i = 1; i < rows.length; i++) {
        const row = CSVtoArray(rows[i]);
        if (row && row[0] !== undefined && row[0].trim() !== '') {
            const type = row[0].trim(); // '1' or '2'
            const title = row[1] ? row[1].trim() : '';
            const imageFile = row[2] ? row[2].trim() : '';
            
            if (imageFile) {
                allRawData.push({
                    type: type,
                    title: title,
                    src: `assets/images/gallery/${imageFile}`
                });
            }
        }
    }
    
    // 초기에는 Type '1'인 이미지만 그립니다.
    renderInitialGallery();
}

/**
 * 초기 렌더링 (Type 1만 화면에 표시)
 */
function renderInitialGallery() {
    const $grid = $("#gallery-grid");
    $grid.empty();
    galleryItems = []; 
    
    allRawData.forEach((item) => {
        // Type 1만 처리
        if (item.type === '1') {
            galleryItems.push(item);
            const html = createGalleryItemHTML(item, galleryItems.length - 1);
            $grid.append(html);
        }
    });
    
    // 기능 초기화
    initLazyLoading();
    initLightbox();
    $("#lightbox-total").text(galleryItems.length);
}

/**
 * [핵심 기능] 숨겨진 이미지(Type 2)를 사이사이에 끼워넣기
 */
function revealHiddenItems() {
    const $grid = $("#gallery-grid");
    const $children = $grid.children('.gallery-item');
    
    // 1. 라이트박스용 배열을 전체 데이터로 리셋 (순서 중요)
    galleryItems = [...allRawData];
    $("#lightbox-total").text(galleryItems.length);

    // 2. 전체 데이터를 순회하며 DOM 조작
    // Type 1은 이미 DOM에 있으므로 건너뛰고, Type 2는 해당 위치에 삽입합니다.
    
    allRawData.forEach((item, index) => {
        if (item.type === '2') {
            // 새로 추가할 아이템 HTML 생성
            // index는 전체 데이터 기준의 정확한 위치입니다.
            let $newItem = $(createGalleryItemHTML(item, index));
            
            // 등장 애니메이션 클래스 추가
            $newItem.addClass('reveal-enter');
            
            // 삽입 위치 찾기: 현재 DOM의 index번째 요소 앞에 넣으면 됨
            // (jQuery의 eq(index)는 현재 DOM 상태 기준임에 유의)
            
            const $target = $grid.children('.gallery-item').eq(index);
            
            if ($target.length > 0) {
                // 해당 위치에 요소가 있으면 그 앞에 삽입 (밀어내기)
                $target.before($newItem);
            } else {
                // 해당 위치에 요소가 없으면(맨 끝) append
                $grid.append($newItem);
            }
            
            // 이미지 로드 트리거 (새로 추가된 것만)
            const img = $newItem.find('img')[0];
            if (img) loadImage(img);
        }
    });

    // 3. 순서가 바뀌었으므로 모든 요소의 data-index 속성을 재정렬 (라이트박스 연동 필수)
    $grid.children('.gallery-item').each(function(i) {
        $(this).attr('data-index', i);
    });
}

/**
 * HTML 생성 헬퍼 함수
 */
function createGalleryItemHTML(item, index) {
    return `
        <div class="gallery-item" data-index="${index}">
            <div class="gallery-img-wrap">
                <img 
                    data-src="${item.src}" 
                    alt="${item.title}"
                    loading="lazy"
                >
            </div>
            <div class="gallery-overlay">
                <p class="gallery-title">${item.title}</p>
            </div>
        </div>
    `;
}

// ... (이하 기존 initLazyLoading, loadImage, initLightbox, CSVtoArray 함수들은 그대로 유지)
// ※ 주의: initLightbox 함수 내부 코드는 이전 답변과 동일하게 'data-index'를 읽어오도록 유지해야 합니다.

/**
 * Lazy Loading
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-img-wrap img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => loadImage(img));
    }
}

function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    const tempImg = new Image();
    tempImg.onload = function() {
        img.src = src;
        img.removeAttribute('data-src');
        img.closest('.gallery-img-wrap').classList.add('loaded');
    };
    tempImg.onerror = function() {
        img.closest('.gallery-img-wrap').classList.add('loaded');
        img.alt = 'Image not available';
    };
    tempImg.src = src;
}

function initLightbox() {
    $(document).off('click', '.gallery-item');
    $('.lightbox-close').off('click');
    $('#lightbox').off('click');
    $('.lightbox-prev').off('click');
    $('.lightbox-next').off('click');
    $(document).off('keydown');

    const $lightbox = $('#lightbox');
    
    $(document).on('click', '.gallery-item', function() {
        currentIndex = parseInt($(this).attr('data-index'));
        openLightbox();
    });
    
    $('.lightbox-close').on('click', closeLightbox);
    $lightbox.on('click', function(e) { if (e.target === this) closeLightbox(); });
    $('.lightbox-prev').on('click', function(e) { e.stopPropagation(); showPrevImage(); });
    $('.lightbox-next').on('click', function(e) { e.stopPropagation(); showNextImage(); });
    
    $(document).on('keydown', function(e) {
        if (!$lightbox.hasClass('active')) return;
        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': showPrevImage(); break;
            case 'ArrowRight': showNextImage(); break;
        }
    });
    initTouchSupport($lightbox[0]);
}

function openLightbox() {
    const $lightbox = $('#lightbox');
    const item = galleryItems[currentIndex];
    if (!item) return;
    $lightbox.addClass('active');
    $('body').addClass('lightbox-open');
    loadLightboxImage(item.src, item.title);
    updateCounter();
    setTimeout(() => { $lightbox.addClass('fade-in'); }, 10);
}

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

function loadLightboxImage(src, title) {
    const $img = $('#lightbox-img');
    const $content = $('.lightbox-content');
    const $caption = $('#lightbox-caption');
    $img.removeClass('loaded');
    $content.removeClass('loaded');
    const tempImg = new Image();
    tempImg.onload = function() {
        $img.attr('src', src);
        $caption.text(title);
        setTimeout(() => { $img.addClass('loaded'); $content.addClass('loaded'); }, 50);
    };
    tempImg.src = src;
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    loadLightboxImage(item.src, item.title);
    updateCounter();
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const item = galleryItems[currentIndex];
    loadLightboxImage(item.src, item.title);
    updateCounter();
}

function updateCounter() {
    $('#lightbox-current').text(currentIndex + 1);
}

function initTouchSupport(element) {
    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
    element.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    element.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > Math.abs(deltaX)) return;
        if (deltaX > 0) showPrevImage(); else showNextImage();
    }, { passive: true });
}

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