import { useAuthState } from "react-firebase-hooks/auth";
import {
  loginWithGithub,
  loginWithGoogle,
  getAuth,
  logout,
} from "../../client/firebaseHelpers";

export function Header() {
  const [user, loading] = useAuthState(getAuth());
  // console.log('user:', user);

  return (
    <header>
      <h1>JuiceSauce</h1>
      {!loading && user ? (
        <>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <div>
          <button onClick={() => loginWithGithub()}>Login with Github</button>
          <button onClick={() => loginWithGoogle()}>Login with Google</button>
        </div>
      )}
    </header>
  );
}
