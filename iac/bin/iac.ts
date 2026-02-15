#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CassanovaFrontendStack } from '../lib/cassanova-frontend-stack'

const app = new cdk.App()

const { CSN_CERTIFICATE_ARN } = process.env

if (!CSN_CERTIFICATE_ARN) {
  throw new Error('CSN_CERTIFICATE_ARN is undefined!')
}

new CassanovaFrontendStack(app, 'CassanovaFrontendStack', {
  CSN_CERTIFICATE_ARN,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})
