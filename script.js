const generateBtn = document.getElementById("generateBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

function valueOrFallback(value, fallbackText) {
  return value.trim() ? value.trim() : fallbackText;
}

function generateCV() {
  const fullName = document.getElementById("fullName").value;
  const jobTitle = document.getElementById("jobTitle").value;
  const about = document.getElementById("about").value;
  const experience = document.getElementById("experience").value;
  const education = document.getElementById("education").value;
  const skills = document.getElementById("skills").value;
  const certifications = document.getElementById("certifications").value;
  const languages = document.getElementById("languages").value;

  document.getElementById("previewName").textContent = valueOrFallback(fullName, "Your Name");
  document.getElementById("previewTitle").textContent = valueOrFallback(jobTitle, "Your Job Title");
  document.getElementById("previewAbout").textContent = valueOrFallback(about, "Your about section will appear here.");
  document.getElementById("previewExperience").textContent = valueOrFallback(experience, "Your experience will appear here.");
  document.getElementById("previewEducation").textContent = valueOrFallback(education, "Your education will appear here.");
  document.getElementById("previewSkills").textContent = valueOrFallback(skills, "Your skills will appear here.");
  document.getElementById("previewCertifications").textContent = valueOrFallback(certifications, "Your certifications will appear here.");
  document.getElementById("previewLanguages").textContent = valueOrFallback(languages, "Your languages will appear here.");
}

async function downloadPDF() {
  generateCV();

  const cvElement = document.getElementById("cvPreview");
  const canvas = await html2canvas(cvElement, {
    scale: 2,
    useCORS: true
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

  pdf.save("cv.pdf");
}

generateBtn.addEventListener("click", generateCV);
downloadPdfBtn.addEventListener("click", downloadPDF);