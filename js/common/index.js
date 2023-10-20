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
  onValue,
  onChildAdded,
  push,
  query,
  equalTo,
  update,
  orderByChild,
};
