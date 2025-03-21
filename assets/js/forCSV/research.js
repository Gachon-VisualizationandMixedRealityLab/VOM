function loaded() {
    // 각 탭별 데이터를 저장할 배열
    const researchData = {
        "1": [],
        "2": [],
        "3": []
    };
    
    // 페이지네이션 설정
    const itemsPerPage = 5;
    let currentPage = {
        "1": 1,
        "2": 1,
        "3": 1
    };

    // 데이터 CSV 불러오기
    const fileName = "./assets/csv/research.csv";

    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function (data) {
            const allRow = data;
            let allData = "";

            // 데이터 row별로 넣기
            for (var singleRow = 0; singleRow < allRow.length; singleRow++) {
                allData += allRow[singleRow];
            }
            const rowArr = allData.split('\n');
            const textArr = new Array(rowArr.length);

            // 데이터 파싱 및 카테고리별로 저장
            for (var num = 0; num < rowArr.length; num++) {
                textArr[num] = CSVtoArray(rowArr[num]);

                if (textArr[num][0] !== undefined && num > 0) {
                    // 데이터 받아오기
                    const category = textArr[num][0];
                    const title = textArr[num][1];
                    const imagelink = textArr[num][2];
                    const text = textArr[num][3];

                    // 카테고리별 데이터 저장
                    if (category === "1" || category === "2" || category === "3") {
                        researchData[category].push({
                            title: title,
                            imagelink: imagelink,
                            text: text
                        });
                    }
                }
            }

            // 각 탭별로 페이지네이션 및 컨텐츠 렌더링
            renderTabContent("1", researchData["1"], currentPage["1"], itemsPerPage);
            renderTabContent("2", researchData["2"], currentPage["2"], itemsPerPage);
            renderTabContent("3", researchData["3"], currentPage["3"], itemsPerPage);

            // 페이지네이션 이벤트 설정
            setupPaginationEvents(researchData, itemsPerPage, currentPage);
        }
    });
}

// 특정 탭의 컨텐츠 렌더링 함수
function renderTabContent(tabId, data, page, itemsPerPage) {
    const ul_list = $("#research_" + tabId);
    ul_list.empty(); // 기존 내용 삭제

    // 페이지네이션을 위한 데이터 슬라이싱
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    // 컨텐츠 렌더링
    paginatedData.forEach(item => {
        ul_list.append(`<div class="row">
            <div class="col-md-12">
                <div class="section-heading">
                <h2>${item.title}</h2>
            </div>

            <div class="row research_box">
                <div class="col-md-5">
                <img src="assets/images/research/${item.imagelink}" alt="">
                </div>
                <div class="col-md-7">
                <p>
                ${item.text}
                </p>
                </div>
            </div>
            
            </div>
        </div>`);
    });

    // 페이지네이션 컨트롤 렌더링
    renderPagination(tabId, data.length, page, itemsPerPage);
}

// 페이지네이션 컨트롤 렌더링 함수
function renderPagination(tabId, totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = $("#pagination_" + tabId);
    paginationContainer.empty();

    if (totalPages <= 1) {
        return; // 페이지가 1개 이하면 페이지네이션 표시 안함
    }

    let paginationHtml = '<ul class="pagination">';
    
    // 이전 버튼
    paginationHtml += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}" data-tab="${tabId}">이전</a>
    </li>`;

    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}" data-tab="${tabId}">${i}</a>
        </li>`;
    }

    // 다음 버튼
    paginationHtml += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}" data-tab="${tabId}">다음</a>
    </li>`;

    paginationHtml += '</ul>';
    paginationContainer.html(paginationHtml);
}

// 페이지네이션 이벤트 설정 함수
function setupPaginationEvents(data, itemsPerPage, currentPage) {
    // 기존 이벤트 핸들러 제거 후 다시 등록
    $(document).off('click', '.page-link').on('click', '.page-link', function(e) {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 버블링 방지
        
        const tabId = $(this).data('tab');
        const page = $(this).data('page');
        
        // 유효한 페이지 번호인지 확인
        const totalPages = Math.ceil(data[tabId].length / itemsPerPage);
        if (page < 1 || page > totalPages) {
            return;
        }
        
        // 현재 페이지 업데이트 및 컨텐츠 다시 렌더링
        currentPage[tabId] = page;
        renderTabContent(tabId, data[tabId], page, itemsPerPage);
        
        console.log(`Tab ${tabId}: 페이지 ${page}로 이동`); // 디버깅용
    });
}

function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    //Return NULL if input string is not well formed CSV string.
    //if (!re_valid.test(text)) return null;
    var a = []; //Initialize array to receive values.
    text.replace(re_value, //"Walk" the string using replace with callback.
        function (m0, m1, m2, m3) {
            //Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            //Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; //Return empty string.
        });
    //Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
}