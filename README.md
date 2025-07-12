# 📋 Google Form Autofiller - Chrome Extension

This Chrome Extension helps you **automatically fill repeated information** in Google Forms (like name, email, registration number, etc.) with a single click. It’s useful for students and professionals who frequently submit similar data in multiple forms.

---

## ✨ Features

* ✅ Automatically fills text input fields like Name, Email, Register number, Programme
* ✅ Runs only on Google Forms (secure and scoped)

---

## 🗂️ Project Structure

```
google-form-autofiller/
├── manifest.json        # Chrome extension manifest (v3)
├── content.js           # Script injected into Google Forms
├── popup.html           # UI popup to trigger autofill
├── popup.js             # Logic to run autofill from popup
└── icon.png             # 128x128 icon for the extension
```

---

## 📦 Installation

### 🧩 Load the Extension in Chrome

1. **Download the project folder** or clone the repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Toggle **Developer Mode** (top right).
4. Click **"Load unpacked"**.
5. Select the `autofill-extension` folder.
6. Pin the extension to the toolbar (optional).

You can manually review or edit the values before submitting.

---

## 🛠️ Customization 

To change the default autofill values:

1. Open `content.js` and `popup.js`.
2. Locate the following block:

```javascript
const autofillData = {
  "Name": "ABC XYZ",
  "Email": "example_00@coll.org.in",
  "Register number": "BM0220004",
  "Programme": "PQY",
  "I read and understood": "Yes"
};
```
3. Modify the values as needed, then reload the extension:

   * Go to `chrome://extensions/`
   * Click the **Reload** icon next to the extension.
     
---

## 🧠 How It Works

* The extension uses **content scripts** to access and manipulate the form DOM.
* It scans the form for **input fields and labels**.
* If the label matches a predefined key (like "Name"), it inserts the corresponding value.

---

## 📌 Known Limitations

* Works best with Google Forms in **default layout**.
* Matching is done using **label text**, so slight label changes may cause mismatches.
* Doesn’t handle dropdowns or multi-choice grids (yet).

---

## 📃 License

This project is open-source and free to use. You may modify it for personal or educational purposes.

---

## 🤝 Contributing

Want to make it dynamic (edit values in popup)? Add dropdown or checkbox support? PRs and suggestions are welcome!

---
