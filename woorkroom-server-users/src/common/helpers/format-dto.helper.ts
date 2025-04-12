import _ from 'lodash';

export const cleanedDto = <T>(dto: Partial<T>): Partial<T> => {
  return _.omitBy(
    dto,
    (value) =>
      _.isNil(value) ||
      (_.isString(value) && _.isEmpty(value)) ||
      (_.isArray(value) && _.isEmpty(value)) ||
      (_.isObject(value) && _.isEmpty(value)),
  ) as Partial<T>;
};
