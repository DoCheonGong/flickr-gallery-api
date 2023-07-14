// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
// https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value
const body = document.querySelector("body");
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

/*
let a = document.querySelector(".item a");
console.log(a); // null

item class는 동적으로 생성된 요소이므로 querySelector로 직접 참조를 할 수 없다
해결책: 이벤트 위임
실제로 존재하는 부모 태그인 #list에 이벤트를 위임해서 클릭 이벤트 전달 
*/

callData(url2);

frame.addEventListener("click", (e) => {
    e.preventDefault();
    /*
        target을 이용해서 a 태그 찾기 (안에서 섬네일 찾기)
    */
    // padding이 아닌 margin으로 거리를 계산하게되면
    // 그 공간은 #list로 인식되므로 return 실행 
    if (e.target == frame) return;

    // 이미지를 클릭했을 때 a 태그를 추적해서 href 속성을 뽑아야
    // 이후 큰 이미지 주소에 해당하는 그림을 동적으로 띄워줄 수 있다
    let target = e.target.closest(".item").querySelector(".thumb");

    // 반드시 클릭한 대상이 .thumb이어야만 보이도록 한다
    if (e.target == target) {
        // 클릭한 곳에서 a 태그를 찾고 href 속성 안에 있는
        // 큰 이미지 주소를 넣는다
        let imgSrc = target.parentElement.getAttribute("href");

        // 동적으로 popup을 aside 태그로 만든다
        let pop = document.createElement("aside");
        pop.classList.add("pop");
        let popup =
            `
                <div class="con">
                    <img src="${imgSrc}">
                </div>
                <span class="close">닫기</span>
            `;
        pop.innerHTML = popup;
        body.querySelector("main").append(pop);
        // body든 main이든 계단현상이 일어나지 않는 곳에
        // 동적요소를 넣어준다
        // body.append(pop);
        body.style.overflow = "hidden"; // 이미지 확대 시 스크롤 방지

        // 닫기 버튼으로 동적으로 생성 (body 대신 main을 써도 된다)
        body.addEventListener("click", (e) => {
            e.preventDefault();
            let pop = body.querySelector(".pop");
            if (pop) {
                let close = pop.querySelector(".close");
                if (e.target == close) {
                    pop.remove();
                    body.style.overflow = "auto";
                }
            }
        })
    }
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
        searchBtn.addEventListener("click", () => {
            // 버튼을 클릭하면, input 태그에 사용자가 넣은 값을 가져와서
            // URL 안의 tags에 넣고 해당 URL을 callData()의 인수자리에 넣어서
            // 해당 값을 검색하도록 하는 코딩을 적는다
            let tag = input.value;
            tag = tag.trim();
            const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;

            if (tag != "") {
                if (!items.length == 0) {
                    callData(url);
                } else {
                    frame.innerHTML = ""; // 높이값을 초기화하기 위한 빈 HTML
                    frame.style.height = "auto";
                    frame.classList.remove("on");

                    let isErrMsgs = frame.parentElement.querySelectorAll("p");
                    if (isErrMsgs.length > 0) {
                        frame.parentElement.querySelector('p').remove();
                    }

                    let errMsgs = document.createElement("p");
                    errMsgs.append("검색 결과가 없습니다. 검색어를 확인해주세요.");
                    frame.parentElement.append(errMsgs);
                }
            } else {
                // 로딩바를 없애고 높이값을 초기화하고 p태그를 만들어서
                // 경고문구를 출력한다
                frame.innerHTML = ""; // 높이값을 초기화하기 위한 빈 HTML
                frame.style.height = "auto";
                frame.classList.remove("on");

                let isErrMsgs = frame.parentElement.querySelectorAll("p");
                if (isErrMsgs.length > 0) {
                    frame.parentElement.querySelector('p').remove();
                }
                let errMsgs = document.createElement("p");
                errMsgs.append("검색어가 없습니다. 검색어를 입력해주세요.");
                frame.parentElement.append(errMsgs); // 부모 요소를 모를 때
                // frame.closest("#wrap").append(errMsgs); // 부모 요소를 알고 있을 때
            }
            // tag의 값이 없을 경우 "검색어가 없습니다. 검색어를 입력해주세요." 라는
            // 경고문구를 출력한다
        })

        input.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                let tag = input.value;
                const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;

                if (tag != "") {
                    if (!items.length == 0) {
                        callData(url);
                    } else {
                        frame.innerHTML = ""; // 높이값을 초기화하기 위한 빈 HTML
                        frame.style.height = "auto";
                        frame.classList.remove("on");

                        let isErrMsgs = frame.parentElement.querySelectorAll("p");
                        if (isErrMsgs.length > 0) {
                            frame.parentElement.querySelector('p').remove();
                        }

                        let errMsgs = document.createElement("p");
                        errMsgs.append("검색 결과가 없습니다. 검색어를 확인해주세요.");
                        frame.parentElement.append(errMsgs);
                    }
                } else {
                    // 로딩바를 없애고 높이값을 초기화하고 p태그를 만들어서
                    // 경고문구를 출력한다
                    frame.innerHTML = ""; // 높이값을 초기화하기 위한 빈 HTML
                    frame.style.height = "auto";
                    frame.classList.remove("on");

                    let isErrMsgs = frame.parentElement.querySelectorAll("p");
                    if (isErrMsgs.length > 0) {
                        frame.parentElement.querySelector('p').remove();
                    }
                    let errMsgs = document.createElement("p");
                    errMsgs.append("검색어가 없습니다. 검색어를 입력해주세요.");
                    frame.parentElement.append(errMsgs); // 부모 요소를 모를 때
                    // frame.closest("#wrap").append(errMsgs); // 부모 요소를 알고 있을 때
                }
            } // Enter 키를 누르면 검색
            // if(e.keyCode == 13)
        })
        // keyup: 키를 누르자 마자
        // keypress: 키를 누르고 뗀 뒤
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

        el.addEventListener("error", (e) => {
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