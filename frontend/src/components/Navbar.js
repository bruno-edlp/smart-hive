import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({});
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : '';
  };
  
  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-bee"></i>
            <span className="logo-text">Smart Hive</span>
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-info">
            <h5>{user.nome || user.username}</h5>
          </div>
        </div>
        
        <ul className="sidebar-menu">
          <li className={isActive('/dashboard')}>
            <Link to="/dashboard">
              <i className="fas fa-tachometer-alt"></i>
              <span>Visão Geral</span>
            </Link>
          </li>
          <li className={isActive('/grafico-dashboard')}>
            <Link to="/grafico-dashboard">
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className="menu-header">Apiários</li>
          
          <li className={isActive('/apiarios')}>
            <Link to="/apiarios">
              <i className="fas fa-leaf"></i>
              <span>Gerenciar Apiários</span>
            </Link>
          </li>
          
          <li className="menu-header">Monitoramento</li>
          
          <li className={isActive('/cadastro')}>
            <Link to="/cadastro">
              <i className="fas fa-plus-circle"></i>
              <span>Novo Registro</span>
            </Link>
          </li>
          
          <li className={isActive('/lista')}>
            <Link to="/lista">
              <i className="fas fa-clipboard-list"></i>
              <span>Registros</span>
            </Link>
          </li>
          
          <li className="menu-header">Colmeias</li>
          
          <li className={isActive('/colmeias')}>
            <Link to="/colmeias">
              <i className="fas fa-home"></i>
              <span>Gerenciar Colmeias</span>
            </Link>
          </li>
          
          <li className={isActive('/alertas')}>
            <Link to="/alertas">
              <i className="fas fa-bell"></i>
              <span>Alertas</span>
            </Link>
          </li>
          
          <li className="menu-header">Sistema</li>
          
          <li className={isActive('/configuracoes')}>
            <Link to="/configuracoes">
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
            </Link>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>
      
      <div className={`top-navbar ${collapsed ? 'expanded' : ''}`}>
        <div className="d-flex align-items-center">
          <button className="menu-toggle me-3" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div className="top-navbar-right">
          <div className="notification-bell">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
          <div className="user-dropdown">
            <button className="user-dropdown-toggle">
              <i className="fas fa-user-circle"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="content-wrapper">
        {/* Content will be rendered here */}
      </div>
    </>
  );
};

export default Navbar;