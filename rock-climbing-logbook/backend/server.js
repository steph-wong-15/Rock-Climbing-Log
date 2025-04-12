const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');  // Importing GraphQL schema

dotenv.config();
const app = express();
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,  // Provides a UI for testing GraphQL queries
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
