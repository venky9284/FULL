import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.message); });
            }
            return res.json();
        })
        .then(() => {
            navigate('/');
        })
        .catch(err => {
            setMessage(err.message);
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-blue-500">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
                {message && <div className="bg-red-100 text-red-700 p-2 rounded">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 p-3 border rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-3 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-3 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-4 p-3 border rounded"
                        required
                    />
                    <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                        Create Account
                    </button>
                </form>
                <div className="mt-4 text-center">
                    Already have an account? <Link className="text-blue-600" to="/">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
