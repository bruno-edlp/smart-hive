import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        onLogin();
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro no login. Verifique suas credenciais ou a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-bee"></i>
          </div>
          <h2>Smart Hive</h2>
          <p className="mb-0">Sistema de Monitoramento de Abelhas Nativas</p>
        </div>
        
        <div className="login-body">
          {error && (
            <Alert variant="danger" className="mb-4">
              <i className="fas fa-exclamation-circle me-2"></i>{error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formUsername">
              <Form.Label>Usuário</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Digite seu usuário"
                  required
                  autoFocus
                  className="py-2"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label>Senha</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  required
                  className="py-2"
                />
              </div>
            </Form.Group>

            <div className="d-grid mb-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="py-2"
                style={{
                  fontSize: '1rem', 
                  fontWeight: 500,
                  boxShadow: '0 4px 10px rgba(0, 188, 212, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Entrar
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center text-muted">
              <small>Para teste: Usuário: <code>admin</code>, Senha: <code>admin</code></small>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;