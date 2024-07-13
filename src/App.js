import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Minus, CheckSquare } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import './index.css';
import './App.css';

const generateFeatureImportances = (patient) => {
  const features = ['Age', 'BT', 'SBP', 'DBP', 'HR', 'RR', 'SO2'];
  return features.map(feature => ({
    feature,
    importance: Math.random() * 100
  })).sort((a, b) => b.importance - a.importance);
};

const generateDynamicVitalData = (baseValue, variation, length) => {
  return Array.from({ length }, (_, i) => baseValue + (Math.random() - 0.5) * variation);
};

const ExclamationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const initialPatients = [
  { id: 'P001', age: 65, gender: 'M', bt: 38.2, sbp: 140, dbp: 90, hr: 90, rr: 18, so2: 97, sepsis_risk: 0.2, sepsis_risk_history: [0.15, 0.18, 0.2, 0.22, 0.2], checklistCompleted: false, chiefComplaint: 'Fever and chills', esi: 2, modeOfArrival: 'Ambulance' },
  { id: 'P002', age: 72, gender: 'F', bt: 37.8, sbp: 110, dbp: 70, hr: 110, rr: 24, so2: 92, sepsis_risk: 0.7, sepsis_risk_history: [0.5, 0.55, 0.6, 0.65, 0.7], checklistCompleted: false, chiefComplaint: 'Shortness of breath', esi: 1, modeOfArrival: 'Walk-in' },
  { id: 'P003', age: 50, gender: 'M', bt: 36.5, sbp: 120, dbp: 80, hr: 75, rr: 16, so2: 99, sepsis_risk: 0.1, sepsis_risk_history: [0.1, 0.1, 0.1, 0.1, 0.1], checklistCompleted: false, chiefComplaint: 'Abdominal pain', esi: 3, modeOfArrival: 'Walk-in' },
  { id: 'P004', age: 40, gender: 'F', bt: 37.0, sbp: 130, dbp: 85, hr: 85, rr: 20, so2: 96, sepsis_risk: 0.3, sepsis_risk_history: [0.35, 0.33, 0.32, 0.31, 0.3], checklistCompleted: false, chiefComplaint: 'Cough and fever', esi: 2, modeOfArrival: 'Ambulance' },
  { id: 'P005', age: 60, gender: 'M', bt: 38.5, sbp: 150, dbp: 95, hr: 100, rr: 22, so2: 94, sepsis_risk: 0.6, sepsis_risk_history: [0.4, 0.45, 0.5, 0.55, 0.6], checklistCompleted: false, chiefComplaint: 'Chest pain', esi: 1, modeOfArrival: 'Ambulance' }
];

const patients = initialPatients.map(patient => ({
  ...patient,
  bt_history: generateDynamicVitalData(patient.bt, 6.5, 7),
  sbp_history: generateDynamicVitalData(patient.sbp, 15, 7),
  dbp_history: generateDynamicVitalData(patient.dbp, 10, 7),
  hr_history: generateDynamicVitalData(patient.hr, 10, 7),
  rr_history: generateDynamicVitalData(patient.rr, 5, 7),
  so2_history: generateDynamicVitalData(patient.so2, 5, 7),
  featureImportances: generateFeatureImportances(patient)
}));

const Banner = () => (
  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: '#2d3748', marginRight: '1.5rem' }}>
    <svg style={{ fill: 'currentColor', height: '2rem', width: '2rem', marginRight: '0.5rem' }} width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
    </svg>
    <span style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>SepsisScan</span>
  </div>
);

const Dashboard = () => {
  const [patientsData, setPatientsData] = useState(patients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedVital, setSelectedVital] = useState(null);
  const [checklistState, setChecklistState] = useState({});
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newPatient = {
        id: 'P006',
        age: 45,
        gender: 'F',
        bt: 39.0,
        sbp: 85,
        dbp: 55,
        hr: 120,
        rr: 30,
        so2: 88,
        sepsis_risk: 0.9,
        sepsis_risk_history: [0.9],
        checklistCompleted: false,
        bt_history: [39.0],
        sbp_history: [85],
        dbp_history: [55],
        hr_history: [120],
        rr_history: [30],
        so2_history: [88],
        featureImportances: generateFeatureImportances({ id: 'P006' }),
        chiefComplaint: 'Severe abdominal pain',
        esi: 1,
        modeOfArrival: 'Walk-in'
      };
  
      setPatientsData(prevPatientsData => [...prevPatientsData, newPatient]);
      toast.error('New high-risk patient (P006) has been admitted!', {
        position: 'top-right',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <ExclamationIcon />,
        style: {
          backgroundColor: '#ff4d4d',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
          border: '2px solid #fff',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
        }
      });
    }, 10000);
  
    return () => clearTimeout(timer);
  }, []);
  
  const handleVitalClick = (patient, vital) => {
    setSelectedPatient(patient);
    setSelectedVital(vital);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowDetailPopup(true);
  };

  const handleChecklistComplete = (patientId, itemIndex) => {
    const updatedChecklistState = {
      ...checklistState,
      [patientId]: {
        ...checklistState[patientId],
        [itemIndex]: !checklistState[patientId]?.[itemIndex]
      }
    };
    setChecklistState(updatedChecklistState);

    const checklistCompleted = Object.values(updatedChecklistState[patientId]).every(item => item);
    const updatedPatients = patientsData.map(patient => {
      if (patient.id === patientId) {
        return { ...patient, checklistCompleted };
      }
      return patient;
    });
    setPatientsData(updatedPatients);
  };

  const getVitalData = (patient, vital) => {
    if (vital === 'bp') {
      return patient.sbp_history.map((sbp, index) => ({
        time: index,
        sbp,
        dbp: patient.dbp_history[index]
      }));
    }
    if (vital === 'sepsis_risk') {
      return patient.sepsis_risk_history.map((risk, index) => ({
        time: index,
        value: risk
      }));
    }
    return patient[`${vital}_history`].map((value, index) => ({
      time: index,
      value
    }));
  };

  const SepsisManagementChecklist = ({ patientId }) => {
    const checklistItems = [
      "Obtain blood cultures",
      "Administer broad-spectrum antibiotics",
      "Measure lactate levels",
      "Begin fluid resuscitation",
      "Monitor vital signs every 15 minutes",
      "Reassess patient status hourly",
      "Consult ICU team",
      "Consider vasopressors if hypotensive after fluid resuscitation"
    ];

    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#fefae0', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          marginBottom: '10px', 
          display: 'flex', 
          alignItems: 'center',
          color: '#2c3e50'
        }}>
          <CheckSquare style={{ marginRight: '10px' }} />
          Sepsis Management Checklist for Patient {patientId}
        </h3>
        <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '15px' }}>
          High-risk patient: Implement sepsis protocol
        </p>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {checklistItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                id={`checklist-item-${index}`} 
                style={{ marginRight: '10px', transform: 'scale(1.2)' }} 
                checked={!!checklistState[patientId]?.[index]}
                onChange={() => handleChecklistComplete(patientId, index)}
              />
              <label htmlFor={`checklist-item-${index}`} style={{ fontSize: '16px', cursor: 'pointer' }}>
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const isAbnormal = (vital, value) => {
    const thresholds = {
      bt: [36, 38],
      hr: [60, 100],
      rr: [12, 20],
      so2: [95, Infinity],
      sbp: [90, 140],
      dbp: [60, 90],
    };
    if (vital === 'bp') {
      return value[0] < thresholds.sbp[0] || value[0] > thresholds.sbp[1] ||
             value[1] < thresholds.dbp[0] || value[1] > thresholds.dbp[1];
    }
    return value < thresholds[vital][0] || value > thresholds[vital][1];
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="dashboard-banner-container">
        <Banner />
      </div>
      <h1 className="dashboard-title">Real-Time Sepsis Monitoring Dashboard</h1>
      <div style={{ overflowX: 'auto' }}>
        <table className="dashboard-table">
          <thead>
            <tr className="dashboard-table-header">
              <th>Patient ID</th>
              <th>Age</th>
              <th>Gender</th>
              <th>BT (°C)</th>
              <th>BP (mmHg)</th>
              <th>HR (bpm)</th>
              <th>RR (bpm)</th>
              <th>SO2 (%)</th>
              <th>Sepsis Risk</th>
              <th>Risk Trend</th>
            </tr>
          </thead>
          <tbody>
            {patientsData.map((patient) => (
              <tr key={patient.id} className="dashboard-table-row">
                <td>
                  <button onClick={() => handlePatientClick(patient)} style={{ cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>
                    {patient.id}
                  </button>
                </td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>
                  <button
                    onClick={() => handleVitalClick(patient, 'bt')}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      color: isAbnormal('bt', patient.bt) ? 'red' : 'inherit',
                      fontWeight: isAbnormal('bt', patient.bt) ? 'bold' : 'normal',
                    }}
                  >
                    {patient.bt.toFixed(1)}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleVitalClick(patient, 'bp')}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      color: isAbnormal('bp', [patient.sbp, patient.dbp]) ? 'red' : 'inherit',
                      fontWeight: isAbnormal('bp', [patient.sbp, patient.dbp]) ? 'bold' : 'normal',
                    }}
                  >
                    {patient.sbp}/{patient.dbp}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleVitalClick(patient, 'hr')}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      color: isAbnormal('hr', patient.hr) ? 'red' : 'inherit',
                      fontWeight: isAbnormal('hr', patient.hr) ? 'bold' : 'normal',
                    }}
                  >
                    {patient.hr}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleVitalClick(patient, 'rr')}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      color: isAbnormal('rr', patient.rr) ? 'red' : 'inherit',
                      fontWeight: isAbnormal('rr', patient.rr) ? 'bold' : 'normal',
                    }}
                  >
                    {patient.rr}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleVitalClick(patient, 'so2')}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      color: isAbnormal('so2', patient.so2) ? 'red' : 'inherit',
                      fontWeight: isAbnormal('so2', patient.so2) ? 'bold' : 'normal',
                    }}
                  >
                    {patient.so2}
                  </button>
                </td>
                <td>
                  <button 
                    onClick={() => handleVitalClick(patient, 'sepsis_risk')}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      backgroundColor: patient.checklistCompleted ? '#f39c12' : (patient.sepsis_risk >= 0.5 ? '#e74c3c' : '#2ecc71'),
                      cursor: 'pointer',
                      border: 'none',
                    }}
                    title={`Sepsis Risk: ${(patient.sepsis_risk * 100).toFixed(1)}%`}
                  />
                </td>
                <td>
                  {patient.sepsis_risk_history.length > 1 && patient.sepsis_risk_history.every((v, i, arr) => v === arr[0]) ? (
                    <span style={{ color: '#f39c12', display: 'flex', alignItems: 'center' }}>
                      <Minus />
                      <span style={{ marginLeft: '4px' }}>Stable</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVitalClick(patient, 'sepsis_risk')}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        color: patient.sepsis_risk_history[patient.sepsis_risk_history.length - 1] > 
                               patient.sepsis_risk_history[0] ? '#e74c3c' : '#2ecc71',
                      }}
                    >
                      {patient.sepsis_risk_history[patient.sepsis_risk_history.length - 1] > 
                       patient.sepsis_risk_history[0] ? <TrendingUp /> : <TrendingDown />}
                      <span style={{ marginLeft: '4px' }}>
                        {patient.sepsis_risk_history[patient.sepsis_risk_history.length - 1] > 
                         patient.sepsis_risk_history[0] ? 'Up' : 'Down'}
                      </span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && selectedVital && (
        <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#2c3e50' }}>
            {selectedVital === 'bp' ? 'Blood Pressure' : selectedVital === 'sepsis_risk' ? 'Sepsis Risk' : selectedVital.toUpperCase()} History for Patient {selectedPatient.id}
          </h2>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer>
              <LineChart data={getVitalData(selectedPatient, selectedVital)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: selectedVital === 'bp' ? 'mmHg' : 'Value', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                {selectedVital === 'bp' ? (
                  <>
                    <Legend />
                    <Line type="monotone" dataKey="sbp" name="SBP" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="dbp" name="DBP" stroke="#82ca9d" strokeWidth={2} />
                  </>
                ) : (
                  <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {selectedVital === 'sepsis_risk' && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#2c3e50' }}>Feature Importance for Sepsis Risk</h3>
              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer>
                  <BarChart data={selectedPatient.featureImportances} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="feature" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {selectedPatient.sepsis_risk >= 0.5 && (
                <SepsisManagementChecklist patientId={selectedPatient.id} />
              )}
            </div>
          )}
        </div>
      )}

      {showDetailPopup && selectedPatient && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxWidth: '400px',
          width: '90%'
        }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#2c3e50', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
            Patient Details: {selectedPatient.id}
          </h2>
          <p style={{ marginBottom: '10px' }}><strong>Chief Complaint:</strong> {selectedPatient.chiefComplaint}</p>
          <p style={{ marginBottom: '10px' }}><strong>ESI:</strong> {selectedPatient.esi}</p>
          <p style={{ marginBottom: '10px' }}><strong>Mode of Arrival:</strong> {selectedPatient.modeOfArrival}</p>
          <button 
            onClick={() => setShowDetailPopup(false)} 
            style={{ 
              marginTop: '15px', 
              cursor: 'pointer', 
              backgroundColor: '#3498db', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px',
              fontSize: '16px',
              display: 'block',
              width: '100%'
            }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const SepsisKPIDashboard = () => {
  const data = [
    { month: 'Jan', screeningRate: 95, antibioticsRate: 88, fluidRate: 92 },
    { month: 'Feb', screeningRate: 97, antibioticsRate: 90, fluidRate: 94 },
    { month: 'Mar', screeningRate: 96, antibioticsRate: 89, fluidRate: 93 },
    { month: 'Apr', screeningRate: 98, antibioticsRate: 92, fluidRate: 95 },
  ];

  const cardStyle = {
    border: '1px solid #ccc',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#2c3e50',
  };

  const kpiStyle = {
    color: '#28a745', // Always green for good KPIs
    fontSize: '24px',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <Banner />
      <h1 style={headingStyle}>Sepsis KPI Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div style={cardStyle}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Average Time to Antibiotics</div>
          <div style={kpiStyle}>45 min</div>
          <p style={{ fontSize: '12px', color: '#6c757d' }}>Target: 60 min</p>
        </div>
        <div style={cardStyle}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Sepsis Screening Compliance</div>
          <div style={kpiStyle}>97%</div>
          <p style={{ fontSize: '12px', color: '#6c757d' }}>Target: 95%</p>
        </div>
        <div style={cardStyle}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Mortality Rate</div>
          <div style={kpiStyle}>12%</div>
          <p style={{ fontSize: '12px', color: '#6c757d' }}>Target: 15%</p>
        </div>
        <div style={cardStyle}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Average LOS for Sepsis Patients</div>
          <div style={kpiStyle}>4.2 days</div>
          <p style={{ fontSize: '12px', color: '#6c757d' }}>Target: 5 days</p>
        </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Sepsis Bundle Compliance Trends</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="screeningRate" name="Screening" fill="#8884d8" />
            <Bar dataKey="antibioticsRate" name="Antibiotics" fill="#82ca9d" />
            <Bar dataKey="fluidRate" name="Fluid Resuscitation" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ border: '1px solid #f5c6cb', padding: '16px', borderRadius: '8px', backgroundColor: '#f8d7da', marginTop: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#721c24' }}>Attention</div>
        <div style={{ color: '#721c24' }}>
          Sepsis screening compliance has improved, but average length of stay needs attention.
        </div>
      </div>
    </div>
  );
};




const App = () => {
  return (
    <Router>
      <div>
        <nav className="nav">
          <Link to="/" className="nav-link">
            Sepsis Monitoring Dashboard
          </Link>
          <Link to="/kpi" className="nav-link">
            Sepsis KPI Dashboard
          </Link>
        </nav>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/kpi" element={<SepsisKPIDashboard />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;