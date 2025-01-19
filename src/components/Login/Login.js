import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('CLICK SUR LOGIN');

        try {
            const response = await fetch('https://localhost:7141/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();
            console.log('Réponse du serveur:', data);

            if (response.ok) {
                localStorage.setItem('token', data.Token);
                localStorage.setItem('userId', data.Id);
                localStorage.setItem('role', data.Role);

                if (data.Role === 'admin') {
                    navigate('/admin');
                } else if (data.Role === 'receptionist') {
                    navigate('/receptionist');
                } else if (data.Role === 'personnel de menage') {
                    navigate('/housekeeping');
                }
            } else {
                setError(data.message || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Connexion
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* ... reste du formulaire ... */}
                </form>
            </div>
        </div>
    );
}

export default Login; 