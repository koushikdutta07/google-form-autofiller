chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_FORM_SCHEMA") {
        const schema = [];

        document.querySelectorAll(".Qr7Oae").forEach((block, index) => {
            const labelEl = block.querySelector("div[role='heading']");
            if (!labelEl) return;

            const label = labelEl.innerText.trim();
            let type = null;
            let options = [];

            if (block.querySelector("input[type='email']")) type = "email";
            else if (block.querySelector("textarea")) type = "textarea";
            else if (block.querySelector("input[type='text']")) type = "text";
            else if (block.querySelector("[role='radio']")) type = "radio";
            else if (block.querySelector("[role='checkbox']"))
                type = "checkbox";

            if (type === "radio" || type === "checkbox") {
                options = [...block.querySelectorAll(".AB7Lab")].map((o) =>
                    o.innerText.trim()
                );
            }

            if (type) {
                schema.push({ index, label, type, options });
            }
        });

        sendResponse(schema);
    }

    if (msg.type === "AUTOFILL") {
        const blocks = document.querySelectorAll(".Qr7Oae");

        msg.data.forEach((field) => {
            const block = blocks[field.index];
            if (!block) return;

            const input = block.querySelector(
                "input[type='text'], input[type='email'], textarea"
            );

            if (input && field.values.length) {
                input.focus();
                input.value = field.values[0];
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }

            const optionLabels = block.querySelectorAll(".AB7Lab");
            optionLabels.forEach((label) => {
                if (field.values.includes(label.innerText.trim())) {
                    label.click();
                }
            });
        });
    }
});
