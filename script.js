const subjects = [
// PRIMER AÑO
{ code: "ET1001", name: "Álgebra", year: 1, unlocks: ["ET1016"] },
{ code: "ET1002", name: "Cálculo I", year: 1, unlocks: ["ET1011"] },
{ code: "ET1003", name: "Informática", year: 1, unlocks: ["ET1013"] },
{ code: "ET1004", name: "Física I", year: 1, unlocks: ["ET1012"] },
{ code: "ET1005", name: "Inglés Científico-Técnico", year: 1, unlocks: ["ET1014"] },
{ code: "ET1006", name: "Química", year: 1, unlocks: ["ET1015"] },
{ code: "ET1007", name: "Cálculo II", year: 1, unlocks: ["ET1017"] },
{ code: "ET1008", name: "Física II", year: 1, unlocks: ["ET1020"] },
{ code: "ET1009", name: "Expresión Gráfica", year: 1, unlocks: ["ET1018"] },
{ code: "ET1010", name: "Historia de la Ciencia y la Tecnología", year: 1, unlocks: ["ET1019"] },

// SEGUNDO AÑO
{ code: "ET1011", name: "Estadística y Optimización", year: 2, unlocks: ["ET1023"] },
{ code: "ET1012", name: "Mecánica de Máquinas y Estructuras", year: 2, unlocks: ["ET1027"] },
{ code: "ET1013", name: "Electrotecnia", year: 2, unlocks: ["ET1025"] },
{ code: "ET1014", name: "Ingeniería Térmica", year: 2, unlocks: ["ET1024"] },
{ code: "ET1015", name: "Ciencia y Tecnología de Materiales", year: 2, unlocks: ["ET1029"] },
{ code: "ET1016", name: "Mecánica de Fluidos", year: 2, unlocks: ["ET1022"] },
{ code: "ET1017", name: "Empresa", year: 2, unlocks: ["ET1033"] },
{ code: "ET1018", name: "Electrónica", year: 2, unlocks: ["ET1030"] },
{ code: "ET1019", name: "Elasticidad y Resistencia de Materiales", year: 2, unlocks: ["ET1028"] },
{ code: "ET1020", name: "Teoría de Máquinas y Mecanismos", year: 2, unlocks: ["ET1032"] },

// TERCER AÑO
{ code: "ET1022", name: "Métodos Matemáticos", year: 3, unlocks: ["ET1038"] },
{ code: "ET1023", name: "Sistemas Automáticos", year: 3, unlocks: ["ET1031"] },
{ code: "ET1024", name: "Producción de Producción Industrial", year: 3, unlocks: ["ET1037"] },
{ code: "ET1025", name: "Máquinas Eléctricas", year: 3, unlocks: ["ET1021"] },
{ code: "ET1027", name: "Ampliación de Física", year: 3, unlocks: ["ET1026"] },
{ code: "ET1028", name: "Dibujo Industrial", year: 3, unlocks: ["ET1036"] },
{ code: "ET1029", name: "Tecnologías de Fabricación", year: 3, unlocks: ["ET1034"] },
{ code: "ET1030", name: "Automatización Industrial", year: 3, unlocks: ["ET1039"] },
{ code: "ET1032", name: "Informática Industrial", year: 3, unlocks: ["ET1040"] },
{ code: "ET1033", name: "Tecnologías del Medio Ambiente y Seguridad Industrial", year: 3, unlocks: ["ET1035"] },

// CUARTO AÑO
{ code: "ET1021", name: "Instalaciones Eléctricas de Media y Baja Tensión", year: 4, unlocks: [] },
{ code: "ET1026", name: "Teoría de Estructuras", year: 4, unlocks: [] },
{ code: "ET1031", name: "Proyectos de Ingeniería", year: 4, unlocks: [] },
{ code: "ET1034", name: "Prácticas Externas", year: 4, unlocks: [] },
{ code: "ET1035", name: "Ingeniería de Fluidos", year: 4, unlocks: [] },
{ code: "ET1036", name: "Tecnología de Materiales", year: 4, unlocks: [] },
{ code: "ET1037", name: "Calor y Frío Industrial", year: 4, unlocks: [] },
{ code: "ET1038", name: "Métodos Computacionales", year: 4, unlocks: [] },
{ code: "ET1039", name: "Nanotecnología", year: 4, unlocks: [] },
{ code: "ET1040", name: "Trabajo Final de Grado", year: 4, unlocks: [] },
];

let approved = new Set(JSON.parse(localStorage.getItem("approvedSubjects") || "[]"));
// Nuevo objeto para guardar las notas. Formato: { "ET1001": 8.5, "ET1002": 7.0 }
let grades = JSON.parse(localStorage.getItem("subjectGrades") || "{}");

// Variable global para saber qué asignatura estamos editando en el modal
let currentSubjectEditing = null;

function isUnlocked(subject) {
if (subject.year === 1) return true;
return subjects.some(s => s.unlocks.includes(subject.code) && approved.has(s.code));
}

function saveProgress() {
localStorage.setItem("approvedSubjects", JSON.stringify([...approved]));
localStorage.setItem("subjectGrades", JSON.stringify(grades)); // Guardar notas también
}

function updateCreditCounter() {
const credits = approved.size * 6;
const counter = document.getElementById("creditCounter");
counter.textContent = `Créditos aprobados: ${credits} / 240`;
}

function render() {
const container = document.getElementById("courses-container");
container.innerHTML = "";
updateCreditCounter();

for (let year = 1; year <= 4; year++) {
const section = document.createElement("div");
section.className = "course-section";

const title = document.createElement("h2");
title.className = "course-title";
title.textContent = `${year}º Curso`;
section.appendChild(title);

const grid = document.createElement("div");
grid.className = "grid";

subjects
.filter(s => s.year === year)
.forEach(subject => {
const card = document.createElement("div");
card.className = "card";

// Estructura base de la tarjeta
let cardHTML = `<strong>${subject.code}</strong><br>${subject.name}`;

// Si tiene nota guardada, la mostramos en la tarjeta
if (grades[subject.code] !== undefined) {
cardHTML += `<span class="grade-badge">Nota: ${grades[subject.code]}</span>`;
}

// Añadimos el botón de opciones (tres puntitos verticales: &#8942;)
cardHTML += `<button class="options-btn" onclick="openGradeModal(event, '${subject.code}', '${subject.name}')">&#8942;</button>`;

card.innerHTML = cardHTML;

// Lógica de colores y clics
if (approved.has(subject.code)) {
card.classList.add("approved");
} else if (!isUnlocked(subject)) {
card.classList.add("locked");
}

// Solo añadimos el event listener al card entero si no está bloqueada
if (!card.classList.contains("locked")) {
card.addEventListener("click", (e) => {
// Evitamos que al hacer clic en los puntitos se marque la asignatura como aprobada
if (e.target.classList.contains('options-btn')) return;

if (approved.has(subject.code)) {
approved.delete(subject.code);
} else {
approved.add(subject.code);
}
saveProgress();
render();
});
}

grid.appendChild(card);
});

section.appendChild(grid);
container.appendChild(section);
}
}

function clearProgress() {
localStorage.removeItem("approvedSubjects");
localStorage.removeItem("subjectGrades"); // Limpiamos también las notas
approved = new Set();
grades = {};
updateCreditCounter();
render();
}

// --- LÓGICA DEL MODAL DE NOTAS ---

function openGradeModal(event, subjectCode, subjectName) {
// Evitar que el click se propague a la tarjeta (por si acaso)
event.stopPropagation();

currentSubjectEditing = subjectCode;

const modal = document.getElementById("gradeModal");
const title = document.getElementById("modalSubjectTitle");
const display = document.getElementById("currentGradeDisplay");
const input = document.getElementById("gradeInput");

title.textContent = `${subjectCode} - ${subjectName}`;

if (grades[subjectCode] !== undefined) {
display.textContent = grades[subjectCode];
input.value = grades[subjectCode];
} else {
display.textContent = "Sin calificar";
input.value = "";
}

modal.style.display = "block";
}

function closeGradeModal() {
document.getElementById("gradeModal").style.display = "none";
currentSubjectEditing = null;
}

function saveGrade() {
const input = document.getElementById("gradeInput");
const value = parseFloat(input.value);

if (!isNaN(value) && value >= 0 && value <= 10) {
grades[currentSubjectEditing] = value;
saveProgress();
closeGradeModal();
render();
} else {
alert("Por favor, introduce una nota válida entre 0 y 10.");
}
}

function removeGrade() {
if (currentSubjectEditing && grades[currentSubjectEditing] !== undefined) {
delete grades[currentSubjectEditing];
saveProgress();
closeGradeModal();
render();
}
}

// Cerrar modal si se hace clic fuera de él
window.onclick = function(event) {
const modal = document.getElementById("gradeModal");
if (event.target == modal) {
closeGradeModal();
}
}

// Renderizado inicial
render();


render();
