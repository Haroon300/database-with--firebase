import logo from './logo.svg';
import './App.css';
import { useState,useEffect } from 'react';
import moment from 'moment';
import { initializeApp } from "firebase/app";
import { getFirestore, query } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";





// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAOvNXMvY14Jiv1hYPReWA9ck_cVggjBKI",
  authDomain: "login-5e94f.firebaseapp.com",
  projectId: "login-5e94f",
  storageBucket: "login-5e94f.appspot.com",
  messagingSenderId: "626087529353",
  appId: "1:626087529353:web:6a6457c69c9b9149f76f58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);





function App() {
  const[posts, setPosts] = useState([]);
  const[postText, setPostText] = useState("");
  const[isLoading, setIsLoading] = useState(false);


  useEffect(()=>{
    const getData = async()=>{
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
      
      

      setPosts((prev)=>{
        let newArray = [...prev, doc.data()];
        return newArray
      });

    });
    } 
    // getData();

    const getRealTimeData = async()=>{

      const q = query(collection(db,"posts"));
      const unsubcribe = onSnapshot(q, (querySnapshot) => {
        const posts =[];
        querySnapshot.forEach((doc)=>{
          posts.push(doc.data());
        });
        console.log("posts:",posts);
        setPosts(posts);
      });
    }
    getRealTimeData();
  },[])

  const savePost = async (e)=>{
    e.preventDefault();

    console.log("postText: ",postText);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        text: postText,
        createOn: new Date().getTime(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }

  return (
    <div className='flex'>
      <div className='flex col'>
        <div className='flex col header'>
          <h1 className='h1'>World News</h1>
          <div>
            <form onSubmit={savePost}>
              <textarea 
              type="text" 
              placeholder='Make a post' 
              
              onChange={(e)=>{
                setPostText(e.target.value)
              }}
              className='marg'
              />
              
              <button type='submit' className='marg'>Post</button>
            </form>
          </div>
        </div>

        <div className='flex width'>

          <div className='over flex col'>
            {
              (isLoading)?<h1 className='heading'>Loading...</h1>:""
            }
            {
            posts.map((eachPost , i) => (
            <div key={i} className='background-col marg'>
              <h2>{eachPost?.text}</h2>
              <span>
                {
                  moment(eachPost?.datePublished)
                  .format('Do MMMM, hh:mm a')
                }
              </span>
             
            </div>
            ))
            }
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default App;
