import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import axios from 'axios';
>>>>>>> f2d2b54cf9bad3606c09b00a3d7cf934428cefd9
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function readStoredUser() {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState(() => readStoredUser());
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [delPass, setDelPass] = useState('');
  const [delErr, setDelErr] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  const clearPasswordForm = () => {
    setCurPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwErr('');
    setPwMsg('');
    const c = curPass.trim();
    const n1 = newPass.trim();
    const n2 = confirmPass.trim();

    if (!c || !n1) {
      setPwErr('Nhập đủ mật khẩu hiện tại và mật khẩu mới');
      return;
    }
    if (n1 !== n2) {
      setPwErr('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    if (n1.length < 3) {
      setPwErr('Mật khẩu mới tối thiểu 3 ký tự');
      return;
    }

    try {
      const response = await fetch(`/account.json?t=${new Date().getTime()}`);
      const accounts = await response.json();
      const matchedAccount = accounts.find(acc => acc.id === user.id);
      if (!matchedAccount || matchedAccount.pass !== c) {
        setPwErr('Mật khẩu hiện tại không chính xác!');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 500));

      setPwMsg('Đã đổi mật khẩu thành công');
      clearPasswordForm();
    } catch (err) {
      setPwErr('Lỗi kết nối dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDelErr('');
    const p = delPass.trim();
    
    if (!p) {
      setDelErr('Vui lòng nhập mật khẩu để xác nhận xóa');
      return;
    }
    if (!window.confirm('Xóa vĩnh viễn tài khoản này? Thao tác không thể hoàn tác.')) {
      return;
    }

    try {
      const response = await fetch(`/account.json?t=${new Date().getTime()}`);
      const accounts = await response.json();
      
      const matchedAccount = accounts.find(acc => acc.id === user.id);
      if (!matchedAccount || matchedAccount.pass !== p) {
        setDelErr('Mật khẩu xác nhận không chính xác!');
        return;
      }

      alert('Tài khoản đã được xóa thành công!');
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new Event('userUpdated'));
      navigate('/', { replace: true });
    } catch (err) {
      setDelErr('Lỗi kết nối dữ liệu. Vui lòng thử lại sau.');
    }
  };

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1 className="profile-title">Hồ sơ tài khoản</h1>
        <dl className="profile-fields">
          <dt>Tên đăng nhập:</dt>
          <dd>{user.user || '-'}</dd>
          {user.name && (
            <>
              <dt>Tên hiển thị:</dt>
              <dd>{user.name}</dd>
            </>
          )}
          {user.role && (
            <>
              <dt>Vai trò:</dt>
              <dd>{user.role}</dd>
            </>
          )}
          {user.id != null && (
            <>
              <dt>Mã số thành viên:</dt>
              <dd>{user.id}</dd>
            </>
          )}
        </dl>

        <section className="profile-section">
          <h2 className="profile-section-title">Đổi mật khẩu</h2>
          <form className="profile-form" onSubmit={handleChangePassword}>
            <label className="profile-label">
              Mật khẩu hiện tại
              <input
                type="password"
                className="profile-input"
                value={curPass}
                onChange={(e) => setCurPass(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            <label className="profile-label">
              Mật khẩu mới
              <input
                type="password"
                className="profile-input"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <label className="profile-label">
              Xác nhận mật khẩu mới
              <input
                type="password"
                className="profile-input"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            {pwErr && <p className="profile-msg profile-msg--error">{pwErr}</p>}
            {pwMsg && <p className="profile-msg profile-msg--ok">{pwMsg}</p>}
            <button type="submit" className="profile-btn profile-btn--primary">
              Cập nhật mật khẩu
            </button>
          </form>
        </section>

        <section className="profile-section profile-section--danger">
          <h2 className="profile-section-title">Xóa tài khoản</h2>
          <p className="profile-danger-hint">
            Xóa khỏi hệ thống dữ liệu và đăng xuất ngay lập tức. Thao tác này yêu cầu nhập mật khẩu xác nhận.
          </p>
          <form className="profile-form" onSubmit={handleDeleteAccount}>
            <label className="profile-label">
              Nhập mật khẩu xác thực
              <input
                type="password"
                className="profile-input"
                value={delPass}
                onChange={(e) => setDelPass(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {delErr && <p className="profile-msg profile-msg--error">{delErr}</p>}
            <button type="submit" className="profile-btn profile-btn--danger">
              Xóa tài khoản vĩnh viễn
            </button>
          </form>
        </section>
      </div>
      <div className="profile-actions" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={handleLogout} className="btn-logout-large">
          <i className="fas fa-sign-out-alt"></i> Đăng xuất khỏi tài khoản
        </button>
      </div>
    </div>
  );
};

export default Profile;