import React, { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({ name: '', rollNo: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) return <h2>Thank you for registering!</h2>;

  return (
    <div className="container">
      <img src="/logo.png" alt="Society Logo" className="logo" />
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
        <input type="text" name="rollNo" placeholder="Roll No." required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;
