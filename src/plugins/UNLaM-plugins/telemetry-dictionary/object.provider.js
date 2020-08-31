import { getDictionary } from './plugin.js';

export class ObjectProvider {
  constructor(openmct, namespace, key, url) {
    this._openmct = openmct;
    this._namespace = namespace;
    this._key = key;
    this._url = url;
  }

  addProvider() {
    this._openmct.objects.addProvider(
      this._namespace,
      getObjectProvider(this._namespace, this._key, this._url)
    );
  }

  addRoot() {
    this._openmct.objects.addRoot({
      namespace: this._namespace,
      key: this._key
    });
  }
}

function getObjectProvider(namespace, key, url) {
  return {
    get: function(identifier) {
      return getMetadata(identifier, namespace, key, url);
    }
  };
}

function getMetadata(identifier, namespace, key, url) {
  return getDictionary(url).then(dictionary =>
    defineMetadata(identifier, namespace, key, dictionary)
  );
}

function defineMetadata(identifier, namespace, key, dictionary) {
  if (identifier.key === key) {
    return {
      identifier: identifier,
      name: dictionary.name,
      type: 'satellite',
      location: 'ROOT'
    };
  } else {
    const measurement = dictionary.measurements.filter(m => {
      return m.key === identifier.key;
    })[0];
    return {
      identifier: identifier,
      name: measurement.name,
      type: 'sat.telemetry',
      telemetry: {
        values: measurement.values
      },
      location: `${namespace}:${key}`
    };
  }
}
