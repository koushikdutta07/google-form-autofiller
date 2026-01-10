const container = document.getElementById("fields");
const fillBtn = document.getElementById("fillBtn");
let schema = [];

document.addEventListener("DOMContentLoaded", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { type: "GET_FORM_SCHEMA" }, (res) => {
        if (!res || !res.length) {
            container.innerHTML = "<p>No form detected.</p>";
            return;
        }
        schema = res;
        renderUI();
    });
});

function renderUI() {
    container.innerHTML = "";

    schema.forEach((field, i) => {
        const div = document.createElement("div");
        div.className = "field";

        let html = `<strong>${field.label}</strong>`;

        if (
            field.type === "text" ||
            field.type === "email" ||
            field.type === "textarea"
        ) {
            html += `<input data-i="${i}" />`;
        }

        if (field.type === "radio" || field.type === "checkbox") {
            field.options.forEach((opt) => {
                html += `
          <label>
            <input type="${field.type}"
                   name="f-${i}"
                   value="${opt}">
            ${opt}
          </label>`;
            });
        }

        div.innerHTML = html;
        container.appendChild(div);
    });
}

fillBtn.addEventListener("click", async () => {
    const data = [];

    schema.forEach((field, i) => {
        const wrapper = container.children[i];
        const inputs = wrapper.querySelectorAll("input");
        const values = [];

        inputs.forEach((input) => {
            if (
                ((input.type === "checkbox" || input.type === "radio") &&
                    input.checked) ||
                (input.type === "text" && input.value)
            ) {
                values.push(input.value);
            }
        });

        if (values.length) {
            data.push({ index: field.index, values });
        }
    });

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, {
        type: "AUTOFILL",
        data,
    });
});
