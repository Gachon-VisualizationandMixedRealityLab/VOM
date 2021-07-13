function loaded() {
    let ul_list; //ul_list선언

    //데이터 CSV 불러오기
    const fileName = "../assets/csv/research.csv";

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
                    const title = textArr[num][1];
                    const imagelink = textArr[num][2];
                    const text = textArr[num][3];

                    switch (textArr[num][0]) {
                        case "1":
                            ul_list = $("#research_1");
                            break;
                        case "2":
                            ul_list = $("#research_2");
                            break;
                        case "3":
                            ul_list = $("#research_3");
                            break;           
                        case "4":
                            ul_list = $("#research_4");
                            break;                                              
                        default:
                            break;
                    }

                                      //여기다가 html 짜서 넣는거구나
                    ul_list.append(`<div class="row">
                                    <div class="col-md-12">
                                        <div class="section-heading">
                                        <h2>${title}</h2>
                                    </div>
                        
                                    <div class="row research_box">
                                        <div class="col-md-5">
                                        <img src="assets/images/research/${imagelink}" alt="">
                                        </div>
                                        <div class="col-md-7">
                                        <p>
                                        ${text}
                                        </p>
                                        </div>
                                    </div>
                        
                                    
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

