import React from 'react';
import AnalyticsSummary from './AnalyticsSummary';
import AnalyticsGraph from './AnalyticsGraph';

const AnalyticsDashboard = () => {
  return (
    <div className="analytics-dashboard">
      <section className="container">
        <h1>Analytics Dashboard</h1>
        <AnalyticsSummary />
        <AnalyticsGraph />
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
