import Vue from 'vue';
import DataManager from './dataManager';

export const DataManager = DataManager;

export const getStateFromManagers = (managers) => {
    let state = {};
    for(const manager of managers)
        state[manager.name] = manager;
    return state;
}

export const getGettersFromManagers = (managers) => {
    let getters = {};
    for(const manager of managers) 
        getters[manager.name] = (state) => state[manager.name];
    return getters;
}

export const getMutationsFromManagers = (managers) => {
    let mutations = {};
    for(const manager of managers) 
        mutations[manager.name] = (state, payload) => Vue.set(state, manager.name, payload);
    return mutations;
}

export const getActionsFromManagers = (managers) => {

}