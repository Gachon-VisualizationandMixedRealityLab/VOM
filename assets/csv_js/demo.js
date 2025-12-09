$(document).ready(function() {
    loaded();
});

function loaded() {
    // ⚠️ 경로 확인: assets/data/demo.csv 인지 assets/csv/demo.csv 인지 체크!
    const fileName = "assets/csv/demo.csv"; 

    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function (data) {
            $("#demo-list").empty();
            const rowArr = data.split(/\r\n|\n/);

            for (var num = 1; num < rowArr.length; num++) {
                if (rowArr[num].trim() === "") continue;
                const row = CSVtoArray(rowArr[num]);

                if (row && row.length >= 4 && row[0] === "1") {
                    const title = row[1].trim();
                    const videoId = row[2].trim(); // 유튜브 ID
                    const text = row[3].trim();
                    const paper = row[4].trim();

                    let paperHtml = '';
                    if (paper && paper.trim() !== '' && paper.trim() !== '-') {
                        paperHtml = `<div class="demo-link-wrap"><span class="paper-link">📄 ${paper}</span></div>`;
                    }

                    // 1. iframe 대신 썸네일 이미지와 재생 버튼을 넣음
                    // data-id 속성에 비디오 ID를 저장해둠
                    $("#demo-list").append(`
                        <article class="demo-card">
                            <div class="video-wrapper" data-id="${videoId}">
                                <div class="video-placeholder">
                                    <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                                    alt="${title}"
                                    onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                                    <div class="play-btn"></div>
                                </div>
                            </div>
                            <div class="demo-content">
                                <h3 class="demo-title">${title}</h3>
                                <div class="demo-desc">${text}</div>
                                ${paperHtml}
                            </div>
                        </article>
                    `);
                }
            }
        },
        error: function() {
            $("#demo-list").html('<p style="text-align:center; width:100%;">Failed to load demo data.</p>');
        }
    });

    // 2. [클릭 이벤트] 썸네일을 클릭하면 실제 유튜브 iframe으로 교체 (자동 재생 포함)
    $(document).on('click', '.video-wrapper', function() {
        const $wrapper = $(this);
        // 이미 iframe이 로드되었다면 중단
        if ($wrapper.find('iframe').length > 0) return;

        const id = $wrapper.data('id');
        
        // iframe 생성 (autoplay=1로 클릭하자마자 재생되게 설정)
        const iframeHtml = `
            <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>`;
        
        // 내부 내용(이미지, 버튼)을 지우고 iframe으로 교체
        $wrapper.html(iframeHtml);
    });
}

function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    if (!re_valid.test(text)) return null;
    var a = [];
    text.replace(re_value, function (m0, m1, m2, m3) {
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return '';
    });
    if (/,\s*$/.test(text)) a.push('');
    return a;
}