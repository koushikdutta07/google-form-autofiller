document.getElementById("fillBtn").addEventListener("click", async () => {
    // 1️⃣ Read values from popup inputs
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },

        // 2️⃣ Pass data safely as arguments
        args: [
            {
                Name: name,
                Email: email,
                "Register number": "BA0220004",
                Programme: "BA. LLB( hons)",
                "I read and understood": "Yes",
            },
        ],

        function: (autofillData) => {
            const fillForm = () => {
                const inputs = document.querySelectorAll(
                    "input[type='text'], textarea"
                );

                inputs.forEach((input) => {
                    const labelElement = input
                        .closest(".Qr7Oae")
                        ?.querySelector(
                            "div[role='heading'], div[data-placeholder]"
                        );

                    if (labelElement) {
                        const labelText = labelElement.innerText.trim();

                        Object.entries(autofillData).forEach(([key, value]) => {
                            if (labelText.includes(key)) {
                                input.focus();
                                input.value = value;

                                input.dispatchEvent(
                                    new Event("input", { bubbles: true })
                                );
                            }
                        });
                    }
                });

                const radioLabels = document.querySelectorAll(".AB7Lab");

                radioLabels.forEach((label) => {
                    const labelText = label.innerText.trim();
                    if (labelText === autofillData["I read and understood"]) {
                        label.click();
                    }
                });
            };

            fillForm();
        },
    });
});
