function loaded() {
    let ul_list; //ul_list선언

    //데이터 CSV 불러오기
    const fileName = "../assets/csv/gallery.csv";

    $.ajax({
        url: fileName,
        dataType: 'text',
        success: function (data) {
            const allRow = data;
            let allData = "";

            ul_list = $("#here");

            //데이터 row별로 넣는 곳인듯?
            for (var singleRow = 0; singleRow < allRow.length; singleRow++) {
                allData += allRow[singleRow];
            }
            const rowArr = allData.split('\n');
            const textArr = new Array(rowArr.length);

            //한 줄씩 정보를 넣어줍니당~
            for (var num = 0; num < rowArr.length; num++) {
                textArr[num] = CSVtoArray(rowArr[num]);

                if (textArr[num][0] !== undefined && num > 0) {

                    //데이터 받아오기!!
                    const title = textArr[num][1];
                    const imagelink = textArr[num][2];


                    ul_list.append(`<div class="col-md-4">
                                        <div class = "imgcontainer">
                                        <a href="assets/images/gallery/${imagelink}" data-caption="${title}">
                                            <img class="fit-picture" src="assets/images/gallery/${imagelink}">
                                        </a>
                                        </div>
                                        <p>${title}</p>
                                    </div>`)


                }
            }
        }
    });

    setTimeout(function() {
        baguetteBox.run('.gallery');
        log("endtime");

      }, 100);

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

