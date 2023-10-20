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
  onValue,
} from "../common/index.js";

const database = getDatabase();
const classId = new URLSearchParams(window.location.search).get("id");
const classesRef = ref(database, "classes/");
const studentsRef = ref(database, "students/");
const usersRef = ref(database, "users/");

const classDetail = [];
const studentDetail = [];
let showStudentsInClass = [];

onChildAdded(classesRef, (snapshot) => {
  const data = snapshot.val();
  classDetail.push({ id: snapshot.key, ...data });
});

onChildAdded(studentsRef, (snapshot) => {
  const data = snapshot.val();
  studentDetail.push({ id: snapshot.key, ...data });
  const filteredStudents = studentDetail.filter((studentData) => {
    return studentData.classId === classId;
  });
  showStudentsInClass = filteredStudents;
  showStudents();
});

function filterArrayByProperty(array, property, value) {
  return array.filter((item) => item[property] === value);
}

const showStudents = () => {
  document.querySelector("#studentCards").innerHTML = "";

  showStudentsInClass.forEach((studentData) => {
    let createStudentCard = document.createElement("div");
    createStudentCard.classList.add("card");
    createStudentCard.setAttribute("id", studentData.id);
    createStudentCard.setAttribute("classid", studentData.classId);
    createStudentCard.innerHTML = `
          <h2>Student Details</h2>
          <p><strong>Class Timings:</strong>${studentData.name}</p>
          <p><strong>Teacher’s Name:</strong>${studentData.rollNumber}</p>
          <p><strong>Section Name:</strong>${studentData.picture}</p>
          <p><strong>Course Name:</strong>${studentData.courseName}</p>
          <strong style="margin-bottom: 7px;">Transfer: </strong>
          <select id="selectClassToTransferStudent">
            ${classDetail.map((classData) => {
              return `<option value="${classData.courseName}">${classData.courseName}</option>`;
            })}
          </select>
      `;

    let selectedClass = createStudentCard.querySelector(
      "#selectClassToTransferStudent"
    );
    selectedClass.addEventListener("change", () => {
      let selectedValue = selectedClass.value;
      const result = filterArrayByProperty(
        classDetail,
        "courseName",
        selectedValue
      );

      const dataRef = ref(database, `students/${createStudentCard.id}`);
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
      });

      const updateData = {
        classId: result[0].id,
        courseName: selectedValue,
      };
      update(dataRef, updateData);
    });
    document.querySelector("#studentCards").appendChild(createStudentCard);
  });
};

const addingStudent = async () => {
  let studentInfo = {
    classId: classId,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    rollNumber: document.getElementById("rollNumber").value,
    picture: "url",
    courseName: document.getElementById("courseName").value,
  };

  const checkUserByEmail = async (email) => {
    const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(emailQuery);

    try {
      if (snapshot.exists()) {
        console.log("User exists:", snapshot.val());
        const filteredCourse = filterArrayByProperty(
          classDetail,
          "courseName",
          studentInfo.courseName
        );
        if (filteredCourse.length === 0) alert("The course is not availabe");
        else {
          const studentsSnapshot = await get(studentsRef);
          if (studentsSnapshot.exists()) {
            const checkingCourseNameExistance = filterArrayByProperty(
              studentDetail,
              "courseName",
              studentInfo.courseName
            );
            console.log(checkingCourseNameExistance);
            push(studentsRef, studentInfo);

            if (checkingCourseNameExistance.length) {
              alert(
                `Student added but you have to switch ${studentInfo.courseName}'s class to see the studnet!`
              );
            }
          } else alert("The course is not exist");
        }
      } else {
        alert("The user of provided email does not exists!");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };
  checkUserByEmail(studentInfo.email);
};

function submitForm() {
  addingStudent();
  closeDialog();
}

document.getElementById("addStudentBtn").addEventListener("click", submitForm);
