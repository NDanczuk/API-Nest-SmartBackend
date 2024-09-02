import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  public async fileUpload(file: any, id: string) {
    const s3 = new AWS.S3({
      region: process.env.BUCKET_REGION,
      accessKeyId: process.env.ACCESS_KEY_ID, //ACCESS_KEY_ID
      secretAccessKey: process.env.SECRET_ACCESS_KEY, //SECRET_ACCESS_KEY
    });

    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: process.env.BUCKET_NAME,
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return {
            url: `https://${process.env.BUCKET_NAME}.s3-${process.env.BUCKET_REGION}.amazonaws.com/${id}.${fileExtension}`,
          };
        },
        (err) => {
          this.logger.error(err);
          return err;
        },
      );

    return data;
  }
}
