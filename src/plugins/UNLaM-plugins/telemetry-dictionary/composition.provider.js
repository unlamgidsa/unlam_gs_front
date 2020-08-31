import { getDictionary } from './plugin.js';

export class CompositionProvider {
  constructor(openmct, namespace, url) {
    this._openmct = openmct;
    this._namespace = namespace;
    this._url = url;
  }

  addProvider() {
    this._openmct.composition.addProvider(getCompositionProvider(this._namespace, this._url));
  }
}

export function getCompositionProvider(namespace, url) {
  return {
    appliesTo: function(domainObject) {
      return compositionAppliesTo(domainObject, namespace);
    },
    load: function(domainObject) {
      return loadMetadata(domainObject, url);
    }
  };
}

function compositionAppliesTo(domainObject, namespace) {
  return domainObject.identifier.namespace === namespace && domainObject.type === 'satellite';
}

function loadMetadata(domainObject, url) {
  return getDictionary(url).then(dictionary => mapMetadata(dictionary, domainObject));
}

function mapMetadata(dictionary, domainObject) {
  return dictionary.measurements.map(m => {
    return {
      namespace: domainObject.identifier.namespace,
      key: m.key
    };
  });
}
