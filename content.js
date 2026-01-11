let autofillTimeout = null;

function autofillTextFields(forceUpdate = false) {
    chrome.storage.sync.get("autofillData", (res) => {
        if (!res.autofillData || !res.autofillData.length) return;

        const blocks = document.querySelectorAll(".Qr7Oae");
        if (blocks.length === 0) return; // Form not ready yet

        blocks.forEach((block) => {
            const labelEl = block.querySelector("div[role='heading']");
            if (!labelEl) return;

            const questionText = labelEl.innerText.trim();
            if (!questionText) return;

            res.autofillData.forEach((field) => {
                if (!field.label || !field.value) return;
                if (!questionText.includes(field.label)) return;

                const input = block.querySelector(
                    "input[type='text'], textarea"
                );

                if (input) {
                    // Update if empty or if forceUpdate is true (for storage changes)
                    if (!input.value || forceUpdate) {
                        input.focus();
                        input.value = field.value;
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                        // Also trigger blur to ensure Google Forms recognizes the change
                        input.dispatchEvent(new Event("blur", { bubbles: true }));
                    }
                }
            });
        });
    });
}

// Debounced version for MutationObserver
function debouncedAutofill() {
    if (autofillTimeout) clearTimeout(autofillTimeout);
    autofillTimeout = setTimeout(autofillTextFields, 300);
}

/* 1️⃣ Run once after load (delayed) */
setTimeout(autofillTextFields, 1200);

/* 2️⃣ Retry a few times (Google Forms loads slowly) */
let retries = 0;
const retryInterval = setInterval(() => {
    autofillTextFields();
    retries++;

    if (retries > 5) {
        clearInterval(retryInterval);
    }
}, 1000);

/* 3️⃣ Observe DOM changes (SPA-safe) */
const observer = new MutationObserver(() => {
    debouncedAutofill();
});

if (document.body) {
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

/* 4️⃣ Listen for storage changes (when data is updated in popup) */
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.autofillData) {
        // Re-autofill when storage data changes - try multiple times to ensure it works
        setTimeout(() => autofillTextFields(true), 100);
        setTimeout(() => autofillTextFields(true), 500);
        setTimeout(() => autofillTextFields(true), 1000);
    }
});

/* 5️⃣ Listen for messages from popup */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autofill") {
        // Trigger autofill when popup sends message
        setTimeout(() => autofillTextFields(true), 100);
        setTimeout(() => autofillTextFields(true), 500);
        setTimeout(() => autofillTextFields(true), 1000);
        sendResponse({ success: true });
    }
    return true;
});

/* 6️⃣ Run on page load/reload */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(autofillTextFields, 500);
    });
} else {
    // DOM already loaded
    setTimeout(autofillTextFields, 500);
}
