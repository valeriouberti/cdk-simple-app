import { APIGatewayProxyHandler } from 'aws-lambda'
import { S3 } from 'aws-sdk'

const s3 = new S3({})
const bucketName = process.env.BUCKET_NAME!

export const handler: APIGatewayProxyHandler = async event => {


    const fileId = event.pathParameters?.['file-id']!
    if(event.httpMethod === 'GET' && event.resource === '/{file-id}'){

        const data = await s3.getObject({ Bucket: bucketName, Key: fileId }).promise();
        const body = data.Body?.toString('utf-8')
        return {
            statusCode: 200,
            body: JSON.stringify(body)
        }
    }

    return {
        statusCode: 400,
        body: 'We only accept GET /',
    }
}