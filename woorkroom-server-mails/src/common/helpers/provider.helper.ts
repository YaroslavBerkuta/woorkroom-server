import { ClassProvider, FactoryProvider, InjectionToken, ValueProvider } from '@nestjs/common';

export const provideService = (
  name: InjectionToken,
  service: any,
): ClassProvider => {
  return {
    provide: name,
    useClass: service,
  };
};

export const provideValues = (
  name: InjectionToken,
  values: any,
): ValueProvider => {
  return {
    provide: name,
    useValue: values,
  };
};

export const provideFactory = (
  name: InjectionToken,
  factory: () => any,
): FactoryProvider => {
  return {
    provide: name,
    useFactory: factory,
  };
};