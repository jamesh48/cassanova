#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CassanovaFrontendStack } from '../lib/cassanova-frontend-stack'

const app = new cdk.App()

new CassanovaFrontendStack(app, 'CassanovaFrontendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})
