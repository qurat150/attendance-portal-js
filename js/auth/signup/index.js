import {
  getAuth,
  createUserWithEmailAndPassword,
  getDatabase,
  set,
  ref,
} from "../../common/index.js";

const auth = getAuth();
const database = getDatabase();

const signup = async () => {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (resolve) => {
      console.log("successfully Signup", resolve);
      let userId = auth.currentUser.uid;
      let usersReference = ref(database, "users/" + userId);
      let usersObj = {
        username: username,
        email: email,
        password: password,
        isAdmin: false,
      };
      await set(usersReference, usersObj)
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
