let isBirthday = false;
let birthdayC = JSON.parse(localStorage.getItem("birthdayClose"));
let birthdayClose = birthdayC !== null ? birthdayC : false;
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
        if (this.checked === true) {
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
    if (toggle.checked === true) {
        video.classList.add("hidden");
        image.classList.remove("hidden");
        createKoreanGreeting(false);
    } else {
        createKoreanGreeting(true);
    }

    if (!audio || typeof audio.play !== "function") {
        showNotification(
            "사용하시는 브라우저가 오디오 태그를 지원하지 않습니다.",
            "r"
        );
    }
    if (!video || typeof video.play !== "function") {
        showNotification(
            "사용하시는 브라우저가 비디오 태그를 지원하지 않습니다.",
            "r"
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
        fetch("./greeting.json")
            .then((res) => res.json())
            .then((greetings) => {
                username = greetings.defaultName;
                localStorage.setItem("username", JSON.stringify(username));
            });
    }
}

async function createKoreanGreeting(bo) {
    if (!bo) return $("#greeting").text("");
    const res = await fetch("./greeting.json");
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

    if (isBirthday && !birthdayClose) {
        document.querySelector(".birthdayCard").style.display = "block";
    }

    $("#greeting").text(randomGreeting.replace("${username}", username));
}
function showNotification(msg, color = "#FFF") {
    const container = document.getElementById("notification-container");

    const notification = document.createElement("div");
    notification.className = "notification";
    if (color === "y") {
        color = "#FFEB3B";
    } else if (color === "b") {
        color = "#2196F3";
    } else if (color === "g") {
        color = "#4CAF50";
    } else if (color === "r") {
        color = "#F44336";
    }

    const statusDot = `
        <span class="status-dot" style="background-color: ${color};"></span>
    `;

    notification.innerHTML = `
        ${statusDot}
        <span class="close-btn">
            <span class="material-symbols-outlined">close</span>
        </span>
        ${msg}
    `;
    const closeBtn = notification.querySelector(".close-btn");
    closeBtn.addEventListener("click", function () {
        notification.remove();
    });

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
        showNotification("인터넷에 다시 연결되었습니다.", "g");
    } else {
        showNotification("인터넷 연결이 끊어졌습니다.", "r");
    }
}

if (!navigator.onLine) {
    showNotification("인터넷에 연결되어 있지 않습니다.", "r");
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
    if (username === input.value)
        return showNotification("이름이 같습니다.", "y");
    localStorage.setItem("username", JSON.stringify(input.value));
    showNotification("이름이 변경되었습니다.", "g");
    username = input.value;
});
