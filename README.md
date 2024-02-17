# VOM
The homepage repository of VOM

Visualization of Medical image (or Mixed Reality) Lab


## Usage - CSV
**주의사항**
1. 셀이 비워져 있는데 page내에서 줄이 더 생긴다면, '우클릭-삭제'를 이용해서 한 번 더 지워주세요
2. 각 내용은 csv에 입력된 순서대로 카테고리에 채워집니다.
3. 채워진 셀을 지우시는 경우, del key를 이용해 삭제를 하셨더라도 '우클릭-삭제'를 이용해서 한 번 더 지워주세요.
4. 문제가 생기시면 (CSV수정 후 page에 내용이 채워지지 않거나 이상하게 채워지는 경우 등등,,) 바로 카톡주세요~~

### member.csv
degree | name | email | RA | imagelink
---- | ---- | ---- | ---- | ----
vs/gs/us | name | email | research area | file name

* rf - Research Professor
* phd - Graduate Students (Ph.D)
* ms - Graduate Students (M.S)
* vs - Visiting Scholar
* bm - Graduate Students (bachelor-master)
* us - Undergraduate Students
* image의 경우 assets/images/member 에 사진을 넣고, imagelink칸에 확장자를 포함한 이름 입력 (member_name.jpg)


### research.csv
field | title | imagelink | text 
---- | ---- | ---- | ---- 
1/2/3/4 | title | file name | content

* field : 4가지 대분류. 
* image의 경우 assets/images/research 에 사진을 넣고, imagelink칸에 확장자를 포함한 이름 입력 (research_name.jpg)
* text에는 설명 content를 넣어주세요. 엔터를 넣고 싶은 곳에는 ```<br>```, bold처리를 하고싶으시다면 ```<b>```를 넣어주세요. 
* 만약 research부분의 text에 큰따옴표(")를 넣고싶으시다면,,, 카톡주세요,,,,


### publications.csv
field | title 
---- | ---- 
1/2/3 | title

* 1 - International Journals
* 2 - International Conferences
* 3 - Books
* title 부분에 각 줄에 들어갈 내용을 작성해 주세요
* bold처리를 하고싶으시다면 ```<b>```를 넣어주세요.
* title부분에서는 반드시 text로 마무리 되어야 합니다. (마지막 커서 앞에 공백(엔터 포함)이 있어서는 안됩니다.)


### demo.csv
field | title | youtube link | text | paper 
---- | ---- | ---- | ---- | ---- 
1 | title | video code | content | paper

* field 부분에는 1을 채워주세요
* video code => 공유 눌렀을 때 바로 나오는 주소 "https://youtu.be/????" 에서 물음표 부분만 넣어주세요.
* 퍼가기 허용인 동영상만 재생이 가능합니다.
* text에는 설명 content를 넣어주세요. 엔터를 넣고 싶은 곳에는 ```<br>```, bold처리를 하고싶으시다면 ```<b>```를 넣어주세요. 
* 만약 demo부분의 text에 큰따옴표(")를 넣고싶으시다면,,, 카톡주세요,,,,
* paper에도 "가 들어가나요,,, 들어가겠죠,,,? => 조만간 수정예정,,,


### gallery.csv
field | title | imagelink
---- | ---- | ---- 
1 | title | file name

* field 부분에는 1을 채워주세요
* title 부분에 학회나 프로그램 이름을 적어주세요.
* image의 경우 assets/images/gallery 에 사진을 넣고, imagelink칸에 확장자를 포함한 이름 입력 (gallery_name.jpg)


### main banner

* 배너 이미지 추가를 위해서는 images/main 폴더에 이미지 추가 후
  index.html에서   div class="banner header-text" 부분을 찾아 추가한 뒤에
  templatemo-sixteen.css 파일에서 .banner-item 부분을 찾아 추가해주세요
