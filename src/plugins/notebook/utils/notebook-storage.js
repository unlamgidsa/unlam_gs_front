const NOTEBOOK_LOCAL_STORAGE = 'notebook-storage';
let currentNotebookObject = null;
let unlisten = null;

function defaultNotebookObjectChanged(newDomainObject) {
    if (newDomainObject.location !== null) {
        currentNotebookObject = newDomainObject;
        const notebookStorage = getDefaultNotebook();
        notebookStorage.domainObject = newDomainObject;
        saveDefaultNotebook(notebookStorage);

        return;
    }

    if (unlisten) {
        unlisten();
        unlisten = null;
    }

    clearDefaultNotebook();
}

function observeDefaultNotebookObject(openmct, notebookStorage) {
    const domainObject = notebookStorage.domainObject;
    if (currentNotebookObject
            && currentNotebookObject.identifier.key === domainObject.identifier.key) {
        return;
    }

    if (unlisten) {
        unlisten();
        unlisten = null;
    }

    unlisten = openmct.objects.observe(notebookStorage.domainObject, '*', defaultNotebookObjectChanged);
}

function saveDefaultNotebook(notebookStorage) {
    window.localStorage.setItem(NOTEBOOK_LOCAL_STORAGE, JSON.stringify(notebookStorage));
}

export function clearDefaultNotebook() {
    currentNotebookObject = null;
    window.localStorage.setItem(NOTEBOOK_LOCAL_STORAGE, null);
}

export function getDefaultNotebook() {
    const notebookStorage = window.localStorage.getItem(NOTEBOOK_LOCAL_STORAGE);

    return JSON.parse(notebookStorage);
}

export async function getDefaultNotebookLink(openmct, domainObject = null) {
    if (!domainObject) {
        return null;
    }

    const path = await openmct.objects.getOriginalPath(domainObject.identifier)
        .then(objectPath => objectPath
            .map(o => o && openmct.objects.makeKeyString(o.identifier))
            .reverse()
            .join('/')
        );
    const { page, section } = getDefaultNotebook();

    return `#/browse/${path}?sectionId=${section.id}&pageId=${page.id}`;
}

export function setDefaultNotebook(openmct, notebookStorage) {
    observeDefaultNotebookObject(openmct, notebookStorage);
    saveDefaultNotebook(notebookStorage);
}

export function setDefaultNotebookSection(section) {
    const notebookStorage = getDefaultNotebook();
    notebookStorage.section = section;
    saveDefaultNotebook(notebookStorage);
}

export function setDefaultNotebookPage(page) {
    const notebookStorage = getDefaultNotebook();
    notebookStorage.page = page;
    saveDefaultNotebook(notebookStorage);
}
