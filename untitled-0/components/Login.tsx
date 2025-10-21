import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
	c0,0,0,0,0,0l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const Login: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginView && !name)) {
      setError('Bitte fülle alle Felder aus.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
        if (isLoginView) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
        }
    } catch (err: any) {
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                setError('Ungültige E-Mail oder falsches Passwort.');
                break;
            case 'auth/email-already-in-use':
                setError('Diese E-Mail-Adresse wird bereits verwendet.');
                break;
            case 'auth/weak-password':
                setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
                break;
            default:
                setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (err) {
        setError('Anmeldung mit Google fehlgeschlagen.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <header className="mb-8">
            <h1 className="text-4xl font-bold text-indigo-700">IN MY MIND</h1>
            <p className="text-slate-500 mt-2">Gedanken Chaos kontrollieren</p>
        </header>
        <main className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">{isLoginView ? 'Willkommen zurück!' : 'Konto erstellen'}</h2>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                {!isLoginView && (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dein Name"
                        className="w-full p-3 mb-4 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                        aria-label="Dein Name"
                        required
                    />
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Deine E-Mail"
                    className="w-full p-3 mb-4 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    aria-label="Deine E-Mail"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Passwort"
                    className="w-full p-3 mb-4 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    aria-label="Passwort"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold"
                >
                    {isLoading ? '...' : (isLoginView ? 'Anmelden' : 'Registrieren')}
                </button>
            </form>

            <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm text-indigo-600 hover:underline mt-4">
              {isLoginView ? 'Noch kein Konto? Registrieren' : 'Bereits ein Konto? Anmelden'}
            </button>
            
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-sm">Oder</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center p-3 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold text-slate-700 disabled:opacity-50"
            >
                <GoogleIcon />
                Anmelden über Google
            </button>
        </main>
        <footer className="mt-8 text-xs text-slate-400">
            <p>Diese App bietet keine medizinische Beratung. Bei Krisen bitte professionelle Hilfe suchen.</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;