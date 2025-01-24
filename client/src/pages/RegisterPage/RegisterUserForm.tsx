import React, { useState } from 'react';
import { useRegisterUser } from '../../context/RegisterUserContext';

const RegisterUserForm: React.FC = () => {
  const { registerUser, loading, error } = useRegisterUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'user'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }
    registerUser(formData);
    setFormData({name: '', email: '', password: '', user_type: 'user'});
  };

  return (
    <section className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-semibold text-center">Register as a User</h1>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg mt-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg mt-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg mt-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an user account? <a href="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterUserForm;
