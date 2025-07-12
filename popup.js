document.getElementById("fillBtn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
            const autofillData = {
                Name: "Aditya Nayak",
                Email: "adityanayak_ug22@tnnlu.ac.in",
                "Register number": "BA0220004",
                Programme: "BA. LLB( hons)",
                "I read and understood": "Yes",
            };

            const fillForm = () => {
                const inputs = document.querySelectorAll(
                    "input[type='text'], textarea"
                );

                inputs.forEach((input) => {
                    const labelElement = input
                        .closest(".Qr7Oae")
                        .querySelector(
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
