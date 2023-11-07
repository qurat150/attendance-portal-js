import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  push,
  get,
  onValue,
  onChildAdded,
  query,
  update,
  remove,
  equalTo,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

export {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getDatabase,
  ref,
  set,
  get,
  remove,
  onValue,
  onChildAdded,
  push,
  query,
  equalTo,
  update,
  orderByChild,
};

export const createStudentCard = async (data, classDetail) => {
  // console.log(data);
  let createCardDiv = document.createElement("div");
  createCardDiv.classList.add("card");
  createCardDiv.setAttribute("id", data.id);
  createCardDiv.setAttribute("classid", data.classId);
  createCardDiv.innerHTML = `
        <h2>Student Details</h2>
        <p><strong>Student's Name:</strong>${data.name}</p>
        <p><strong>Roll Number:</strong>${data.rollNumber}</p>
        <p><strong>Picture:</strong>${data.picture}</p>
        <p><strong>Course Name:</strong>${data.courseName}</p>
        <select id="selectedClassToTransferStudent" style="margin-bottom: 5px">
        <option>Transfer: </option>
          ${classDetail.map((classData) => {
            return `<option value="${classData.courseName}">${classData.courseName}</option>`;
          })}
        </select>
        <button id="studentRemoveBtn" type="button">
          Remove from Class
        </button>
    `;
  return createCardDiv;
};

export const createClassCard = async (data) => {
  let createClassCard = document.createElement("div");
  createClassCard.classList.add("card");
  // createClassCard.setAttribute("id", classData.id);
  createClassCard.innerHTML = `
      <h2>Class Details</h2>
      <p><strong>Class Timings:</strong>${data.classTimings}</p>
      <p><strong>Schedule of Classes:</strong>${data.schedule}</p>
      <p><strong>Teacher’s Name:</strong>${data.teacherName}</p>
      <p><strong>Section Name:</strong>${data.sectionName}</p>
      <p><strong>Course Name:</strong>${data.courseName}</p>
      <p><strong>Batch Number:</strong>${data.batchNumber}</p>
  `;

  return createClassCard;
};

export const logout = async (auth) => {
  signOut(auth).then(() => {
    console.log("signedOut", auth);
    window.location = "../../../pages/auth/login.html";
  });
};

export const findArrayByKey = (array, key, value) => {
  return array.find((item) => item[key] === value);
};
