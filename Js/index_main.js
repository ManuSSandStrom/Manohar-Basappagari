let Id = "Manohar-Basappagari";
let data = null;

const fallbackData = {
    profile: {
        firstname: "Manohar",
        lastname: "Basappagari",
        role: "MERN Stack Web Developer, Full Stack Web Architect & UI/UX Specialist",
        mobile: "+91 9515022680",
        email: "mernpixeldev@gmail.com",
        companyEmail: "mernpixeldev@gmail.com",
        website: "https://mernpixel.com",
        whatsapp: "919515022680",
        linkedin: "https://www.linkedin.com/in/manohar-basappagari-398606335",
        instagram: "https://www.instagram.com/mernpixel/?igsh=MXV3ZzlmMnYwMjRxZA=="
    }
};

async function loadData() {
    try {
        const response = await fetch("data.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load profile data");
        data = await response.json();
    } catch (error) {
        console.warn("Using fallback profile data:", error);
        data = fallbackData;
    }
}

function qs(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

function setText(selector, value) {
    const element = qs(selector);
    if (element) element.textContent = value;
}

async function main() {
    await loadData();
    const p = data.profile;
    Id = `${p.firstname}-${p.lastname}`.replace(/\s+/g, "-");

    setText("#firstname", p.firstname);
    setText("#lastname", p.lastname);
    setText("#role", p.role);
    setText("#firstnamePreview", p.firstname);
    setText("#lastnamePreview", p.lastname);
    setText("#rolePreview", p.role);

    const mobile = qs("#mobile");
    if (mobile) {
        mobile.textContent = p.mobile;
        mobile.href = "tel:" + p.mobile.replace(/\s+/g, "");
    }

    const email = qs("#email");
    if (email) {
        email.textContent = p.email;
        email.parentElement.href = "mailto:" + p.email;
    }

    const whatsapp = qs("#whatsapp");
    if (whatsapp && p.whatsapp) whatsapp.href = "https://wa.me/" + p.whatsapp;

    const linkedin = qs("#linkedin");
    if (linkedin) {
        if (p.linkedin) {
            linkedin.href = p.linkedin;
        } else {
            linkedin.style.display = "none";
        }
    }

    const instagram = qs("#instagram");
    if (instagram) {
        if (p.instagram) {
            instagram.href = p.instagram;
        } else {
            instagram.style.display = "none";
        }
    }

    generateQrCodePreview(Id);
    imgGenerator();
}

main();

function generateQrCodePreview(id) {
    if (!id || typeof QRCode === "undefined") return;
    let basePath = window.location.origin + window.location.pathname;
    if (basePath.endsWith("index.html")) {
        basePath = basePath.replace(/index\.html$/, "");
    }
    const vcfUrl = `${basePath}?@=${id}`;
    QRCode.toString(vcfUrl, { type: "svg", width: 240, height: 240, margin: 0 }, (err, svg) => {
        if (err) return console.error("QR Preview Error:", err);
        const qr = qs("#qrcodePreview");
        if (qr) qr.innerHTML = svg;
    });
}

function imgGenerator() {
    const buttons = [document.getElementById("imgdownloadBtn")].filter(Boolean);
    const cardPreview = document.getElementById("download-area");
    if (buttons.length === 0 || !cardPreview || typeof html2canvas === "undefined") return;

    const copyUrlSection = document.getElementById("copyurl-section");
    const previewFooter = document.getElementById("footer-section-preview");
    const footerLink = document.getElementById("footer-link");

    if (copyUrlSection) copyUrlSection.style.display = "none";
    if (previewFooter) previewFooter.style.display = "none";
    if (footerLink) footerLink.style.display = "flex";

    html2canvas(cardPreview, {
        scale: 2,
        backgroundColor: "#fff",
        useCORS: true,
        windowWidth: 2560
    })
    .then((canvas) => {
        const aspectRatio = canvas.height / canvas.width;
        const targetWidth = 400;
        const targetHeight = targetWidth * aspectRatio;
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;
        const ctx = resizedCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
        const imgData = resizedCanvas.toDataURL("image/jpeg", 1);
        buttons.forEach((btn) => {
            btn.href = imgData;
            btn.download = `${Id}-DigiCard.jpeg`;
        });
    })
    .catch((err) => console.error("Image generation failed:", err))
    .finally(() => {
        if (copyUrlSection) copyUrlSection.style.display = "flex";
        if (previewFooter) previewFooter.style.display = "flex";
        if (footerLink) footerLink.style.display = "none";
    });
}

function downloadVcard() {
    const a = document.createElement("a");
    a.href = "Assets/Profile/Manohar.vcf";
    a.download = "Manohar-Basappagari.vcf";
    a.click();
}

document.getElementById("vcarddownloadBtn")?.addEventListener("click", downloadVcard);
document.getElementById("vcarddownloadBtnMobile")?.addEventListener("click", downloadVcard);

document.getElementById("copyLink")?.addEventListener("click", function(e) {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href).catch(console.error);
});

function showCardPreview() {
    const cardPreview = document.getElementById("CardPreview");
    if (!cardPreview) return;
    cardPreview.style.top = "0";
    cardPreview.style.transition = "top 0.5s ease";
}

document.getElementById("qrpreviewbtn")?.addEventListener("click", showCardPreview);
document.getElementById("qrpreviewbtnmobile")?.addEventListener("click", showCardPreview);

document.getElementById("Closebtn")?.addEventListener("click", function() {
    const cardPreview = document.getElementById("CardPreview");
    if (cardPreview) cardPreview.style.top = "-9999px";
});

const whatsappNumber = "919515022680";

const fields = {
    name: {
        input: document.getElementById("form-name"),
        error: document.getElementById("nameerr"),
        message: "Please enter your name",
        pattern: null,
        required: true
    },
    mobile: {
        input: document.getElementById("form-mobile"),
        error: document.getElementById("mobileerr"),
        message: "Enter a valid 10-digit mobile number",
        pattern: /^[6-9]\d{9}$/,
        required: true
    },
    email: {
        input: document.getElementById("form-email"),
        error: document.getElementById("emailerr"),
        message: "Enter a valid email address",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true
    },
    company: {
        input: document.getElementById("form-company"),
        required: false
    },
    digit: {
        input: document.getElementById("form-digit"),
        required: false
    }
};

function sendToWhatsapp() {
    let isValid = true;

    Object.values(fields).forEach(field => {
        const value = field.input?.value.trim() || "";
        if (!field.required || !field.input) return;

        if (field.error) field.error.innerHTML = "";
        field.input.classList.remove("error");

        if (!value || (field.pattern && !field.pattern.test(value))) {
            if (field.error) field.error.innerHTML = field.message;
            field.input.classList.add("error");
            isValid = false;
        }
    });

    if (!isValid) return;

    const message =
        `Name : ${fields.name.input.value}\n` +
        `Mobile : ${fields.mobile.input.value}\n` +
        `Email : ${fields.email.input.value}\n` +
        `Company : ${fields.company.input.value || "Not provided"}\n` +
        `Digital Card : ${fields.digit.input.value || "Not provided"}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    Object.values(fields).forEach(field => {
        if (!field.input) return;
        field.input.value = "";
        if (field.error) field.error.innerHTML = "";
        field.input.classList.remove("error");
    });
}

Object.values(fields).forEach(field => {
    if (!field.required || !field.input) return;

    field.input.addEventListener("input", () => {
        const value = field.input.value.trim();
        if (value && (!field.pattern || field.pattern.test(value))) {
            if (field.error) field.error.innerHTML = "";
            field.input.classList.remove("error");
        }
    });
});

function openExchangeForm() {
    const formcardPreview = document.getElementById("container");
    if (!formcardPreview) return;
    formcardPreview.style.top = "0";
    formcardPreview.style.transition = "top 0.5s ease";
}

document.getElementById("openbtn")?.addEventListener("click", openExchangeForm);
document.getElementById("openbtnmobile")?.addEventListener("click", openExchangeForm);

document.getElementById("formclosebtn")?.addEventListener("click", function(e) {
    e.preventDefault();
    const formcardPreview = document.getElementById("container");
    if (formcardPreview) formcardPreview.style.top = "-9999px";
});
