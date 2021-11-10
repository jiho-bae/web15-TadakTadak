import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImageService {
  private s3: AWS.S3;

  constructor() {
    const endpoint = new AWS.Endpoint(process.env.NCP_OBJECT_END_POINT);
    const region = process.env.NCP_REGION;
    this.s3 = new AWS.S3({
      endpoint,
      region,
      credentials: {
        accessKeyId: process.env.NCP_ACCESS_KEY,
        secretAccessKey: process.env.NCP_SECRET_KEY,
      },
    });
  }

  async uploadImage(image) {
    const param = {
      Bucket: process.env.NCP_BUCKET_NAME,
      Key: `images/${Date.now()}-${image.originalname}`,
      Body: image.buffer,
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(param, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}
