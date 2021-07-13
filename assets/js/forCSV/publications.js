function loaded() {
    let ul_list; //ul_list선언

    //데이터 CSV 불러오기
    const fileName = "../assets/csv/publications.csv";

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
                category = null;
                content = null;

                if(rowArr[num][2] == "\""){
                    category = rowArr[num][0];
                    content = rowArr[num].slice(3,-2);
                    content = content.replace(/\"\"/gi, "\"")
                }
                else{
                    textArr[num] = CSVtoArray(rowArr[num]);
                    category = textArr[num][0];
                    content = textArr[num].slice(1,);
                }

                if (category !== undefined && num > 0) {
                    //데이터 받아오기!!

                    switch (category) {
                        case "1":
                            ul_list = $("#Journals");
                            break;
                        case "2":
                            ul_list = $("#Conferences");
                            break;
                        case "3":
                            ul_list = $("#Books");
                            break;                                                        
                        default:
                            break;
                    }

                                      //여기다가 html 짜서 넣는거구나
                    ul_list.append(`<li>${content}</li>`)
                    
                }
            }
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

