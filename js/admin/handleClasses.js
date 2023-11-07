import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  getAuth,
  createClassCard,
} from "../common/index.js";

const auth = getAuth();
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

  classDetail.forEach(async (classData) => {
    let classCardDiv = await createClassCard(classData);
    // console.log(classCardDiv);

    classCardDiv.addEventListener("click", (event) => {
      navigateToStudentDetailScreen(event, classData.id);
    });
    document.querySelector("#cards").appendChild(classCardDiv);

    document.querySelector(
      ".navbar-left"
    ).innerHTML = `<h2>${auth.currentUser.email}'s Dashboard</h2>`;
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
    window.location.reload();
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
const navigateToStudentDetailScreen = async (e, id) => {
  e.preventDefault();
  const newPath = "../../pages/admin/handleStudents.html?id=" + id;
  window.location = newPath;
};
