// import { useState, useEffect } from "react";
// import { auth, googleProvider } from "../config/firebase";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// export const Auth = ({ setUser }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showForm, setShowForm] = useState("home"); // "home", "signup", or "login"

//     // Monitor authentication state changes
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser); // Pass user to parent component
//         });

//         // Cleanup subscription
//         return () => unsubscribe();
//     }, [setUser]);

//     const signUp = async () => {
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//             alert("Account created successfully! Please log in.");
//             setShowForm("login"); // Redirect to login after signing up
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const login = async () => {
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const signInWithGoogle = async () => {
//         try {
//             await signInWithPopup(auth, googleProvider);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const logout = async () => {
//         try {
//             await signOut(auth);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div>
//             {auth.currentUser ? (
//                 <div>
//                     <p>Welcome, {auth.currentUser.email}</p>
//                     <button onClick={logout}>Log Out</button>
//                 </div>
//             ) : (
//                 <div>
//                     {showForm === "home" && (
//                         <>
//                             <button onClick={() => setShowForm("signup")}>Sign Up</button>
//                             <button onClick={() => setShowForm("login")}>Login</button>
//                         </>
//                     )}

//                     {showForm === "signup" && (
//                         <div>
//                             <h2>Sign Up</h2>
//                             <input
//                                 placeholder="Email"
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                             <input
//                                 placeholder="Password"
//                                 type="password"
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <button onClick={signUp}>Create Account</button>
//                             <button onClick={() => setShowForm("home")}>Back</button>
//                         </div>
//                     )}

//                     {showForm === "login" && (
//                         <div>
//                             <h2>Login</h2>
//                             <input
//                                 placeholder="Email"
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                             <input
//                                 placeholder="Password"
//                                 type="password"
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <button onClick={login}>Log In</button>
//                             <button onClick={signInWithGoogle}>
//                                 Sign In With Google
//                             </button>
//                             <button onClick={() => setShowForm("home")}>Back</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

export const Auth = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForm, setShowForm] = useState("home"); // "home", "signup", or "login"

    // Monitor authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Pass user to parent component
        });

        return () => unsubscribe();
    }, [setUser]);

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully! Please log in.");
            setShowForm("login");
        } catch (err) {
            console.error(err);
        }
    };

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {auth.currentUser ? (
                <div>
                    <p>Welcome, {auth.currentUser.email}</p>
                    <button onClick={logout}>Log Out</button>
                </div>
            ) : (
                <div>
                    {showForm === "home" && (
                        <>
                            <button onClick={() => setShowForm("signup")}>Sign Up</button>
                            <button onClick={() => setShowForm("login")}>Login</button>
                        </>
                    )}

                    {showForm === "signup" && (
                        <div>
                            <h2>Sign Up</h2>
                            <input
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={signUp}>Create Account</button>
                            <button onClick={() => setShowForm("home")}>Back</button>
                        </div>
                    )}

                    {showForm === "login" && (
                        <div>
                            <h2>Login</h2>
                            <input
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={login}>Log In</button>
                            <button onClick={() => setShowForm("home")}>Back</button>
                        </div>
                    )}

                    {/* Sign in with Google (accessible in both Sign Up and Login) */}
                    <div>
                        <p>Or</p>
                        <button onClick={signInWithGoogle}>Sign In With Google</button>
                    </div>
                </div>
            )}
        </div>
    );
};
