import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const GET_CLIMB_LOGS = gql`
  query GetClimbLogs {
    climbLogs {
      id
      date
      location
      typeOfClimb
      difficulty
      attempts
      notes
      media {
        type
        url
      }
    }
  }
`;

const ClimbList = () => {
  const { loading, error, data } = useQuery(GET_CLIMB_LOGS);
  const [expandedLogs, setExpandedLogs] = useState({});

  const toggleMedia = (id) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p>Loading climb logs...</p>;
  if (error) return <p>Error fetching climb logs: {error.message}</p>;

  return (
    <div className="climb-list">
      <h2>Climb Logs</h2>
      <ul>
        {data.climbLogs.map((climb) => (
          <li key={climb.id} className="climb-item" style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
            <h3>{climb.location}</h3>
            <p><strong>Date:</strong> {climb.date}</p>
            <p><strong>Type of Climb:</strong> {climb.typeOfClimb}</p>
            <p><strong>Difficulty:</strong> {climb.difficulty}</p>
            <p><strong>Attempts:</strong> {climb.attempts}</p>
            <p><strong>Notes:</strong> {climb.notes}</p>

            {climb.media.length > 0 && (
              <button onClick={() => toggleMedia(climb.id)} style={{ marginTop: '0.5rem' }}>
                {expandedLogs[climb.id] ? 'Hide Media' : 'Show Media'}
              </button>
            )}

            {expandedLogs[climb.id] && (
              <div className="media-section" style={{ marginTop: '1rem' }}>
                {climb.media.map((item, index) => {
                  if (item.type.startsWith('image')) {
                    return (
                      <img
                        key={index}
                        src={item.url}
                        alt={`climb media ${index}`}
                        style={{ maxWidth: '300px', margin: '10px 0' }}
                      />
                    );
                  } else if (item.type.startsWith('video')) {
                    return (
                      <video
                        key={index}
                        src={item.url}
                        controls
                        style={{ maxWidth: '300px', margin: '10px 0' }}
                      />
                    );
                  } else {
                    return <p key={index}>Unsupported media type</p>;
                  }
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClimbList;
