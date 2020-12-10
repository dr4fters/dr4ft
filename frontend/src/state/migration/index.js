const readAndDeleteFromLocalStorage = (key, defaultValue) => {
    const  val = localStorage[key];
    if (!val) {
        return defaultValue;
    }

    try {
        return JSON.parse(val);
    } catch(e) {
        return defaultValue;
    } finally {
        delete localStorage[key];
    }
};

export default function migrateState(initialState, migratedState) {
    const ret = {};
    if (!migratedState) {
        migratedState = {};
    }
    for (const property in initialState) {
        ret[property] = readAndDeleteFromLocalStorage(
                property, 
                migratedState[property] == undefined 
                    ? initialState[property]
                    : migratedState[property]
        );
    }

    return ret;
}