import { TelemetryProvider } from './telemetry.provider';

export default function HistoricalTelemetry(urlBase) {
  return function install(openmct) {
    var provider = new TelemetryProvider(openmct, urlBase);
    provider.addProvider();
  };
}
