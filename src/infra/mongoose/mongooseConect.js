require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MONGODB_TIMEOUT = 60000; // 60 seconds
const MAX_RETRIES = 3;

async function connectWithRetry(uri, options, retries = MAX_RETRIES) {
  try {
    await mongoose.connect(uri, options);
    console.log('MongoDB conectado com sucesso');
  } catch (err) {
    console.error(`Tentativa ${MAX_RETRIES - retries + 1} falhou:`, err.message);
    if (retries > 0) {
      console.log(`Tentando reconectar em 5 segundos...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectWithRetry(uri, options, retries - 1);
    }
    throw err;
  }
}

async function connectDB() {
  const mongooseOptions = {
    serverSelectionTimeoutMS: MONGODB_TIMEOUT,
    socketTimeoutMS: MONGODB_TIMEOUT,
    connectTimeoutMS: MONGODB_TIMEOUT,
    heartbeatFrequencyMS: 2000,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 2,
};

  try {
    if (process.env.NODE_ENV === 'development') {
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await connectWithRetry(mongoUri, mongooseOptions);
      console.log('Conectado ao MongoDB em memória');
      return;
    }

    // Production connection
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI não definida em ambiente de produção');
    }

    await connectWithRetry(process.env.MONGO_URI, mongooseOptions);
    
    // Add connection error handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado, tentando reconectar...');
      connectWithRetry(process.env.MONGO_URI, mongooseOptions);
    });

  } catch (error) {
    console.error('Erro fatal ao conectar ao MongoDB:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    process.exit(1);
  }
}

module.exports = connectDB;