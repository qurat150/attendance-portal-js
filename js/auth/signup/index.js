import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  getDatabase,
  set,
  ref,
} from "../../common/index.js";

const auth = getAuth();
const database = getDatabase();

const signup = () => {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((resolve) => {
      console.log("successfully Signup", resolve);
      let userId = auth.currentUser.uid;
      let usersReference = ref(database, "users/" + userId);
      let usersObj = {
        username: username,
        email: email,
        password: password,
        isAdmin: false,
      };
      set(usersReference, usersObj)
        .then((res) => {
          console.log("user added in database", res);
        })
        .catch((reject) => {
          console.log("Rejected with an Error!", reject);
        });
    })
    .catch((reject) => {
      console.log("Rejected with an Error!", reject);
    });
};
let signup_btn = document.getElementById("signup-btn");
if (signup_btn) {
  signup_btn.addEventListener("click", signup);
}

function logout() {
  signOut(auth).then(() => {
    console.log("signedOut", auth);
    window.location = "../../../pages/signup.html";
  });
}

let logout_btn = document.getElementById("logout-btn");
if (logout_btn) {
  logout_btn.addEventListener("click", logout);
}

// signOut(auth);
