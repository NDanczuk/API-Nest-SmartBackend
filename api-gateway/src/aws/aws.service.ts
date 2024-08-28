import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  public async fileUpload(file: any, id: string) {
    const s3 = new AWS.S3({
      region: 'us-east-2',
      accessKeyId: process.env.ACCESS_KEY_ID, //ACCESS_KEY_ID
      secretAccessKey: process.env.SECRET_ACCESS_KEY, //SECRET_ACCESS_KEY
    });

    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
    };

    s3.putObject;
  }
}
