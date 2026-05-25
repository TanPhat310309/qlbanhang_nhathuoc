import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LogIn.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();
    if (!trimmedUser || !trimmedPass) {
      setError('Vui lòng nhập đủ tên đăng nhập và mật khẩu');
      return;
    }
    if (trimmedPass !== confirm.trim()) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const res = await fetch(`/account.json?t=${Date.now()}`);
      let accounts = await res.json();
      if (accounts.find(a => a.user === trimmedUser)) {
        setError('Tên đăng nhập đã tồn tại!');
        return;
      }
      const newUser = {
        id: accounts.length + 1,
        user: trimmedUser,
        pass: trimmedPass,
        role: 'customer',
        name: trimmedUser,
      };
      accounts.push(newUser);
      await fetch('/api/save/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accounts),
      });

      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      setError('Lỗi kết nối server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Đăng ký tài khoản</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Xác nhận mật khẩu"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button">
            ĐĂNG KÝ
          </button>
        </form>
        <div className="login-footer login-footer--spaced">
          <span>Đã có tài khoản?</span>
          <Link to="/login" className="signup-link">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
