let isBirthday = false;
let birthdayC = JSON.parse(localStorage.getItem("birthdayClose"));
let birthdayClose = birthdayC !== null ? birthdayC : false;
let play = localStorage.getItem("isPlaying") === "true";
let user = JSON.parse(localStorage.getItem("username"));
let username = user !== null ? user : "";
let volume1 = localStorage.getItem("volume");
let volume = volume1 !== null ? volume1 : 0.2;

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("bg-audio");
    const button = document.getElementById("toggleButton");
    const audioIcon = document.getElementById("audioIcon");
    const volumeSlider = document.getElementById("volumeSlider");

    if (play) {
        audio.play();
        play = true;
        audioIcon.textContent = "volume_up";
    } else {
        audioIcon.textContent = "volume_off";
    }

    volumeSlider.value = volume;
    audio.volume = volume;

    $("#volumeText").text(`${Math.floor(volume * 100)}%`);

    volumeSlider.addEventListener("input", function () {
        audio.volume = volumeSlider.value;
        localStorage.setItem("volume", volumeSlider.value);
        $("#volumeText").text(`${Math.floor(audio.volume * 100)}%`);
    });

    button.addEventListener("click", function () {
        if (audio.paused) {
            audio
                .play()
                .then(() => {
                    localStorage.setItem("isPlaying", "true");
                    audioIcon.textContent = "volume_up";
                })
                .catch((error) => {
                    console.error("Audio Error", error);
                });
        } else {
            audio.pause();
            localStorage.setItem("isPlaying", "false");
            audioIcon.textContent = "volume_off";
        }
    });

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
        if (month === "06" && day === "25") {
            isBirthday = true;
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
    { name: "Github", url: "https://github.com" },
    { name: "Youtube", url: "https://www.youtube.com" },
    { name: "X", url: "https://x.com" },
];

let storedLinks = JSON.parse(localStorage.getItem("shortcuts"));
let shortcutData = storedLinks !== null ? storedLinks : links;

function createShortcuts() {
    const container = $("#shortcutContainer");
    const closeBtn = $("#closeShortcut");
    const form = $("#addShortcut");
    const nameInput = $("#addName");
    const urlInput = $("#addUrl");
    const addBtn = $("#appendShortcut");

    container.empty();

    shortcutData.forEach((link) => {
        const element = `
            <div class="link">
                <a href="${link.url}" rel="noopener noreferrer" title="${link.url}" class="shortcutLink">
                    <img src="https://www.google.com/s2/favicons?domain=${link.url}&sz=48" />
                    <p>${link.name}</p>
                </a>
                <a class="removeLink" title="Delete ${link.name} shortcut" removeLink="${link.url}">
                    <span class="material-symbols-outlined">close</span>
                </a>
            </div>`;
        container.append(element);
    });

    container.append(`
        <div class="link">
            <a id="createShortcut" title="Add new shortcut" class="shortcutLink">
                <span class="material-symbols-outlined">add</span>
                <p>Add</p>
            </a>
        </div>`);

    $("#createShortcut").click(() => {
        form.toggleClass("flex").toggleClass("none");
    });

    closeBtn.click(() => {
        form.toggleClass("none").toggleClass("flex");
    });

    addBtn.click(() => {
        let name = nameInput.val();
        let url = urlInput.val();
        if (name && url) {
            if (!url.includes("http://") && !url.includes("https://")) {
                url = `http://${url}`;
            }
            shortcutData.push({ name, url });
            localStorage.setItem("shortcuts", JSON.stringify(shortcutData));
            form.toggleClass("flex").toggleClass("none");
            createShortcuts();
        }
        nameInput.val("");
        urlInput.val("");
    });

    $(document).on("click", ".removeLink", function (e) {
        e.preventDefault();
        const targetUrl = $(this).attr("removeLink");
        shortcutData = shortcutData.filter((link) => link.url !== targetUrl);
        localStorage.setItem("shortcuts", JSON.stringify(shortcutData));
        createShortcuts();
    });
}

createShortcuts();

if (!username) {
    username = prompt("당신의 이름을 알려주시겠어요?");
    if (username) {
        localStorage.setItem("username", JSON.stringify(username));
    } else {
        username = "";
    }
}

function createKoreanGreeting() {
    const morning = [
        `어서와 선생님. 기다리고 있었어. 아니아니! 오래 기다린건 아니야!`,
        `좋은아침이야 ${username}선생.`,
        `${username}선생님 아침은 먹었어? 아침을 먹어야 머리가 잘 돌아간다구.`,
    ];
    const afternoon = [
        `안녕 ${username}선생! 안바빠? 안바쁘면... 아니야! 혼잣말이야!`,
        `오늘은 아르바이트가 없어, 선생님은? 역시 바쁘구나...`,
        `선배들은 무얼 하고 있으려나?`,
    ];
    const evening = [
        `좋아 오늘 하루도 끝! 선생도 고생 많았어!`,
        `언젠가, 다른 사람들처럼 쉴 수 있으려나...`,
        `아비도스 학교도 언젠간 다른 학교처럼 돌아올거라고 믿어.`,
    ];

    const now = new Date();
    const hour = now.getHours();

    let greetingList;
    if (hour >= 5 && hour < 12) {
        greetingList = morning;
    } else if (hour >= 12 && hour < 18) {
        greetingList = afternoon;
    } else {
        greetingList = evening;
    }

    const randomGreeting =
        greetingList[Math.floor(Math.random() * greetingList.length)];

    if (isBirthday && !birthdayClose) {
        document.querySelector(".birthdayCard").style.display = "block";
    }

    $("#greeting").text(`${randomGreeting}`);
}
function showNotification(msg, isOnline) {
    const container = document.getElementById("notification-container");

    const notification = document.createElement("div");
    notification.className = "notification";

    const statusDot = `
        <span class="status-dot" style="background-color: ${
            isOnline === null ? (isOnline ? "#4CAF50" : "#F44336") : "#FFF"
        };"></span>
    `;

    notification.innerHTML = `
        ${statusDot}
        <span class="close-btn" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined">close</span>
        </span>
        ${msg}
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "fadeOut 0.5s forwards";
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

function updateStatus() {
    if (navigator.onLine) {
        showNotification("인터넷에 다시 연결되었습니다.", true);
    } else {
        showNotification("인터넷에 연결되어 있지 않습니다.", false);
    }
}

if (!navigator.onLine) {
    showNotification("인터넷에 연결되어 있지 않습니다.", false);
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
