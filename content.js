const autofillData = {
    NAME: "Aditya Nayak",
    Email: "adityanayak_ug22@tnnlu.ac.in",
    "REGISTER NUMBER": "BA0220004",
    "MOBILE NUMBER": "1234567890",
};

const fillForm = () => {
    const inputs = document.querySelectorAll("input[type='text'], textarea");

    inputs.forEach((input) => {
        const labelElement = input
            .closest(".Qr7Oae")
            .querySelector("div[role='heading'], div[data-placeholder]");

        if (labelElement) {
            const labelText = labelElement.innerText.trim();

            Object.entries(autofillData).forEach(([key, value]) => {
                if (labelText.includes(key)) {
                    input.focus();
                    input.value = value;

                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }
            });
        }
    });

    // For MCQs (like Yes/No radio buttons)
    const radioLabels = document.querySelectorAll(".AB7Lab");

    radioLabels.forEach((label) => {
        const labelText = label.innerText.trim();
        if (labelText === autofillData["I read and understood"]) {
            label.click();
        }
    });
};

window.addEventListener("load", () => {
    setTimeout(fillForm, 1000); // wait a bit for form to render
});
