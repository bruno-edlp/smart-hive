import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const DetalheColmeia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [colmeia, setColmeia] = useState(null);
  const [monitoramentos, setMonitoramentos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colmeiaRes, monitoramentosRes, alertasRes] = await Promise.all([
          api.get(`/colmeias/${id}`),
          api.get(`/colmeias/${id}/monitoramentos`),
          api.get(`/colmeias/${id}/alertas`)
        ]);

        setColmeia(colmeiaRes.data);
        setMonitoramentos(monitoramentosRes.data);
        setAlertas(alertasRes.data);
        setError('');
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados da colmeia.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ativa':
        return 'success';
      case 'em manutenção':
        return 'warning';
      case 'inativa':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta colmeia?')) {
      try {
        await api.delete(`/colmeias/${id}`);
        navigate('/colmeias');
      } catch (error) {
        console.error('Erro ao excluir colmeia:', error);
        setError('Erro ao excluir a colmeia. Verifique se não há registros vinculados.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando dados da colmeia...</p>
      </div>
    );
  }

  if (!colmeia) {
    return <Alert variant="danger">Colmeia não encontrada.</Alert>;
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h2 className="mb-2 mb-md-0 main-title">Detalhes da Colmeia</h2>
        <div>
          <Button 
            as={Link} 
            to={`/colmeias/editar/${id}`} 
            variant="warning" 
            className="me-2 mb-2 mb-md-0"
          >
            <i className="fas fa-edit me-1"></i> Editar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="fas fa-trash me-1"></i> Excluir
          </Button>
        </div>
      </div>
      
      <Card className="mb-4">
        <Card.Header>Informações da Colmeia</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <strong>Nome:</strong> {colmeia.nome}
            </Col>
            <Col md={4} className="mb-3">
              <strong>Localização:</strong> {colmeia.localizacao}
            </Col>
            <Col md={4} className="mb-3">
              <strong>Status:</strong> <Badge bg={getStatusColor(colmeia.status)}>{colmeia.status}</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Tabs defaultActiveKey="monitoramentos" className="mb-3">
        <Tab eventKey="monitoramentos" title="Monitoramentos">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Monitoramentos</span>
              <Button 
                as={Link} 
                to="/cadastro" 
                variant="primary" 
                size="sm"
              >
                Novo Monitoramento
              </Button>
            </Card.Header>
            <Card.Body>
              {monitoramentos.length === 0 ? (
                <Alert variant="info">
                  Nenhum monitoramento registrado para esta colmeia.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Data e Hora</th>
                        <th>Número de Abelhas</th>
                        <th>Temperatura (°C)</th>
                        <th>Clima</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monitoramentos.map(monitoramento => (
                        <tr key={monitoramento.id}>
                          <td>{formatDateTime(monitoramento.data_hora)}</td>
                          <td>{monitoramento.numero_abelhas}</td>
                          <td>{monitoramento.temperatura}</td>
                          <td>{monitoramento.clima}</td>
                          <td>
                            <Badge bg={
                              monitoramento.situacao === 'Normal' ? 'success' :
                              monitoramento.situacao === 'Alerta' ? 'warning' :
                              monitoramento.situacao === 'Crítico' ? 'danger' : 'info'
                            }>
                              {monitoramento.situacao}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="alertas" title="Alertas">
          <Card>
            <Card.Header>Alertas</Card.Header>
            <Card.Body>
              {alertas.length === 0 ? (
                <Alert variant="info">
                  Nenhum alerta registrado para esta colmeia.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Data e Hora</th>
                        <th>Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertas.map(alerta => (
                        <tr key={alerta.id}>
                          <td>{formatDateTime(alerta.data_hora)}</td>
                          <td>{alerta.descricao_alerta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default DetalheColmeia;