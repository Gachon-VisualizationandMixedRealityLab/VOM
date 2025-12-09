/**
 * VOM Lab - Research Page JavaScript
 * Loads research data from CSV and renders into tabs with pagination
 */

$(document).ready(function() {
    loadResearch();
});

// 전역 변수
const ITEMS_PER_PAGE = 6;
let researchData = {
    "visualization": [],
    "imageprocess": [],
    "domain": []
};
let currentPage = {
    "visualization": 1,
    "imageprocess": 1,
    "domain": 1
};

/**
 * 탭 전환 시 페이지 리셋 함수 (외부에서 호출 가능)
 */
function resetTabPage(tabId) {
    if (currentPage[tabId] !== undefined) {
        currentPage[tabId] = 1;
        renderResearchTab(tabId);
    }
}

function loadResearch() {
    // 탭 ID와 CSV 카테고리 매핑
    const tabMapping = {
        "1": "visualization",    // Visualization & Mixed Reality
        "2": "imageprocess",     // Image Processing & Machine Learning
        "3": "domain"            // Domain Applications
    };

    const fileName = "./assets/csv/research.csv";

    $.ajax({
        url: fileName,
        dataType: 'text',
        beforeSend: function(xhr) {
            xhr.overrideMimeType("text/csv; charset=UTF-8");
        },
        success: function(data) {
            const rowArr = data.split('\n');

            // CSV 파싱 (첫 번째 행은 헤더이므로 건너뜀)
            for (let num = 1; num < rowArr.length; num++) {
                const row = CSVtoArray(rowArr[num]);

                if (row && row[0] !== undefined && row[0].trim() !== '') {
                    const category = row[0].trim();
                    const title = row[1] ? row[1].trim() : "";
                    const imagelink = row[2] ? row[2].trim() : "";
                    let description = row[3] ? row[3].trim() : "";
                    const keywords = row[4] ? row[4].trim() : "";

                    // 특수 문자 처리
                    description = description.replace(/��/g, "'");
                    description = description.replace(/\ufffd/g, "'");

                    // 카테고리에 해당하는 탭 ID 찾기
                    const tabId = tabMapping[category];
                    
                    if (tabId) {
                        researchData[tabId].push({
                            title: title,
                            image: imagelink,
                            description: description,
                            keywords: keywords
                        });
                    }
                }
            }

            // 각 탭에 데이터 렌더링
            renderResearchTab("visualization");
            renderResearchTab("imageprocess");
            renderResearchTab("domain");
        },
        error: function() {
            console.error("Failed to load research data");
        }
    });
}

/**
 * 특정 탭에 연구 데이터 렌더링 (페이지네이션 포함)
 */
function renderResearchTab(tabId) {
    const $container = $(`#${tabId} .container`);
    const data = researchData[tabId];
    const page = currentPage[tabId];
    
    if (!$container.length) {
        console.error(`Container not found for tab: ${tabId}`);
        return;
    }

    // 기존 콘텐츠 제거
    $container.empty();

    if (data.length === 0) {
        $container.html('<p class="no-data" style="text-align: center; color: var(--text-secondary); padding: 60px 0;">No research data available.</p>');
        return;
    }

    // 페이지네이션 계산
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = data.slice(startIndex, endIndex);

    // 연구 콘텐츠 컨테이너
    const $contentWrapper = $('<div class="research-content"></div>');

    // 각 연구 주제 렌더링
    pageData.forEach((item, index) => {
        const globalIndex = startIndex + index;
        const topicNum = getTopicNumber(tabId, globalIndex);
        const keywordsHtml = generateKeywordsHtml(item.keywords);
        
        const section = `
            <section class="research-topic">
                <div class="topic-content">
                    <span class="topic-num">${topicNum}</span>
                    <h2 class="topic-title">${item.title}</h2>
                    <p class="topic-desc">${item.description}</p>
                    ${keywordsHtml}
                </div>
                <div class="topic-image">
                    <img src="assets/images/research/${item.image}" alt="${item.title}">
                </div>
            </section>
        `;
        
        $contentWrapper.append(section);
    });

    $container.append($contentWrapper);

    // 페이지네이션 렌더링 (6개 초과시에만)
    if (totalPages > 1) {
        const paginationHtml = renderPagination(tabId, page, totalPages);
        $container.append(paginationHtml);
    }
}

/**
 * 페이지네이션 HTML 생성
 */
function renderPagination(tabId, currentPage, totalPages) {
    let html = `<div class="research-pagination" data-tab="${tabId}">`;
    
    // 이전 버튼
    html += `<button class="page-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}" 
                     data-tab="${tabId}" data-page="${currentPage - 1}" 
                     ${currentPage === 1 ? 'disabled' : ''}>
                <span>&#10094;</span> Prev
             </button>`;
    
    // 페이지 번호들
    html += '<div class="page-numbers">';
    
    for (let i = 1; i <= totalPages; i++) {
        // 페이지가 많을 경우 일부만 표시
        if (totalPages <= 7 || 
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-num ${i === currentPage ? 'active' : ''}" 
                             data-tab="${tabId}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="page-dots">...</span>';
        }
    }
    
    html += '</div>';
    
    // 다음 버튼
    html += `<button class="page-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                     data-tab="${tabId}" data-page="${currentPage + 1}"
                     ${currentPage === totalPages ? 'disabled' : ''}>
                Next <span>&#10095;</span>
             </button>`;
    
    html += '</div>';
    
    return html;
}

/**
 * 페이지네이션 클릭 이벤트
 */
$(document).on('click', '.research-pagination button:not(.disabled)', function() {
    const tabId = $(this).data('tab');
    const page = $(this).data('page');
    
    if (page && tabId) {
        currentPage[tabId] = page;
        renderResearchTab(tabId);
        
        // 스크롤 위치 조정 (탭 상단으로)
        $('html, body').animate({
            scrollTop: $(`#${tabId}`).offset().top - 100
        }, 300);
    }
});

/**
 * 토픽 번호 생성 (VIS 01, IP 01, APP 01 등)
 */
function getTopicNumber(tabId, index) {
    const prefixMap = {
        "visualization": "VIS",
        "imageprocess": "IP",
        "domain": "APP"
    };
    
    const prefix = prefixMap[tabId] || "TOPIC";
    const num = String(index + 1).padStart(2, '0');
    
    return `${prefix} ${num}`;
}

/**
 * 키워드 HTML 생성
 */
function generateKeywordsHtml(keywordsStr) {
    if (!keywordsStr || keywordsStr.trim() === '') {
        return '';
    }

    // 키워드가 쉼표 또는 세미콜론으로 구분되어 있다고 가정
    const keywords = keywordsStr.split(/[,;]/).map(k => k.trim()).filter(k => k);
    
    if (keywords.length === 0) {
        return '';
    }

    const keywordSpans = keywords.map(k => `<span class="keyword">${k}</span>`).join('');
    
    return `<div class="keyword-list">${keywordSpans}</div>`;
}

/**
 * CSV 파싱 함수
 */
function CSVtoArray(text) {
    if (!text || text.trim() === '') return null;

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