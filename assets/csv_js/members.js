function loaded() {
    // jQuery의 document ready 대신, loaded 함수가 호출되는 시점에 따라 이 코드가 실행됩니다.
    // HTML 파일에서 members.js 로딩 후 이 함수를 직접 호출하거나,
    // window.onload 또는 jQuery(document).ready() 내부에서 호출해야 합니다.

    // 데이터가 삽입될 HTML 요소의 jQuery 객체 변수
    let $ul_list; 

    // 데이터 CSV 불러오기 경로 (이 경로는 실제 CSV 파일 위치에 맞게 조정해야 합니다)
    const fileName = "./assets/csv/member.csv";

    // Alumni (Bachelor/Undergraduate)는 HTML에 이미 정적인 목록이 있으므로
    // JS 코드는 Graduate Students, BS-MS, Undergraduate Students, Research Professor, Graduate Alumni만 처리합니다.

    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function (data) {
            const allRow = data;
            let allData = "";

            // 모든 데이터를 하나의 문자열로 합치기
            for (var singleRow = 0; singleRow < allRow.length; singleRow++) {
                allData += allRow[singleRow];
            }

            const rowArr = allData.split('\n');
            const textArr = new Array(rowArr.length);

            // CSV 데이터 파싱 및 삽입
            for (var num = 0; num < rowArr.length; num++) {
                textArr[num] = CSVtoArray(rowArr[num]);

                // 첫 번째 행은 헤더이므로 건너뛰고, 첫 번째 필드가 undefined가 아닌 경우 처리
                if (textArr[num][0] !== undefined && num > 0) {

                    // 데이터 받아오기
                    const type = textArr[num][0].trim(); // 타입: phd, ms, us, rf, al 등
                    const name = textArr[num][1].trim();
                    const email = textArr[num][2].trim();
                    const research_area = textArr[num][3].trim();
                    const imagelink = textArr[num][4].trim();
                    const company = textArr[num][5].trim();

                    // Alumni에서 취직한 사람 정보 입력 (HTML 양식에 맞게 간소화)
                    // member.html 양식은 member-interest에 일반 텍스트를 사용하므로
                    // strong 태그 대신 괄호를 사용하여 포맷을 조정합니다.

                    const formattedResearchArea = research_area;

                    // 해당 타입에 맞는 HTML 그리드 ID 선택
                    switch (type) {
                        case "vs": // Visiting Scholar는 HTML에 그리드 ID가 추가되어야 작동합니다.
                            $ul_list = $("#vs-grid");
                            break;

                        case "rf":
                            $ul_list = $("#rf-grid");
                            break;

                        case "phd":
                            $ul_list = $("#phd-grid");
                            break;

                        case "ms":
                            $ul_list = $("#ms-grid");
                            break;

                        case "bm":
                            $ul_list = $("#bm-grid");
                            break;

                        case "us":
                            $ul_list = $("#us-grid");
                            break;

                        case "al": // Graduate Alumni
                            $ul_list = $("#al-grid");
                            break; 
                            

                        default:
                            $ul_list = null; // 처리하지 않는 타입
                            break;
                    }

                    // 선택된 그리드에 멤버 카드 삽입
                    if ($ul_list && $ul_list.length) {
                        // member.html의 <div class="member-card"> 구조에 맞춤          
                        if (company != "") {
                            $ul_list.append(`
                                <div class="member-card">
                                    <div class="member-photo" style="background-image: url('assets/images/member/${imagelink}');"></div>
                                    <div class="member-info">
                                        <h4 class="member-name">${name}</h4>
                                        <p class="member-role">${email}</p>
                                        <p class="member-interest">${formattedResearchArea}</p> <br>
                                        <p class="member-role"> Current : ${company}</p>
                                    </div>
                                </div>
                            `);
                        }
                        else{
                            $ul_list.append(`
                                <div class="member-card">
                                    <div class="member-photo" style="background-image: url('assets/images/member/${imagelink}');"></div>
                                    <div class="member-info">
                                        <h4 class="member-name">${name}</h4>
                                        <p class="member-role">${email}</p>
                                        <p class="member-interest">${formattedResearchArea}</p>
                                    </div>
                                </div>
                            `);
                        }
                        
                        

                    }
                }
            }
        }
    });
}

// CSV 파싱 함수는 그대로 유지
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    if (!re_valid.test(text)) return null;
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

// jQuery의 document ready 상태에서 loaded 함수를 호출하여 실행 보장
// HTML에서 jQuery를 로드한다는 가정이 필요합니다.
$(document).ready(function() {
    loaded();
});