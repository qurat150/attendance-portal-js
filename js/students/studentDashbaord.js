import {
  getDatabase,
  ref,
  onChildAdded,
  getAuth,
  signOut,
  onValue,
  get,
  update,
  push,
  set,
  query,
  orderByChild,
  equalTo,
  logout,
} from "../common/index.js";

const auth = getAuth();
const database = getDatabase();
let classDetail = [];
let studentDetail = [];
let requestDetail = [];

const classesRef = ref(database, "classes/");
const studentsRef = ref(database, "students/");
const adminRequestsRef = ref(database, "adminRequests/");

await onChildAdded(studentsRef, (snapshot) => {
  const data = snapshot.val();
  studentDetail.push({ id: snapshot.key, ...data });
  //   console.log(studentDetail);
});

await onChildAdded(adminRequestsRef, async (snapshot) => {
  const data = snapshot.val();
  requestDetail.push({ id: snapshot.key, ...data });
  console.log(requestDetail);
  //   showRequests();
});

await onChildAdded(classesRef, (snapshot) => {
  const classData = snapshot.val();
  const classId = snapshot.key;

  const studentClasses = studentDetail.filter((student) => {
    return (
      student.email === auth.currentUser.email && student.classId == classId
    );
  });

  const isRequestOnPending = (classId, studentId) => {
    const founded = requestDetail.find((request) => {
      return (
        request.studentId === studentId &&
        request.classId === classId &&
        request.isPending
      );
    });
    return founded !== undefined;
  };

  studentDetail = studentClasses;
  const studentId = studentClasses[0]?.studentId;

  if (studentClasses.length) {
    classDetail.push({
      id: classId,
      ...classData,
      studentId,
      isPending: isRequestOnPending(classId, studentId),
    });
  }
  showClasses();
});

const showClasses = () => {
  document.querySelector("#cards").innerHTML = "";
  classDetail.forEach((classData) => {
    // console.log(classData);
    let createClassCard = document.createElement("div");
    createClassCard.classList.add("card");
    createClassCard.setAttribute("id", classData.id);
    createClassCard.setAttribute("studentId", classData.studentId);
    createClassCard.innerHTML = `
          <h2>${classData.courseName}</h2>
          <p><strong>Class Timings:</strong>${classData.classTimings}</p>
          <p><strong>Schedule of Classes:</strong>${classData.schedule}</p>
          <p><strong>Teacher’s Name:</strong>${classData.teacherName}</p>
          <p><strong>Section Name:</strong>${classData.sectionName}</p>
          <p><strong>Batch Number:</strong>${classData.batchNumber}</p>
          <button type="button" class="presentBtn" style="margin-bottom: 5px">${
            classData.isPending ? "Pending" : "Present"
          }</button>
          <button type="button" id="openButton">Request for Leave</button>
      `;
    createClassCard.style.cursor = "default";
    document.querySelector("#cards").appendChild(createClassCard);
    document.querySelector(
      ".navbar-left"
    ).innerHTML = `<h2>${auth.currentUser.email}'s Dashboard</h2>`;

    const requestForAdmin = async () => {
      let requestSentCheck =
        createClassCard.querySelector(".presentBtn").innerHTML;

      if (requestSentCheck === "Present") {
        createClassCard.querySelector(".presentBtn").innerHTML = "Request sent";
        createClassCard.querySelector(".presentBtn").disabled = true;

        const classId = createClassCard.getAttribute("id");
        const studentId = createClassCard.getAttribute("studentId");
        const existingRequestRef = ref(database, "adminRequests");
        const existingRequestQuery = query(
          existingRequestRef,
          orderByChild("studentId"),
          equalTo(studentId)
        );

        const existingRequestSnapshot = await get(existingRequestQuery);
        console.log(existingRequestSnapshot.val());

        const isEmpty = (obj) => {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              return false;
            }
          }
          return true;
        };

        if (isEmpty(existingRequestSnapshot.val())) {
          // agr same id se already request na ho database mein tw yeh kam hojaye
          const newRequestRef = push(adminRequestsRef);
          const request = {
            studentId: studentId,
            classId: classId,
            type: "present",
            timestamp: Date.now(),
            isPending: true,
          };

          set(newRequestRef, request);

          const studentRequestRef = ref(
            database,
            `adminRequests/${newRequestRef.key}`
          );
          await onValue(studentRequestRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            if (data.isPending && data.classId === classId) {
              createClassCard.querySelector(".presentBtn").innerHTML =
                "Pending";
            }
          });
        }
      }
    };

    createClassCard
      .querySelector(".presentBtn")
      .addEventListener("click", requestForAdmin);
  });
};

let logout_btn = document.getElementById("logout-btn");
if (logout_btn) {
  logout_btn.addEventListener("click", () => logout(auth));
}
