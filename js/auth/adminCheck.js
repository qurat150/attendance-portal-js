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
    admin: ["/pages/admin/handleClasses.html", "/pages/admin/handleStudents.html"],
    user: ["/pages/students/dashboard.html"], // temp for now
  };

  const currentRolePaths = rolePaths[role] || [];
  const isActive = currentRolePaths.includes(window.location.pathname);

  return { isActive, entry: currentRolePaths[0] };
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user loggedIn");
    const userRef = ref(database, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data.isAdmin) {
        const { isActive, entry } = isRolePathHaveAccess("admin");
        if (!isActive) window.location = entry;
      }
      if (!data.isAdmin) {
        const { isActive, entry } = isRolePathHaveAccess("user");
        setTimeout(() => {
          if (!isActive) window.location = entry;
        }, 2000);
      }
    });
  } else {
    console.log("nahi hai user");
  }
});
