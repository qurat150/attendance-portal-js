import {
  getAuth,
  onAuthStateChanged,
  getDatabase,
  ref,
  onValue,
} from "../common/index.js";

const auth = getAuth();
const database = getDatabase();

const isRolePathHaveAccess = (role) => {
  const rolePaths = {
    admin: ["/pages/adminDashboard.html", "/pages/classDetail.html"],
    user: ["/pages/user.html"], // temp for now
  };

  const currentRolePaths = rolePaths[role] || [];
  const isActive = currentRolePaths.includes(window.location.pathname);

  return { isActive, entry: currentRolePaths[0] };
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(database, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data.isAdmin) {
        const { isActive, entry } = isRolePathHaveAccess("admin");
        if (!isActive) window.location = entry;
      } else {
        // window.location = "../../../pages/login.html";
        let pathName = "/pages/studentsDetail.html";
        if (window.location.pathname !== pathName)
          window.location = "../../../pages/studentsDetail.html";
      }
    });
  } else {
    console.log("nahi hai user");
  }
});
