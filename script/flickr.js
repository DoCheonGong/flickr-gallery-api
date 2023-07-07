// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
// https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

const base = "https://www.flickr.com/services/rest/?"
const key = "8b2360dbd357c82af53e7d45c0651619";
const method = "flickr.interestingness.getList";
const per_page = 500;
const format = "json";
const frame = document.querySelector("#list");

const url = `${base}method=${method}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;

fetch(url).then((data) => {
    let result = data.json();
    // 가져온 데이터 중에 json 형태의 값만 변수로 담는다
    return result;
}).then((json) => {
    let items = json.photos.photo;

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
            </div>
        </li>
        `;
    }) // 500개
    frame.innerHTML += htmls;

    const imgs = frame.querySelectorAll("img");
    const len = imgs.length; // 이미지 태그의 개수

    let count = 0; // 실제로 불러온 정보 가짓수

    for (let el of imgs) {
        el.addEventListener("load", () => {
            count++;
            if (count == len) isoLayout();
        })
    }
})

function isoLayout() {
    frame.classList.add("on");
    new Isotope("#list", {
        itemSelection: ".item",
        columnWidth: ".item",
        transitionDuration: "0.5s"
    });
}