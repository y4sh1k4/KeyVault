import * as Lambda from 'aws-lambda';
import 'source-map-support/register.js';
import { verifyToken } from './utils/token';
import { getSecretsByUserId } from './utils/service';

export const handler: Lambda.APIGatewayProxyHandler = async (event) => {
  try {
    const authHeader = event.headers['Authorization'] || event.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    console.log("Authenticated user ID:", payload);
    const secrets = await getSecretsByUserId(Number(payload));

    return { statusCode: 200, body: JSON.stringify({ secrets }) };
  } catch (err: any) {
    return { statusCode: 401, body: JSON.stringify({ message: err.message }) };
  }
};