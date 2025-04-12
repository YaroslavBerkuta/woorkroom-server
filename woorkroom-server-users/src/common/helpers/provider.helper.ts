import { ClassProvider, InjectionToken } from '@nestjs/common';

export const provideService = (
  name: InjectionToken,
  service: any,
): ClassProvider => {
  return {
    provide: name,
    useClass: service,
  };
};
