import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApolloProvider from './ApolloProvider';
import Home from './components/Home';
import ClimbLogForm from './components/ClimbLogForm';
import ClimbLogList from './components/ClimbLogList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Navbar from './components/NavBar'; 

import './App.css'; 

function App() {
  return (
    <ApolloProvider>
      <Router>
        <div className="App">
          {/* Include the Navbar at the top of the app */}
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<ClimbLogForm />} />
              <Route path="/logs" element={<ClimbLogList />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
