let isElainaBirthday = false;
let birthdayC = JSON.parse(localStorage.getItem("birthdayClose"));
let birthdayClose = birthdayC !== null ? birthdayC : false;

document.addEventListener("DOMContentLoaded", function () {
    const closeCard = document.querySelector(".closeCard");

    closeCard.addEventListener("click", () => {
        const card = document.querySelector(".birthdayCard");
        localStorage.setItem("birthdayClose", true);
        card.style.display = "none";
    });

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        $("#time").text(`${hours}:${minutes}:${seconds}`);
        if (hours === "00" && minutes === "00" && seconds === "00") {
            updateDate();
        }
    }

    function updateDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const weekdays = [
            "일요일",
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
        ];
        const weekday = weekdays[now.getDay()];
        $("#date").text(`${year}.${month}.${day} ${weekday}`);
        if (month === "10" && day === "17") {
            isElainaBirthday = true;
        } else {
            localStorage.setItem("birthdayClose", false);
        }
    }

    setInterval(updateClock, 1000);
    updateClock();
    updateDate();
    createKoreanGreeting();

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const query = encodeURIComponent(searchInput.value.trim());
            if (query) {
                window.location.href = `https://www.google.com/search?q=${query}`;
            }
        }
    });
});

const links = [
    {
        name: "Github",
        url: "https://github.com",
    },
    {
        name: "Youtube",
        url: "https://www.youtube.com",
    },
    {
        name: "X",
        url: "https://x.com",
    },
];
let stored_links = JSON.parse(localStorage.getItem("shortcuts"));
let shortcut_data = stored_links !== null ? stored_links : links;

function createShortcuts() {
    const shortcut_element = $("#shortcutContainer");
    const closeShortcut = $("#closeShortcut");
    let add_shortcut = $("#addShortcut");
    let add_name = $("#addName");
    let add_url = $("#addUrl");
    let append_shortcut = $("#appendShortcut");

    shortcut_element.empty();

    for (let i = 0; i < shortcut_data.length; i++) {
        const link = shortcut_data[i];
        const link_name = link.name;
        const link_url = link.url;
        const link_element = `
            <div class="link">
                <a href="${link_url}"  rel="noopener noreferrer" title="${link_url}" class="shortcutLink">
                    <img src="https://www.google.com/s2/favicons?domain=${link_url}&sz=48"></img>
                    <p>${link_name}</p>
                </a>
                <a class="removeLink" title="Delete ${link_name} shortcut" removeLink="${link_url}">
                    <span class="material-symbols-outlined">close</span>
                </a>
            </div>`;
        shortcut_element.append(link_element);
    }

    const createLinkButton = `<div class="link">
        <a id="createShortcut" title="Add new shortcut" class="shortcutLink">
            <span class="material-symbols-outlined">add</span>
            <p>Add</p>
        </a>
    </div>`;

    shortcut_element.append(createLinkButton);
    const create_shortcut = $("#createShortcut");

    create_shortcut.click(function () {
        add_shortcut.toggleClass("flex").toggleClass("none");
    });
    closeShortcut.click(function () {
        add_shortcut.toggleClass("none").toggleClass("flex");
    });

    append_shortcut.click(function () {
        let link_name = add_name.val();
        let link_url = add_url.val();
        if (link_name && link_url) {
            if (
                !link_url.includes("http://") &&
                !link_url.includes("https://")
            ) {
                link_url = `http://${link_url}`;
            }
            shortcut_data.push({ name: link_name, url: link_url });
            localStorage.setItem("shortcuts", JSON.stringify(shortcut_data));
            add_shortcut.toggleClass("flex").toggleClass("none");
            createShortcuts();
        }
        add_name.val("");
        add_url.val("");
    });

    $(document).on("click", ".removeLink", function (e) {
        e.preventDefault();
        const linkToRemove = $(this).attr("removeLink");
        const newLinks = shortcut_data.filter(
            (link) => link.url !== linkToRemove
        );
        localStorage.setItem("shortcuts", JSON.stringify(newLinks));
        shortcut_data = newLinks;
        createShortcuts();
    });
}

createShortcuts();
let user = JSON.parse(localStorage.getItem("username"));
let username = user !== null ? user : "";

if (!username) {
    username = prompt(
        "당신의 이름을 알려주시겠어요? (네, 저는 굉장히 관대한 마녀랍니다.)"
    );
    if (username) {
        localStorage.setItem("username", JSON.stringify(username));
    } else {
        username = "이름 없는 방랑자";
    }
}
function createKoreanGreeting() {
    const morningGreetings = [
        "좋은 아침이에요. 저처럼 상쾌한 하루를 시작해보세요.",
        "아침부터 저를 생각하다니, 참 대단한 사람이네요?",
        "햇살만큼 빛나는 하루를 보내세요. 물론 저보단 못하겠지만요.",
    ];
    const afternoonGreetings = [
        "점심시간이에요. 저처럼 우아하게 식사를 즐기세요.",
        "이렇게 멋진 오후를 보내는 건, 저와 닮았네요?",
        "너무 무리하지 말고, 저처럼 여유롭게 살아야 해요.",
    ];
    const eveningGreetings = [
        "좋은 저녁입니다. 오늘 하루도 고생 많았어요.",
        "하루를 멋지게 마무리하는 건, 저에게나 어울리는 일이지만... 당신도 해보세요.",
        "별빛처럼 빛나는 밤을 보내세요. 물론 저처럼은 힘들겠지만요.",
    ];
    const now = new Date();
    const hour = now.getHours();
    let greetings;
    if (hour >= 5 && hour < 12) {
        greetings = morningGreetings;
    } else if (hour >= 12 && hour < 18) {
        greetings = afternoonGreetings;
    } else {
        greetings = eveningGreetings;
    }
    const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];
    if (isElainaBirthday) {
        if (!birthdayClose) {
            document.querySelector(".birthdayCard").style.display = "block";
        }
    }
    return $("#greeting").text(`${randomGreeting} ${username}님.`);
}
