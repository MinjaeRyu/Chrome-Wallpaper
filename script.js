let play = localStorage.getItem("isPlaying") === "true";
let user = JSON.parse(localStorage.getItem("username"));
let username = user !== null ? user : "";
let volume1 = localStorage.getItem("volume");
let volume = volume1 !== null ? volume1 : 0.2;
let checkBox1 = localStorage.getItem("checkBox1") === "true";

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("bg-audio");
    const button = document.getElementById("toggleButton");
    const audioIcon = document.getElementById("audioIcon");
    const volumeSlider = document.getElementById("volumeSlider");
    const video = document.getElementById("bg-video");
    const image = document.getElementById("bg-image");
    const toggle = document.getElementById("toggleSwitch-1");

    toggle.addEventListener("change", function () {
        localStorage.setItem("checkBox1", this.checked);
        if (this.checked) {
            video.classList.add("hidden");
            image.classList.remove("hidden");
            createKoreanGreeting(false);
        } else {
            video.classList.remove("hidden");
            image.classList.add("hidden");
            createKoreanGreeting(true);
        }
    });

    toggle.checked = checkBox1;
    if (toggle.checked) {
        video.classList.add("hidden");
        image.classList.remove("hidden");
        createKoreanGreeting(false);
    } else {
        createKoreanGreeting(true);
    }

    if (!audio || typeof audio.play !== "function") {
        showNotification(
            "사용하시는 브라우저가 오디오 태그를 지원하지 않아요.",
            "r",
            10
        );
    }
    if (!video || typeof video.play !== "function") {
        showNotification(
            "사용하시는 브라우저가 비디오 태그를 지원하지 않아요.",
            "r",
            10
        );
    }

    if (play) {
        audio.play();
        play = true;
        audioIcon.textContent = "volume_up";
    } else {
        audioIcon.textContent = "volume_off";
    }

    volumeSlider.value = volume;
    audio.volume = volume;
    document.getElementById("volumeText").textContent = `${Math.floor(
        volume * 100
    )}%`;

    volumeSlider.addEventListener("input", function () {
        audio.volume = volumeSlider.value;
        localStorage.setItem("volume", volumeSlider.value);
        document.getElementById("volumeText").textContent = `${Math.floor(
            audio.volume * 100
        )}%`;
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

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        document.getElementById(
            "time"
        ).textContent = `${hours}:${minutes}:${seconds}`;
        if (hours === "00" && minutes === "00" && seconds === "00") {
            updateDate();
        }
    }

    async function updateDate() {
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
        document.getElementById(
            "date"
        ).textContent = `${year}.${month}.${day} ${weekday}`;

        const res = await fetch("./config.json");
        const data = await res.json();
        const birthday = data.birthday;

        if (
            month === birthday.split("/")[0] &&
            day === birthday.split("/")[1]
        ) {
            showNotification(
                "오늘은 내 생일이야. 축하해줘!",
                "🎉",
                false,
                "birthDay"
            );
        }
    }

    setInterval(updateClock, 1000);
    updateClock();
    updateDate();

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
    const container = document.getElementById("shortcutContainer");
    const closeBtn = document.getElementById("closeShortcut");
    const form = document.getElementById("addShortcut");
    const nameInput = document.getElementById("addName");
    const urlInput = document.getElementById("addUrl");
    const addBtn = document.getElementById("appendShortcut");

    container.innerHTML = "";

    shortcutData.forEach((link) => {
        const element = document.createElement("div");
        element.className = "link";
        element.innerHTML = `
            <a href="${link.url}" rel="noopener noreferrer" title="${link.url}" class="shortcutLink">
                <img src="https://www.google.com/s2/favicons?domain=${link.url}&sz=48" />
                <p>${link.name}</p>
            </a>
            <a class="removeLink" title="Delete ${link.name} shortcut" data-url="${link.url}">
                <span class="material-symbols-outlined">close</span>
            </a>
        `;
        container.appendChild(element);
    });

    const addElement = document.createElement("div");
    addElement.className = "link";
    addElement.innerHTML = `
        <a id="createShortcut" title="Add new shortcut" class="shortcutLink">
            <span class="material-symbols-outlined">add</span>
            <p>Add</p>
        </a>
    `;
    container.appendChild(addElement);

    document.getElementById("createShortcut").onclick = () => {
        form.classList.toggle("flex");
        form.classList.toggle("none");
    };

    closeBtn.onclick = () => {
        form.classList.toggle("none");
        form.classList.toggle("flex");
    };

    addBtn.onclick = () => {
        let name = nameInput.value.trim();
        let url = urlInput.value.trim();
        if (name && url) {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = `http://${url}`;
            }
            shortcutData.push({ name, url });
            localStorage.setItem("shortcuts", JSON.stringify(shortcutData));
            form.classList.toggle("flex");
            form.classList.toggle("none");
            createShortcuts();
        }
        nameInput.value = "";
        urlInput.value = "";
    };

    container.addEventListener("click", function (e) {
        if (e.target.closest(".removeLink")) {
            e.preventDefault();
            const targetUrl = e.target
                .closest(".removeLink")
                .getAttribute("data-url");
            shortcutData = shortcutData.filter(
                (link) => link.url !== targetUrl
            );
            localStorage.setItem("shortcuts", JSON.stringify(shortcutData));
            createShortcuts();
        }
    });
}

createShortcuts();

if (!username) {
    username = prompt("당신의 이름을 알려주시겠어요?");
    if (username) {
        localStorage.setItem("username", JSON.stringify(username));
    } else {
        fetch("./config.json")
            .then((res) => res.json())
            .then((greetings) => {
                username = greetings.defaultName;
                localStorage.setItem("username", JSON.stringify(username));
            });
    }
}

async function createKoreanGreeting(bo) {
    if (!bo) return (document.getElementById("greeting").textContent = "");
    const res = await fetch("./config.json");
    const greetings = await res.json();

    const now = new Date();
    const hour = now.getHours();

    let greetingList;
    if (hour >= 5 && hour < 12) {
        greetingList = greetings.morning;
    } else if (hour >= 12 && hour < 18) {
        greetingList = greetings.afternoon;
    } else {
        greetingList = greetings.evening;
    }

    const randomGreeting =
        greetingList[Math.floor(Math.random() * greetingList.length)];
    document.getElementById("greeting").textContent = randomGreeting.replace(
        "${username}",
        username
    );
}

async function showNotification(msg, data, time = 5, type) {
    let text = "";
    let color = "";
    const container = document.getElementById("notification-container");

    const notification = document.createElement("div");
    notification.className = "notification";
    if (data === "y") {
        color = "background-color: #FFEB3B;";
    } else if (data === "b") {
        color = "background-color: #2196F3;";
    } else if (data === "g") {
        color = "background-color: #4CAF50;";
    } else if (data === "r") {
        color = "background-color: #F44336;";
    } else {
        text = data;
    }
    if (type) {
        if (type === "birthDay") {
        }
    }

    const statusDot = `<span class="status-dot" style="${color}">${text}</span>`;

    notification.innerHTML = `
        ${statusDot}
        <span class="close-btn">
            <span class="material-symbols-outlined">close</span>
        </span>
        ${msg}
    `;

    notification
        .querySelector(".close-btn")
        .addEventListener("click", function () {
            notification.remove();
        });

    container.appendChild(notification);
    const noti = document.querySelector(".notification");
    noti.onclick = (e) => {
        if (e.target.closest(".close-btn")) return;

        confetti({
            particleCount: 1000,
            spread: 200,
            origin: { y: 0.5 },
        });
    };
    if (time !== false) {
        setTimeout(() => {
            notification.style.animation = "fadeOut 0.5s forwards";
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, time * 1000);
    }
}

function updateStatus() {
    if (navigator.onLine) {
        showNotification("네트워크에 다시 연결되었어요.", "g");
    } else {
        showNotification("네트워크 연결이 끊어졌어요.", "r");
    }
}

if (!navigator.onLine) {
    showNotification("네트워크에 연결되어 있지 않아요.", "r");
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);

const settingsBtn = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsBtn = document.getElementById("closeSettings");

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (
        !settingsPanel.classList.contains("hidden") &&
        !settingsPanel.contains(e.target) &&
        !settingsBtn.contains(e.target)
    ) {
        settingsPanel.classList.add("hidden");
    }
});

const input = document.getElementById("nameInput");
const submitBtn = document.getElementById("submitBtn");

input.value = username;
submitBtn.addEventListener("click", () => {
    if (username === input.value) {
        return showNotification("전에 이름과 같아요.", "y");
    }
    localStorage.setItem("username", JSON.stringify(input.value));
    showNotification("이름이 성공적으로 변경했어요.", "g");
    username = input.value;
});

window.onerror = function (message, source, lineno, colno, error) {
    console.error(
        `에러: ${message} @ ${source}:${lineno}:${colno}\n객체: ${error}`
    );
    showNotification("에러가 발생했어요. 로그를 확인해주세요.", "r", false);
};
