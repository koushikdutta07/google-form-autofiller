const fieldsContainer = document.getElementById("fields");
const addFieldBtn = document.getElementById("addField");

function createField(label = "", value = "") {
    const div = document.createElement("div");
    div.className = "field";

    div.innerHTML = `
        <input class="label" placeholder="Exact question text" value="${label}">
        <input class="value" placeholder="Value to fill" value="${value}">
    `;

    fieldsContainer.appendChild(div);
}

/* ➕ Add new field (DO NOT save yet) */
addFieldBtn.onclick = () => {
    createField();
};

/* Save only when user types */
function saveData() {
    const data = [];

    document.querySelectorAll(".field").forEach((f) => {
        const label = f.querySelector(".label").value.trim();
        const value = f.querySelector(".value").value.trim();

        if (label && value) {
            data.push({ label, value });
        }
    });

    chrome.storage.sync.set({ autofillData: data }, () => {
        // Notify content script that data was saved
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes("docs.google.com/forms")) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "autofill" }).catch(() => {
                    // Ignore errors if content script isn't ready
                });
            }
        });
    });
}

fieldsContainer.addEventListener("input", saveData);

/* Load saved data */
chrome.storage.sync.get("autofillData", (res) => {
    if (res.autofillData?.length) {
        res.autofillData.forEach((f) => createField(f.label, f.value));
    } else {
        createField();
    }
});
