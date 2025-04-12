import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApolloProvider from './ApolloProvider';
import Home from './pages/Home';
import ClimbLogForm from './components/ClimbLogForm';
import ClimbLogList from './components/ClimbLogList';
import Analytics from './components/Analytics'; 
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
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
