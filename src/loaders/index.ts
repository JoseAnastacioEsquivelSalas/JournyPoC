import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import './events'
import {Engine} from 'json-rules-engine';

// @ts-ignore
export default async ({ expressApp }) => {


  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const keycloak = require('./keycloak').getKeycloak()
  const elastic = require('./elasticsearch').default
  const logger = require('./logger').default
  const redis = require('./redis').default
  const rulesEngine = new Engine()

  const journeyModel = {
    name: 'journeyModel',
    model: require('../domain/models/journey.model').default,
  };

  const stateModel = {
    name: 'stateModel',
    model: require('../domain/models/state.model').default,
  };

  const journeyInstanceModel = {
    name: 'journeyInstanceModel',
    model: require('../domain/models/journeyInstance.model').default,
  };

  const journeyTransitionModel = {
    name: 'journeyTransitionModel',
    model: require('../domain/models/journeyTransition.model').default,
  };

  const ruleModel = {
    name: 'ruleModel',
    model: require('../domain/models/rule.model').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  // @ts-ignore
  await dependencyInjectorLoader({
     logger, keycloak, redis, elastic, rulesEngine, models: [journeyModel, stateModel, journeyInstanceModel, journeyTransitionModel, ruleModel]
  })

  logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });

  logger.info('✌️ Express loaded');

};
