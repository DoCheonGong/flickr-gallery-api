// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
// https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

const base = "https://www.flickr.com/services/rest/?"
const key = "8b2360dbd357c82af53e7d45c0651619";
const method = "flickr.interestingness.getList";
const method2 = "flickr.photos.search";
const per_page = 500;
const format = "json";
const frame = document.querySelector("#list");
const loading = document.querySelector(".loading");
const input = document.querySelector("#search");
const searchBtn = document.querySelector(".btnSearch");
const url = `${base}method=${method}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;
const url2 = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=Apple&privacy_filter=1`;

callData(url2);
searchBtn.addEventListener("click", () => {
    // 버튼을 클릭하면, input 태그에 사용자가 넣은 값을 가져와서
    // URL 안의 tags에 넣고 해당 URL을 callData()의 인수자리에 넣어서
    // 해당 값을 검색하도록 하는 코딩을 적는다
    let tag = input.value;
    const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;

    callData(url);
})

function callData(url) {
    frame.innerHTML = "";
    frame.classList.remove("on");
    loading.classList.remove("off");

    fetch(url).then((data) => {
        let result = data.json();
        return result;
    }).then((json) => {
        let items = json.photos.photo;
        createList(items);
        delayLoading();
    })
}

function createList(items) {
    let htmls = "";
    items.map((el) => {
        let imgSrc = `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_m.jpg`;
        // 이미지 섬네일 주소
        let imgSrcBig = `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_b.jpg`;
        // 큰 이미지 주소
        htmls += `
        <li class="item">
            <div>
                <a href=${imgSrcBig}>
                    <img src=${imgSrc} alt="${el.title}">
                </a>
                <p>${el.title}</p>
                <!-- <span>
                    <img class="profile" src="http://farm${el.farm}.staticflickr.com/${el.server}/buddyicons/${el.owner}.jpg">
                    <strong>${el.owner}</strong>
                </span> -->
            </div>
        </li>
        `;
    })
    frame.innerHTML = htmls;
}

function delayLoading() {
    const imgs = frame.querySelectorAll("img");
    const len = imgs.length; // 이미지 태그의 개수

    let count = 0; // 실제로 불러온 정보 가짓수

    for (let el of imgs) {
        el.addEventListener("load", () => {
            count++;
            if (count == len) isoLayout();
        })

        el.addEventListener("error", () => {
            // 1. 오류가 발생하는 대상 지우기 (권장하지 않음)
            /* 
                e.currentTarget.closet(".item").style.display = "none";
                e.target.closet(".item").style.display = "none";
            */
            // 2. 오류 발생 시 대체 이미지로 때우기
            e.currentTarget.setAttribute("src", "img/placeholder.png")
        })
    }
}

function isoLayout() {
    loading.classList.add("off"); // off클래스를 붙여서 로딩바를 지워줍니다
    frame.classList.add("on");
    new Isotope("#list", {
        itemSelection: ".item",
        columnWidth: ".item",
        transitionDuration: "0.5s"
    });
}

function search() {

}