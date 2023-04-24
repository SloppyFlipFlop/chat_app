import "./styles/global.scss";

// Import the functions you need from the SDKs you need
import { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6ZMxXcT8iMU2PJtnv-5D17itNC2TlRiQ",
  authDomain: "chat-app-83bb2.firebaseapp.com",
  projectId: "chat-app-83bb2",
  storageBucket: "chat-app-83bb2.appspot.com",
  messagingSenderId: "1036399980649",
  appId: "1:1036399980649:web:67c75b5b2e5a0c784672f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, "messages");

function App() {
  const [messages, setMessages] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState([]);
  const inputRef = useRef(null);
  const auth = getAuth(app);

  useEffect(() => {
    if (auth.currentUser != null) {
      onValue(messagesRef, (snapshot) => {
        setMessages(snapshot.val());
      });
    }
  }, [isSignedIn]);

  const signInWithGoogle = () => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
          // The signed-in user info.
          const user = result.user;
          setUserData(user);
          setIsSignedIn(true);
          return;
        })
        .catch((error) => {
          alert(error.message);
          return;
        });
    });
  };

  const handleClick = () => {
    let messageValue = inputRef.current.value;
    // Send the message to firebase
    let newMessages = [...messages];
    newMessages.push({
      name: auth.currentUser.displayName,
      message: messageValue,
    });
    console.log(userData);
    set(messagesRef, newMessages).then(() => {
      inputRef.current.value = "";
    });
  };

  return (
    <div>
      <center>
        <h1>Chat app</h1>
      </center>
      {isSignedIn && (
        <div className="messages">
          <ul>
            {messages.map((message) => {
              if (auth.currentUser != null) {
                if (message.name === auth.currentUser.displayName) {
                  return (
                    <div className="message bluebubble">
                      <div className="name">{message.name}</div>
                      <div className="bubble">{message.message}</div>
                    </div>
                  );
                } else {
                  return (
                    <div className="message">
                      <div className="name">{message.name}</div>
                      <div className="bubble">{message.message}</div>
                    </div>
                  );
                }
              }
            })}
          </ul>
          <center>
            <div className="sendbox">
              <input type="text" ref={inputRef} placeholder="Message"></input>
              <button onClick={handleClick}>Send!</button>
            </div>
          </center>
        </div>
      )}
      {!isSignedIn && (
        <center>
          <button class={"signin"} onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </center>
      )}
    </div>
  );
}

export default App;
