import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ANALYTICS = gql`
  query {
    totalClimbs
    climbsThisMonth
  }
`;

const Analytics = () => {

    const { loading, error, data } = useQuery(GET_ANALYTICS);

  return (
    <div>
      <section className="container">
        <h1>Analytics Dashboard</h1>

        {loading && <p>Loading data...</p>}
        {error && <p>Error loading analytics.</p>}


        {data ? (
          <div className="analytics-stats">
            <div className="stat">
              <h2>Total Climbs</h2>
              <p>{data.totalClimbs}</p>
            </div>
            <div className="stat">
              <h2>Climbs This Month</h2>
              <p>{data.climbsThisMonth}</p>
            </div>
          </div>
        ) : (
          !loading && !error && <p>No analytics data available.</p>
        )}

      </section>
    </div>
  );
};

export default Analytics;
