import * as http from "../http-server/service.js";
import { CompositionProvider } from './composition.provider.js';
import { ObjectProvider } from './object.provider.js';
import { ObjectView } from './object-view.js';

export default function TelemetryDictionaryPlugin(name, key, url) {
  return function install(openmct) {
		const namespace = name + '.telemetry';
    const objects = new ObjectProvider(openmct, namespace, key, url);
    const composition = new CompositionProvider(openmct, namespace, url);


    objects.addRoot();
    objects.addProvider();
    composition.addProvider();
		ObjectView(openmct);
  };
}

export function getDictionary(url) {
  return http.httpGet(url).then(data => data.data);
}
