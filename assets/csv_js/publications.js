function loaded() {
    const fileName = "./assets/csv/publications.csv";

    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function (data) {
            const rowArr = data.split('\n');
            
            // 카테고리별, 연도별로 데이터 정리
            const publications = {
                journals: {},
                conferences: {},
                books: {}
            };
            
            // 카테고리 매핑
            const categoryMap = {
                "1": "journals",
                "2": "conferences", 
                "3": "books"
            };

            // CSV 파싱 (첫 번째 행은 헤더이므로 건너뜀)
            for (let num = 1; num < rowArr.length; num++) {
                const row = CSVtoArray(rowArr[num]);
                
                if (row && row.length >= 5) {
                    const category = row[0]?.trim();
                    const author = row[1]?.trim();
                    const title = row[2]?.trim();
                    const journal = row[3]?.trim();
                    const year = row[4]?.trim();
                    const pdf = row[5]?.trim() || '#';

                    if (category && categoryMap[category]) {
                        const catKey = categoryMap[category];
                        
                        // 연도별 그룹 생성
                        if (!publications[catKey][year]) {
                            publications[catKey][year] = [];
                        }
                        
                        publications[catKey][year].push({
                            author,
                            title,
                            journal,
                            year,
                            pdf
                        });
                    }
                }
            }

            // HTML 렌더링
            renderPublications('journals', publications.journals);
            renderPublications('conferences', publications.conferences);
            renderPublications('books', publications.books);
        }
    });
}

function renderPublications(tabId, data) {
    const container = document.getElementById(tabId);
    if (!container) return;
    
    // 기존 내용 비우기
    container.innerHTML = '';
    
    // 연도를 내림차순 정렬
    const years = Object.keys(data).sort((a, b) => b - a);
    
    if (years.length === 0) {
        container.innerHTML = '<p class="no-data">No publications available.</p>';
        return;
    }
    
    
    
    years.forEach(year => {
        const yearBlock = document.createElement('div');
        yearBlock.className = 'year-block';

        let globalIndex = 1;
        
        // 연도 헤더
        yearBlock.innerHTML = `<h2 class="year-separator">${year}</h2>`;
        
        // 해당 연도의 논문들
        data[year].forEach(pub => {
            const article = document.createElement('article');
            article.className = 'pub-item';
            
            // 저자 중 "Gildong Hong"을 하이라이트 (필요시 수정)
            const highlightedAuthor = highlightAuthor(pub.author, 'Younhyun Jung');
            
            article.innerHTML = `
                <div class="pub-content">
                    <h3 class="pub-title">
                        [${globalIndex}] ${pub.title}
                    </h3>
                    <p class="pub-authors">
                        ${highlightedAuthor}
                    </p>
                    <div class="pub-meta">
                        <span class="venue-tag">${pub.journal}</span>
                        <div class="resource-links">
                            ${pub.pdf && pub.pdf !== '#' ? `<a href="${pub.pdf}">[PDF]</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            yearBlock.appendChild(article);
            globalIndex++;
        });
        
        container.appendChild(yearBlock);
    });
}

// 특정 저자 이름 하이라이트
function highlightAuthor(authorString, targetName) {
    if (!authorString) return '';
    
    // 대소문자 구분 없이 교체
    const regex = new RegExp(`(${targetName})`, 'gi');
    return authorString.replace(regex, '<span class="author-me">$1</span>');
}

function CSVtoArray(text) {
    if (!text || text.trim() === '') return null;
    
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    var a = [];
    
    text.replace(re_value,
        function (m0, m1, m2, m3) {
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return '';
        });
    
    if (/,\s*$/.test(text)) a.push('');
    return a;
}

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', loaded);