const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}
const generateBtn = document.getElementById("generateBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const clearBtn = document.getElementById("clearBtn");
const saveCvBtn = document.getElementById("saveCvBtn");
const saveMessage = document.getElementById("saveMessage");

const CV_API_BASE_URL = "https://cv-builder-app-x606.onrender.com/api/cv";
const templateStyle = document.getElementById("templateStyle");
const accentColor = document.getElementById("accentColor");
const cvPreview = document.getElementById("cvPreview");

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function fillText(elementId, value, fallbackText) {
  const element = document.getElementById(elementId);
  element.textContent = value ? value : fallbackText;
}
function setFieldValue(id, value) {
  const field = document.getElementById(id);

  if (field && value) {
    field.value = value;
  }
}

function collectCVData() {
  return {
    fullName: getValue("fullName"),
    jobTitle: getValue("jobTitle"),
    email: getValue("email"),
    phone: getValue("phone"),
    address: getValue("address"),
    about: getValue("about"),
    experience: getValue("experience"),
    education: getValue("education"),
    skills: getValue("skills"),
    certifications: getValue("certifications"),
    languages: getValue("languages"),
    templateStyle: templateStyle ? templateStyle.value : "template-classic",
    accentColor: accentColor ? accentColor.value : "#2563eb"
  };
}
function updateTemplate() {
  if (!cvPreview) {
    return;
  }

  const selectedTemplate = templateStyle ? templateStyle.value : "template-classic";
  const selectedColor = accentColor ? accentColor.value : "#2563eb";

  cvPreview.classList.remove(
    "template-classic",
    "template-modern",
    "template-elegant"
  );

  cvPreview.classList.add(selectedTemplate);
  cvPreview.style.setProperty("--accent-color", selectedColor);
}
function generateCV() {
  const fullName = getValue("fullName");
  const jobTitle = getValue("jobTitle");
  const email = getValue("email");
  const phone = getValue("phone");
  const address = getValue("address");
  const about = getValue("about");
  const experience = getValue("experience");
  const education = getValue("education");
  const skills = getValue("skills");
  const certifications = getValue("certifications");
  const languages = getValue("languages");

  const contactParts = [];

  if (email) {
    contactParts.push(email);
  }

  if (phone) {
    contactParts.push(phone);
  }

  if (address) {
    contactParts.push(address);
  }

  fillText("previewName", fullName, "Your Name");
  fillText("previewTitle", jobTitle, "Your Job Title");
  fillText(
    "previewContact",
    contactParts.join(" | "),
    "Email | Phone | Address"
  );
  fillText("previewAbout", about, "Your summary will appear here.");
  fillText("previewExperience", experience, "Your experience will appear here.");
  fillText("previewEducation", education, "Your education will appear here.");
  fillText("previewSkills", skills, "Your skills will appear here.");
  fillText(
    "previewCertifications",
    certifications,
    "Your certifications will appear here."
  );
  fillText("previewLanguages", languages, "Your languages will appear here.");
    updateTemplate();
}

async function downloadPDF() {
  generateCV();

  const cvElement = document.getElementById("cvPreview");
  const canvas = await html2canvas(cvElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });
  async function saveCV() {
  generateCV();

  if (saveMessage) {
    saveMessage.textContent = "Saving CV...";
  }

  try {
    const response = await fetch(`${CV_API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(collectCVData())
    });

    const data = await response.json();

    if (!response.ok) {
      saveMessage.textContent = data.message || "Could not save CV";
      return;
    }

    saveMessage.textContent = data.message;
  } catch (error) {
    saveMessage.textContent = "Could not connect to backend";
  }
}

async function loadSavedCV() {
  try {
    const response = await fetch(`${CV_API_BASE_URL}/my-cv`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 404) {
      generateCV();
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      generateCV();
      return;
    }

    setFieldValue("fullName", data.fullName);
    setFieldValue("jobTitle", data.jobTitle);
    setFieldValue("email", data.email);
    setFieldValue("phone", data.phone);
    setFieldValue("address", data.address);
    setFieldValue("about", data.about);
    setFieldValue("experience", data.experience);
    setFieldValue("education", data.education);
    setFieldValue("skills", data.skills);
    setFieldValue("certifications", data.certifications);
    setFieldValue("languages", data.languages);

    if (templateStyle && data.templateStyle) {
      templateStyle.value = data.templateStyle;
    }

    if (accentColor && data.accentColor) {
      accentColor.value = data.accentColor;
    }

    generateCV();
  } catch (error) {
    generateCV();
  }
}

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  const fileName = getValue("fullName")
    ? `${getValue("fullName").replace(/\s+/g, "_")}_CV.pdf`
    : "cv.pdf";

  pdf.save(fileName);
}

generateBtn.addEventListener("click", generateCV);
if (saveCvBtn) {
  saveCvBtn.addEventListener("click", saveCV);
}
downloadPdfBtn.addEventListener("click", downloadPDF);

clearBtn.addEventListener("click", function () {
  setTimeout(function () {
    generateCV();
  }, 0);
});
const liveFields = [
  "fullName",
  "jobTitle",
  "email",
  "phone",
  "address",
  "about",
  "experience",
  "education",
  "skills",
  "certifications",
  "languages"
];

liveFields.forEach(function (id) {
  const field = document.getElementById(id);

  if (field) {
    field.addEventListener("input", generateCV);
  }
});

window.addEventListener("load", function () {
  loadSavedCV();
});
if (templateStyle) {
  templateStyle.addEventListener("change", generateCV);
}

if (accentColor) {
  accentColor.addEventListener("input", generateCV);
}