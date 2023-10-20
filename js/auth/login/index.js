import { getAuth, signInWithEmailAndPassword } from "../../common/index.js";

const auth = getAuth();

const login = () => {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((resolve) => {
      console.log("successfully Login", resolve);
    })
    .catch((err) => {
      console.log("Rejected with an Error", err);
    });
};

let login_btn = document.getElementById("login-btn");
login_btn.addEventListener("click", login);
