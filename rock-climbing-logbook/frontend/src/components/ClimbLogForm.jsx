import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const ADD_CLIMB_LOG = gql`
  mutation AddClimbLog(
    $date: String!,
    $location: String!,
    $typeOfClimb: String!,
    $difficulty: String!,
    $attempts: Int!,
    $notes: String!,
    $media: [MediaInput]
  ) {
    addClimbLog(
      date: $date,
      location: $location,
      typeOfClimb: $typeOfClimb,
      difficulty: $difficulty,
      attempts: $attempts,
      notes: $notes,
      media: $media
    ) {
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

const GENERATE_S3_UPLOAD_URL = gql`
  mutation GenerateS3UploadUrl($fileType: String!) {
    generateS3UploadUrl(fileType: $fileType)
  }
`;

const ClimbForm = () => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [typeOfClimb, setTypeOfClimb] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  const [addClimbLog, { loading, error }] = useMutation(ADD_CLIMB_LOG);
  const [generateS3UploadUrl] = useMutation(GENERATE_S3_UPLOAD_URL);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let mediaUrl = '';
    if (file) {
      const { data } = await generateS3UploadUrl({
        variables: { fileType: file.type },
      });

      const signedUrl = data.generateS3UploadUrl;

      await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      mediaUrl = signedUrl.split('?')[0];
    }

    try {
      await addClimbLog({
        variables: {
          date,
          location,
          typeOfClimb,
          difficulty,
          attempts: parseInt(attempts),
          notes,
          media: mediaUrl
            ? [{ type: file.type.startsWith('video') ? 'video' : 'image', url: mediaUrl }]
            : [],
        },
      });

      // Reset form
      setDate('');
      setLocation('');
      setTypeOfClimb('');
      setDifficulty('');
      setAttempts(1);
      setNotes('');
      setFile(null);
    } catch (err) {
      console.error('Error adding climb log:', err);
    }
  };

  const boulderingGrades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];
  const ropeGrades = [
    '5.6', '5.7', '5.8', '5.9',
    '5.10a', '5.10b', '5.10c', '5.10d',
    '5.11a', '5.11b', '5.11c', '5.11d',
    '5.12a', '5.12b', '5.12c', '5.12d',
  ];

  return (
    <div className="form-container">
      <h2>Log a New Climb</h2>

      <form onSubmit={handleSubmit} className="climb-form">
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Type of Climb:</label>
          <select value={typeOfClimb} onChange={(e) => {
            setTypeOfClimb(e.target.value);
            setDifficulty('');
          }} required>
            <option value="">Select type</option>
            <option value="Bouldering">Bouldering</option>
            <option value="Top Rope">Top Rope</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div className="form-group">
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            disabled={!typeOfClimb}
          >
            <option value="">Select difficulty</option>
            {(typeOfClimb === 'Bouldering' ? boulderingGrades : ropeGrades).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Number of Attempts:</label>
          <input type="number" value={attempts} min="1" onChange={(e) => setAttempts(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Upload Image/Video:</label>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
          {file && file.type.startsWith('image') && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{ width: '120px', marginTop: '10px' }}
            />
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Log Climb'}
        </button>

        {error && <p className="error-message">Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default ClimbForm;
