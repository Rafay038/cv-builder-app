const generateBtn = document.getElementById("generateBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const clearBtn = document.getElementById("clearBtn");

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function fillText(elementId, value, fallbackText) {
  const element = document.getElementById(elementId);
  element.textContent = value ? value : fallbackText;
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
}

async function downloadPDF() {
  generateCV();

  const cvElement = document.getElementById("cvPreview");
  const canvas = await html2canvas(cvElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

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
downloadPdfBtn.addEventListener("click", downloadPDF);

clearBtn.addEventListener("click", function () {
  setTimeout(function () {
    generateCV();
  }, 0);
});

window.addEventListener("load", function () {
  generateCV();
});