import { isDEV, isPROD } from './env';

// Polymath Engine Backend
const DevApiURL = 'https://chat.sruim.xin/api/v1';
const StagingApiURL = 'https://chat.sruim.xin/api/v1';
const ProdApiURL = 'https://chat.sruim.xin/api/v1';

export const ApiURL = isDEV ? DevApiURL : isPROD ? ProdApiURL : StagingApiURL;
export const EngineEndpoint = `${ApiURL}/engine`;

// Base URLs
const DevBaseUrl = 'http://localhost:3000';
const StagingBaseUrl = 'https://staging.example.com';
const ProdBaseUrl = 'https://example.com';

export const BaseUrl = isDEV ? DevBaseUrl : isPROD ? ProdBaseUrl : StagingBaseUrl;
