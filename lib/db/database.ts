'use server';

import { Collection, Document, MongoClient } from 'mongodb';
import { Quiz } from '@/types/quiz';
import { User } from '@/types/user';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.DB_CONN_STRING!);
    await cachedClient.connect();
    console.log('Connected to MongoDB');
  }
  return cachedClient;
}

async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const client = await connectToDatabase();
  const db = client.db(process.env.DB_NAME);
  return db.collection<T>(collectionName);
}

async function getUsersCollection() {
  return getCollection<User>(process.env.USERS_COLLECTION_NAME!);
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    console.log('Closed MongoDB connection');
    cachedClient = null;
  }
}

export async function saveQuiz({ authId, email }: User, quiz: Quiz) {
  try {
    // Search for a document with the provided email
    console.log('looking for doc');
    const users = await getUsersCollection();
    const existingDocument = await users.findOne({ authId });
    console.log(`existing doc: ${existingDocument}`);

    if (existingDocument) {
      // If a document is found, push the person into the persons array
      await users.updateOne({ authId }, { $push: { quizzes: quiz } });
    } else {
      // If no document is found, create a new document with the provided email
      const newDocument = { authId, email, quizzes: [quiz] };
      console.log(`new doc: ${JSON.stringify(newDocument, null, 2)}`);
      const result = await users.insertOne(newDocument);
      console.log(`result: ${JSON.stringify(result, null, 2)}`);
    }
  } catch (err) {
    console.error('Failed to save quiz.', err);
    throw err;
  }
}

export async function getUser(authId: string) {
  console.log(`getting user: ${authId}`);
  const users = await getUsersCollection();
  const result = await users.findOne({ authId });
  // TODO
  // doing this as a hack for getting around warning for returning non-POJsO from server to client
  return JSON.parse(JSON.stringify(result)) as User;
}
