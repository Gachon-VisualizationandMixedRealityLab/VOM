function loaded() {
    let ul_list; //ul_list선언

    //데이터 CSV 불러오기
    const fileName = "./assets/csv/grant.csv";

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

            //한 줄씩 정보를 넣어줍니당~
            for (var num = 0; num < rowArr.length; num++) {
                full_text = CSVtoArray(rowArr[num]);

                category = full_text[0];
                content = full_text[2];
                imagelink = full_text[1];
                console.log(category);

                if (category !== undefined && num > 0) {
                    //데이터 받아오기!!

                    switch (category) {
                        case "1":
                            ul_list = $("#Grant");
                            break;
                        case "2":
                            ul_list = $("#Collaboration");
                            break;                                                      
                        default:
                            break;
                    }

                    // 여기서 margin-bottom 값을 조정하여 항목 간 간격 변경
                    // 예: 50px로 설정하면 더 넓은 간격, 20px로 설정하면 더 좁은 간격
                    ul_list.append(`<li style="margin-bottom: 50px; list-style-type: none;">
                        <div style="display: flex; align-items: flex-start; width: 100%;">
                            <div style="width: 160px; min-width: 160px; display: flex; align-items: flex-start; justify-content: center; margin-right: 50px;">
                                <img style="max-width: 100%; max-height: 120px; object-fit: contain;" src="assets/images/grant/${imagelink}" alt="">
                            </div>
                            <div style="flex: 1;">
                                <p style="margin-top: 0;">${content}</p>
                            </div>
                        </div>
                    </li>`)               
                }
            }
            
            // 또는 CSS를 동적으로 추가하여 모든 항목에 일괄 적용할 수도 있습니다
            /* 
            $("<style>")
                .prop("type", "text/css")
                .html(`
                    #Grant li, #Collaboration li {
                        margin-bottom: 50px !important;
                    }
                `)
                .appendTo("head");
            */
        }
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