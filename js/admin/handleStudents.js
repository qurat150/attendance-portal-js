import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  get,
  orderByChild,
  equalTo,
  query,
  update,
  getAuth,
  remove,
  createStudentCard,
  logout,
  findArrayByKey,
} from "../common/index.js";

const auth = getAuth();
const database = getDatabase();

const classId = new URLSearchParams(window.location.search).get("id");
const classesRef = ref(database, "classes/");
const studentsRef = ref(database, "students/");
const usersRef = ref(database, "users/");
const adminRequestsRef = ref(database, "adminRequests/");

let classDetail = [];
let studentDetail = [];
let requestDetail = [];
let showStudentsInClass = [];

onChildAdded(classesRef, (snapshot) => {
  const data = snapshot.val();
  classDetail.push({ id: snapshot.key, ...data });
});

const showRequestCard = () => {
  window.location.href = "../../pages/admin/handleRequests.html";
};

document
  .querySelector("#approve-requests")
  .addEventListener("click", showRequestCard);

await onChildAdded(studentsRef, async (snapshot) => {
  const data = snapshot.val();
  studentDetail.push({ id: snapshot.key, ...data });
  const filteredStudents = studentDetail.filter((studentData) => {
    return studentData.classId === classId;
  });
  // console.log(filteredStudents);
  showStudentsInClass = filteredStudents;
  showStudents();
});

await onChildAdded(adminRequestsRef, (snapshot) => {
  const data = snapshot.val();
  requestDetail.push({ id: snapshot.key, ...data });
  console.log(requestDetail);
  showStudents();
});

function filterArrayByProperty(array, property, value) {
  return array.filter((item) => item[property] === value);
}
const showStudents = async () => {
  document.querySelector("#studentCards").innerHTML = "";

  showStudentsInClass.forEach(async (studentData) => {
    const studentCardDiv = await createStudentCard(studentData, classDetail);
    const selectedClass = studentCardDiv.querySelector(
      "#selectedClassToTransferStudent"
    );

    selectedClass.addEventListener("change", () => {
      const selectedValue = selectedClass.value;
      console.log(selectedValue);

      let getSelectedClassObj = classDetail.find((classData) => {
        return classData.courseName === selectedValue;
      });

      const dataRef = ref(database, `students/${studentCardDiv.id}`);
      const updateData = {
        classId: getSelectedClassObj.id,
        courseName: selectedValue,
      };
      update(dataRef, updateData);
      location.reload();
    });

    const removeStudent = async () => {
      let studentId = studentCardDiv.getAttribute("id");
      try {
        await remove(ref(database, `students/${studentId}`));
        location.reload();
      } catch (error) {
        console.log(error);
      }
    };

    document.querySelector("#studentCards").appendChild(studentCardDiv);
    const removeButton = studentCardDiv.querySelector("#studentRemoveBtn");
    removeButton.addEventListener("click", () => removeStudent());
  });
};

const addingStudent = async () => {
  let getClassName = document.getElementById("courseName").value;
  const classId = findArrayByKey(classDetail, "courseName", getClassName);

  let studentInfo = {
    // classId: classId.id,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    rollNumber: document.getElementById("rollNumber").value,
    courseName: document.getElementById("courseName").value,
    picture: "url",
    isPresent: false,
    isPending: null,
  };

  const checkStudentExistanceByEmail = async (email) => {
    const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(emailQuery);

    try {
      if (!snapshot.exists())
        return alert("The user of provided email does not exists!");

      const courseAvailibliity = filterArrayByProperty(
        classDetail,
        "courseName",
        studentInfo.courseName
      );
      if (courseAvailibliity.length) {
        studentInfo.classId = classId;
      } else return alert("The course is not availabe");

      const courseNameExistanceInCurrentLocation = filterArrayByProperty(
        showStudentsInClass,
        "courseName",
        studentInfo.courseName
      );
      console.log(courseNameExistanceInCurrentLocation);

      push(studentsRef, studentInfo);
      if (!courseNameExistanceInCurrentLocation.length)
        alert(
          `Student added but you have to switch ${studentInfo.courseName}'s class to see the student!`
        );
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };
  checkStudentExistanceByEmail(studentInfo.email);
};

let logout_btn = document.getElementById("logout-btn");
if (logout_btn) {
  logout_btn.addEventListener("click", () => logout(auth));
}

function submitForm() {
  addingStudent();
  closeDialog();
}

document.getElementById("addStudentBtn").addEventListener("click", submitForm);
