import {
  getDatabase,
  onChildAdded,
  ref,
  remove,
  update,
} from "../common/index.js";

const database = getDatabase();
const adminRequestsRef = ref(database, "adminRequests/");

const requests = [];

await onChildAdded(adminRequestsRef, async (snapshot) => {
  const data = snapshot.val();
  requests.push({ id: snapshot.key, ...data });
  console.log(requests);
  showRequests();
});

if (!requests.length) {
  document.getElementById("ifNoRequest").innerHTML = "No request Pending";
}

const showRequests = () => {
  setTimeout(() => {
    const requestCardsContainer = document.querySelector("#requestCards");
    requestCardsContainer.innerHTML = "";

    requests.forEach((data) => {
      const createClassCard = document.createElement("div");
      createClassCard.classList.add("card");
      createClassCard.setAttribute("studentid", data.studentId);
      createClassCard.innerHTML = `
          <h2>Request Details</h2>
          <button type="button" class="request-approve-btn" style="margin-bottom: 5px">
            Present Approve
          </button>
        `;
      requestCardsContainer.appendChild(createClassCard);
      const approveButton = createClassCard.querySelector(
        ".request-approve-btn"
      );

      approveButton.addEventListener("click", (event) => {
        const currentStudentId = createClassCard.getAttribute("studentid");
        const studentRef = ref(database, `students/${currentStudentId}`);
        const isPendingRef = ref(database, `adminRequests/${data.id}`);

        update(studentRef, { isPresent: true });
        update(isPendingRef, { isPending: false });
        remove(ref(database, `adminRequests/${data.id}`));
        location.reload();
      });
    });
  }, 2000);
};

{
  /* <p><strong>Class Timings:</strong>${classData.classTimings}</p>
<p><strong>Schedule of Classes:</strong>${classData.schedule}</p>
<p><strong>Teacher’s Name:</strong>${classData.teacherName}</p>
<p><strong>Section Name:</strong>${classData.sectionName}</p>
<p><strong>Course Name:</strong>${classData.courseName}</p>
<p><strong>Batch Number:</strong>${classData.batchNumber}</p> */
}
