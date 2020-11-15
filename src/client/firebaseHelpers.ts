import "firebase/analytics";
import "firebase/auth";
import firebase from "firebase/app";
import firebaseConfig from "../config/firebaseConfig.json";
import {neo4jVerifyUser} from "./neo4jHelpers"

let _app: firebase.app.App | null = null;

interface IUserObject {
  userId: string | undefined | null,
  email: string | undefined | null,
  avatar?: string | undefined | null,
  name?: string | undefined | null
}

export function getApp() {
  if (_app) return _app;
  if (firebase.apps.length > 0) {
    return (_app = firebase.app());
  } else {
    _app = firebase.initializeApp(firebaseConfig);
    // firebase.analytics?.(); // TODO
    return _app;
  }
}

export function getAuth() {
  return getApp().auth();
}

// export async function loginAnonymously(): Promise<firebase.auth.UserCredential | null> {
//   try {
//     const user = await firebase.auth().signInAnonymously();
//     // console.log(user);
//     return user;
//   } catch (error) {
//     console.error("login failed", error);
//     return null;
//   }
// }



export async function loginWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  try {
    const user = await firebase.auth().signInWithPopup(provider);
    
    const userObject:IUserObject = {
      userId: user.user?.uid,
      email: user.user?.email,
      avatar: user.user?.photoURL,
      name: user.user?.displayName,
    }

    neo4jVerifyUser(userObject);
  } catch (error) {
    console.error("login failed", error);
  }
}

export async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const user = await firebase.auth().signInWithPopup(provider);
    const userObject: IUserObject = {
      userId: user.user?.uid,
      email: user.user?.email,
      avatar: user.user?.photoURL,
      name: user.user?.displayName,
    };

    neo4jVerifyUser(userObject);
  } catch (error) {
    console.error("login failed", error);
  }
}

export async function signInWithEmailandPassword(email:string, password:string) {

  const user = firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log('error: ', errorCode, errorMessage)
    });
  
    return user;

}


export async function createNewUserWithEmailandPassword(
  email: string,
  password: string,
  name: string,
  // avatar?: string,
) {
  const user = firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log("user creation:", user);

      const userObject: IUserObject = {
        userId: user.user?.uid,
        email: user.user?.email,
        // avatar: avatar,
        name: name,
      };

      console.log('userObject', userObject)

      neo4jVerifyUser(userObject);
      
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

  return user;
}



export async function linkWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  try {
    const user = await firebase.auth().currentUser?.linkWithPopup(provider);

    console.log(user);
  } catch (error) {
    console.error("login failed", error);
  }
}

// @ts-ignore
globalThis._app = firebase;
export async function logout() {
  try {
    const user = await firebase.auth().signOut();
    console.log(user);
  } catch (error) {
    console.error("login failed", error);
  }
}
