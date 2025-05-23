const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLInt } = require('graphql');
const ClimbLog = require('../models/ClimbLog');  // ClimbLog model
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');


// Define the types
const MediaType = new GraphQLObjectType({
  name: 'Media',
  fields: () => ({
    type: { type: GraphQLString },
    url: { type: GraphQLString },
    uploadedAt: { type: GraphQLString },
  }),
});

const ClimbLogType = new GraphQLObjectType({
  name: 'ClimbLog',
  fields: () => ({
    id: { type: GraphQLString },
    date: {
      type: GraphQLString,
      resolve(parent) {
        const date = new Date(parent.date); // Convert Unix timestamp to Date object
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
    },    
    location: { type: GraphQLString },
    typeOfClimb: { type: GraphQLString },
    difficulty: { type: GraphQLString },
    attempts: { type: GraphQLInt },
    notes: { type: GraphQLString },
    media: { type: new GraphQLList(MediaType) }, // 👈 Add this
  }),
});

// Root query to fetch all climb logs
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    climbLogs: {
      type: new GraphQLList(ClimbLogType),
      resolve(parent, args) {
        return ClimbLog.find();  // Fetch all climb logs
      },
    },

    climbLog: {
      type: ClimbLogType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return ClimbLog.findById(args.id);  // Find a climb log by ID
      },
    },

    totalClimbs: {
      type: GraphQLString,
      async resolve() {
        const count = await ClimbLog.countDocuments();
        return count.toString(); 
      },
    },

    climbsThisMonth: {
      type: GraphQLString,
      async resolve() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        
        const count = await ClimbLog.countDocuments({
          date: {
            $gte: startOfMonth,
            $lt: startOfNextMonth,
          },
        });
        return count.toString();
      },
    },
  },
});

const MediaInputType = new GraphQLInputObjectType({
  name: 'MediaInput',
  fields: {
    type: { type: GraphQLString }, // "image" or "video"
    url: { type: GraphQLString },  // S3 URL
  },
});

// Mutation to add a new climb log
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClimbLog: {
      type: ClimbLogType,
      args: {
        date: { type: GraphQLString },
        location: { type: GraphQLString },
        typeOfClimb: { type: GraphQLString },
        difficulty: { type: GraphQLString },
        attempts: { type: GraphQLInt },
        notes: { type: GraphQLString },
        media: { type: new GraphQLList(MediaInputType) },
      },
      resolve(parent, args) {
        const newClimbLog = new ClimbLog({
          date: new Date(args.date),
          location: args.location,
          typeOfClimb: args.typeOfClimb,
          difficulty: args.difficulty,
          attempts: args.attempts,
          notes: args.notes,
          media: args.media || [],
        });

        return newClimbLog.save();  // Save the new climb log to the database
      },
    },

    generateS3UploadUrl: {
      type: GraphQLString,
      args: {
        fileType: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const fileExt = args.fileType.split('/')[1];
        const fileName = `uploads/${Date.now()}.${fileExt}`;

        const s3 = new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          ContentType: args.fileType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

        return uploadUrl;
      },
    }
  },
});

// Export the schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
