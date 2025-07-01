import { Container } from 'typedi';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

import config from '../config';
import {sseData} from "./sseServer";


export default ({logger, keycloak, redis, models, elastic, rulesEngine }:
                { logger: any; keycloak: any; redis: any; elastic: any; rulesEngine: any, models: { name: string; model: any }[] }) => {


    Container.set('elastic', elastic)
    logger.info('✌️ Elastic injected into container');

    Container.set('keycloak', keycloak)
    logger.info('✌️ Keycloak injected into container');

    Container.set('logger', logger);
    logger.info('✌️ Logger injected into container');

    redis.flushAll()
    logger.info('✌️ Redis is empty');
    Container.set('redis', redis)
    logger.info('✌️ Redis injected into container');

    Container.set('sseClients', sseData);
    logger.info('✌️ sseClients injected into container');

    Container.set('rulesEngine', rulesEngine)
    logger.info('✌️ rulesEngine inject into container');

    try {
        if (models !== undefined){
            models.forEach(m => {
                Container.set(m.name, m.model);
                logger.info(`✌️ Model ${m.name} injected into container`);
            });
        }

    const mgInstance = new Mailgun(formData);

    // @ts-ignore
    Container.set('emailClient', mgInstance.client({ key: config.emails.apiKey, username: config.emails.apiUsername }));
    Container.set('emailDomain', config.emails.domain);

  } catch (e) {
    logger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
