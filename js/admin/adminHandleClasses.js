import { getDatabase, ref, push, onChildAdded } from "../common/index.js";

const database = getDatabase();
const classesRef = ref(database, "classes/");
const classDetail = [];

onChildAdded(classesRef, (snapshot) => {
  const data = snapshot.val();
  classDetail.push({ id: snapshot.key, ...data });
  showClasses();
});

const showClasses = () => {
  document.querySelector("#cards").innerHTML = "";
  classDetail.forEach((classData) => {
    let createClassCard = document.createElement("div");
    createClassCard.classList.add("card");
    createClassCard.setAttribute("id", classData.id);
    createClassCard.innerHTML = `
        <h2>Class Details</h2>
        <p><strong>Class Timings:</strong>${classData.classTimings}</p>
        <p><strong>Schedule of Classes:</strong>${classData.schedule}</p>
        <p><strong>Teacher’s Name:</strong>${classData.teacherName}</p>
        <p><strong>Section Name:</strong>${classData.sectionName}</p>
        <p><strong>Course Name:</strong>${classData.courseName}</p>
        <p><strong>Batch Number:</strong>${classData.batchNumber}</p>
    `;
    document.querySelector("#cards").appendChild(createClassCard);
  });
};

const addingClasses = async () => {
  const classInfo = {
    classTimings: document.getElementById("classTimings").value,
    schedule: document.getElementById("schedule").value,
    teacherName: document.getElementById("teacherName").value,
    sectionName: document.getElementById("sectionName").value,
    courseName: document.getElementById("courseName").value,
    batchNumber: document.getElementById("batchNumber").value,
  };
  try {
    await push(classesRef, classInfo);
  } catch (error) {
    console.log("Rejected with an Error", error);
  }
};

function submitForm() {
  addingClasses();
  closeDialog();
}

let submit_btn = document.getElementById("addClassBtn");
submit_btn.addEventListener("click", submitForm);

// NAVIGATE ADMIN TO STUDENTS SCREEN
const navigateToStudentDetailScreen = async (e) => {
  e.preventDefault();
  const classId = e.target.id;
  const newPath = "../../pages/classDetail.html?id=" + classId;
  window.location = newPath;
  console.log("navigateToStudentDetailScreen function executed");
};

document.querySelector("#cards").addEventListener("click", (event) => {
  navigateToStudentDetailScreen(event);
});

// export { classDetail };
