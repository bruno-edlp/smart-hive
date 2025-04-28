import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [monitoramentos, setMonitoramentos] = useState([]);
  const [colmeias, setColmeias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [predatorDetections, setPredatorDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monitoramentosRes, colmeiasRes, alertasRes] = await Promise.all([
          api.get('/monitoramento?limit=5'),
          api.get('/colmeias'),
          api.get('/alertas')
        ]);

        setMonitoramentos(monitoramentosRes.data);
        setColmeias(colmeiasRes.data);
        setAlertas(alertasRes.data);
        
        // Filter predator detection alerts
        const predators = alertasRes.data.filter(alert => 
          alert.descricao_alerta.toLowerCase().includes('predador') ||
          alert.descricao_alerta.toLowerCase().includes('invasor')
        );
        setPredatorDetections(predators);
        
        setError('');
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('pt-BR');
  };

  const getSituacaoColor = (situacao) => {
    switch (situacao) {
      case 'Normal':
        return 'success';
      case 'Alerta':
        return 'warning';
      case 'Crítico':
        return 'danger';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h1 className="mb-2 mb-md-0 main-title">
          <i className="fas fa-tachometer-alt me-2"></i> Visão Geral
        </h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={4} md={6} className="mb-4">
          <Card className="dashboard-card h-100">
            <div className="dashboard-card-header">
              <h5 className="mb-0"><i className="fas fa-home me-2"></i> Colmeias</h5>
            </div>
            <div className="dashboard-card-body text-center">
              <div className="dashboard-value">{colmeias.length}</div>
              <div className="dashboard-label">Total de Colmeias Cadastradas</div>
            </div>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Card className="dashboard-card h-100">
            <div className="dashboard-card-header">
              <h5 className="mb-0"><i className="fas fa-clipboard-list me-2"></i> Monitoramentos</h5>
            </div>
            <div className="dashboard-card-body text-center">
              <div className="dashboard-value">{monitoramentos.length > 0 ? monitoramentos[0].id : 0}</div>
              <div className="dashboard-label">Total de Monitoramentos Realizados</div>
            </div>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Card className="dashboard-card h-100">
            <div className="dashboard-card-header">
              <h5 className="mb-0"><i className="fas fa-bell me-2"></i> Alertas</h5>
            </div>
            <div className="dashboard-card-body text-center">
              <div className="dashboard-value">{alertas.length}</div>
              <div className="dashboard-label">Total de Alertas Registrados</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header>Monitoramentos Recentes</Card.Header>
            <Card.Body>
              {monitoramentos.length === 0 ? (
                <Alert variant="info">
                  Nenhum monitoramento registrado ainda.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Colmeia</th>
                        <th>Núm. Abelhas</th>
                        <th>Temp.</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monitoramentos.map((monitoramento) => (
                        <tr key={monitoramento.id}>
                          <td>{formatDateTime(monitoramento.data_hora)}</td>
                          <td>{monitoramento.nome_colmeia || `Colmeia ${monitoramento.colmeia_id}`}</td>
                          <td>{monitoramento.numero_abelhas}</td>
                          <td>
                            <span 
                              className={
                                monitoramento.temperatura < 20 ? 'text-info' : 
                                monitoramento.temperatura > 30 ? 'text-danger' : 
                                'text-success'
                              }
                            >
                              {monitoramento.temperatura}°C
                            </span>
                          </td>
                          <td>
                            <Badge bg={getSituacaoColor(monitoramento.situacao)}>
                              {monitoramento.situacao}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="text-end">
              <Link to="/lista" className="btn btn-sm btn-outline-primary">
                Ver Todos <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header className="text-danger">
              <i className="fas fa-exclamation-triangle me-2"></i> Alertas Recentes
            </Card.Header>
            <Card.Body className="p-0">
              {alertas.length === 0 ? (
                <div className="p-3">
                  <Alert variant="success">
                    Nenhum alerta ativo no momento.
                  </Alert>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {alertas.slice(0, 5).map((alerta) => (
                    <li key={alerta.id} className="list-group-item border-0 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <span className="badge bg-danger p-2">
                            <i className="fas fa-bell"></i>
                          </span>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="small text-muted mb-1">
                            {formatDateTime(alerta.data_hora)}
                          </div>
                          <div className="mb-1">{alerta.descricao_alerta}</div>
                          <Badge bg="light" text="dark" className="text-small">
                            {alerta.nome_colmeia || `Colmeia ${alerta.colmeia_id}`}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
            <Card.Footer className="text-end">
              <Link to="/alertas" className="btn btn-sm btn-outline-danger">
                Ver Todos <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="text-danger">
              <i className="fas fa-bug me-2"></i> Detecção de Predadores
            </Card.Header>
            <Card.Body className="p-0">
              {predatorDetections.length === 0 ? (
                <div className="p-3">
                  <Alert variant="success">
                    <i className="fas fa-check-circle me-2"></i>
                    Nenhum predador detectado recentemente. Colmeias seguras!
                  </Alert>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {predatorDetections.slice(0, 3).map((alerta, index) => (
                    <li key={index} className="list-group-item border-0 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <span className="badge bg-danger p-2">
                            <i className="fas fa-bug"></i>
                          </span>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="small text-muted mb-1">
                            {formatDateTime(alerta.data_hora)}
                          </div>
                          <div className="mb-1">{alerta.descricao_alerta}</div>
                          <Badge bg="light" text="dark" className="text-small">
                            {alerta.nome_colmeia || `Colmeia ${alerta.colmeia_id}`}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
            <Card.Footer className="text-center">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Sistema monitorando ativamente a presença de predadores
              </small>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <i className="fas fa-heart me-2 text-danger"></i> Saúde das Colmeias
            </Card.Header>
            <Card.Body className="p-0">
              <div className="p-3">
                <div className="d-flex justify-content-center mb-4">
                  <Link to="/grafico-dashboard" className="btn btn-primary">
                    <i className="fas fa-chart-line me-2"></i> Ver Dashboard Completo
                  </Link>
                </div>
                
                <div className="alert alert-info mb-0">
                  <div className="d-flex">
                    <div className="me-3 fs-4">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div>
                      <h5 className="alert-heading">Saiba mais sobre a saúde das colmeias</h5>
                      <p className="mb-0">Acesse o dashboard completo para visualizar gráficos detalhados sobre a saúde das suas colônias, análises sazonais e detecção de predadores.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;