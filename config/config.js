import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfsl9oqT5IdHK8G_TzCC_3O7BBqNNdVv4",
  authDomain: "attendance-portal-dcc13.firebaseapp.com",
  projectId: "attendance-portal-dcc13",
  storageBucket: "attendance-portal-dcc13.appspot.com",
  messagingSenderId: "936207257811",
  appId: "1:936207257811:web:e635fd5adb508c1691c426",
  measurementId: "G-CTZ7VD8N80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
