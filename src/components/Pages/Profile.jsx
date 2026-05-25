import React, { useEffect, useState } from 'react';
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
      const res = await fetch(`/account.json?t=${Date.now()}`);
      let accounts = await res.json();
      const idx = accounts.findIndex(acc => acc.id === user.id);

      if (idx === -1 || accounts[idx].pass !== curPass.trim()) {
        setPwErr('Mật khẩu hiện tại không chính xác!');
        return;
      }
      accounts[idx].pass = newPass.trim();
      await fetch('/api/save/account', {
        method: 'POST',
        body: JSON.stringify(accounts)
      });
      setPwMsg('Đổi mật khẩu thành công!');
      clearPasswordForm();
    } catch (err) { setPwErr('Lỗi!'); }
  };  

const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm('Xóa vĩnh viễn tài khoản?')) return;

    try {
      const res = await fetch(`/account.json?t=${Date.now()}`);
      let accounts = await res.json();
      const nextList = accounts.filter(acc => acc.id !== user.id);
      await fetch('/api/save/account', {
        method: 'POST',
        body: JSON.stringify(nextList)
      });

      localStorage.removeItem('currentUser');
      window.dispatchEvent(new Event('userUpdated'));
      navigate('/', { replace: true });
    } catch (err) { setDelErr('Lỗi!'); }
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