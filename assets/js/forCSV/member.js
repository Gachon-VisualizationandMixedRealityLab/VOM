function loaded() {
    let ul_list; //ul_list선언

    //데이터 CSV 불러오기
    const fileName = "./assets/csv/member.csv";

    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function (data) {
            const allRow = data;
            let allData = "";

            //데이터 row별로 넣는 곳인듯?
            for (var singleRow = 0; singleRow < allRow.length; singleRow++) {
                allData += allRow[singleRow];
            }

            const rowArr = allData.split('\n');
            const textArr = new Array(rowArr.length);
            // ~~여기까지는 필요한가?


            //한 줄씩 정보를 넣어줍니당~
            for (var num = 0; num < rowArr.length; num++) {
                textArr[num] = CSVtoArray(rowArr[num]);

                if (textArr[num][0] !== undefined && num > 0) {

                    //데이터 받아오기!!
                    const name = textArr[num][1];
                    const email = textArr[num][2];
                    const email1 = email.slice(0, 3);
                    const email2 = email.slice(3, );

                    const research_area = textArr[num][3];

                    // Alumni에서 취직한 사람 정보 입력
                    function formatResearchArea(researchArea) {
                        return researchArea.split(', ').map(section => {
                            if (section.includes('Employed at')) {
                                const parts = section.split(' (');
                                const employmentParts = parts[1].split(' : ');
                                const label = employmentParts[0];
                                const value = employmentParts[1].replace(')', '');
                                return `${parts[0]}<br><br><strong>${label}</strong> : ${value}`;
                            }
                            return section;
                        }).join(', ');
                    }                    
                    const formattedResearchArea = formatResearchArea(research_area);


                    const imagelink = textArr[num][4];

                    switch (textArr[num][0]) {
                        case "vs":
                            ul_list = $("#vs");
                            break;

                        case "rf":
                            ul_list = $("#rf");
                            break;

                        case "phd":
                            ul_list = $("#phd");
                            break;

                        case "ms":
                            ul_list = $("#ms");
                            break;

                        case "bm":
                            ul_list = $("#bm");
                            break;

                        case "us":
                            ul_list = $("#us");
                            break;

                        case "al":
                            ul_list = $("#al");
                            break; 
                            

                        default:
                            break;
                    }

                // HTML 짜서 넣는 포맷
                    // ul_list.append(`<div class="team-member">
                    //                     <div class="thumb-container">
                    //                         <img src="assets/images/member/${imagelink}" alt="">
                    //                     </div>

                    //                     <div class="down-content">
                    //                         <h4>${name}</h4>
                    //                         <span><p>${email1}</p><p>${email2}</p></span>
                    //                         <p>research area : <br> ${research_area}</p>
                    //                     </div>
                    //                 </div>`)

                        ul_list.append(`<div class="team-member">
                            <div class="thumb-container">
                                <img src="assets/images/member/${imagelink}" alt="">
                            </div>

                            <div class="down-content">
                                <h4>${name}</h4>
                                <span><p>${email1}</p><p>${email2}</p></span>
                                <p>research area : <br> ${formattedResearchArea}</p>
                            </div>
                        </div>`)

                                }
            }
        }
    });
}

function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    //Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
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

