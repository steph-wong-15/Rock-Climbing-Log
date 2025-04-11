import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// GraphQL mutations
const ADD_CLIMB_LOG = gql`
  mutation AddClimbLog(
    $date: String!,
    $location: String!,
    $difficulty: String!,
    $notes: String!,
    $media: [MediaInput]
  ) {
    addClimbLog(date: $date, location: $location, difficulty: $difficulty, notes: $notes, media: $media) {
      id
      date
      location
      difficulty
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
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');

  // Apollo hooks for mutations
  const [addClimbLog, { loading, error }] = useMutation(ADD_CLIMB_LOG);
  const [generateS3UploadUrl] = useMutation(GENERATE_S3_UPLOAD_URL);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Generate signed URL for the file upload
    let mediaUrl = '';
    if (file) {
      const { data } = await generateS3UploadUrl({
        variables: { fileType: file.type },
      });

      const signedUrl = data.generateS3UploadUrl;
      console.log('Signed URL:', signedUrl);

      // Step 2: Upload the file to S3 using the signed URL
      await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      // Step 3: Store the public URL of the uploaded file
      mediaUrl = signedUrl.split('?')[0]; // Get the URL without the query params
    }

    // Step 4: Call the mutation to add the climb log with media URL
    try {
      await addClimbLog({
        variables: {
          date,
          location,
          difficulty,
          notes,
          media: mediaUrl
            ? [{ type: file.type.startsWith('video') ? 'video' : 'image', url: mediaUrl }]
            : [],
        },
      });
      setDate('');
      setLocation('');
      setDifficulty('');
      setNotes('');
      setFile(null);
      setFileUrl('');
    } catch (err) {
      console.error('Error adding climb log:', err);
    }
  };

  return (
    <div className="form-container">
      <h2>Log a New Climb</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="difficulty">Difficulty:</label>
          <input
            type="text"
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* File upload input */}
        <div>
          <label htmlFor="file">Upload Image/Video:</label>
          <input
            type="file"
            id="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />  
        {file && <img src={URL.createObjectURL(file)} alt="preview" width={100} height={100} />}
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
