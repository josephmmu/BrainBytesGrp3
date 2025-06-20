// components/LoginModal.js
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


//import styles from '../styles/LoginModal.module.css'; // New import

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  if (!isOpen) return null;

  // In LoginModal.js
  const handleLogin = async () => {
    // try {
    //   const res = await axios.post('http://localhost:3000/api/login', { email, password });
    //   localStorage.setItem('token', res.data.token);
    //   localStorage.setItem('email', email);
    //   onClose();
    //    console.log('Logging in with:', email, password)
    // } catch (error) {
    //   if (error.response && error.response.status == 401) {
    //     alert('No account was found with those credentials. Please register first.');
    //   } else {
    //     alert('Login failed!, Please try again later.');
    //   }
    //   console.error(error);
    // }
    await login(email, password);  // this updates context
      onClose();
    
  };

  // Register
  const handleRegister = async () => {
    try {
      const reg = await axios.post('http://localhost:3000/api/register', { email, password });
      const loginAfterRegister = await axios.post('http://localhost:3000/api/login', { email, password });
      localStorage.setItem('token', loginAfterRegister.data.token);
      onClose();
    } catch (error) {
      alert('Registration Failed');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>

          <button 
            onClick={handleRegister}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}