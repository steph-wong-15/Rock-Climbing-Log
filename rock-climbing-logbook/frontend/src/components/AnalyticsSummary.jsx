import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the query to get the analytics summary
const GET_ANALYTICS_SUMMARY = gql`
  query {
    totalClimbs
    climbsThisMonth
  }
`;

const AnalyticsSummary = () => {
  const { loading, error, data } = useQuery(GET_ANALYTICS_SUMMARY);

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p>Error fetching climb logs: {error.message}</p>;

  return (
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
  );
};

export default AnalyticsSummary;
