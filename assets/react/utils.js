import {message} from "antd";

const API_BASE_URL = '/api/'
const AUTH_BASE_URL = '/auth/'

export async function apiRequest(url, payload){
    try {
        const response = await fetch(API_BASE_URL + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (err) {
        message.error('Errore nella ricezione dei dati');
    }
}

export async function authRequest(url, payload){
    try {
        const response = await fetch(AUTH_BASE_URL + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        const data = await response.json()
        if (response.ok) {
            message.success(data.message)
            window.location.href = data.redirect
        } else {
            message.error(data.error)
        }
    } catch (err) {
        message.error('Errore di connessione al server')
    }
}

export function updateRootEdit(component, idToUpdate, updatedFields) {
    if (component.id === idToUpdate) return { ...component, ...updatedFields };
    if (component.childrenComponents && component.childrenComponents.length > 0) {
        component.childrenComponents = component.childrenComponents
            .map(child => updateRootEdit(child, idToUpdate, updatedFields))
            .filter(child => child !== null);
    }
    return component;
}

export function updateRootCreate(component, parentId, newComponent) {
    if (component.id === parentId) return { ...component, childrenComponents: [...component.childrenComponents, newComponent] };
    if (component.childrenComponents && component.childrenComponents.length > 0) {
        component.childrenComponents = component.childrenComponents
            .map(child => updateRootCreate(child, parentId, newComponent))
            .filter(child => child !== null);
    }
    return component;
}

export function findParentComponent(component, childId) {
    if (!component?.childrenComponents) return null;
    for (const child of component.childrenComponents) {
        if (child.id === childId) return component;
        const found = findParentComponent(child, childId);
        if (found) return found;
    }
    return null;
}

export function getDescendantFunctionalities(component) {
    if (!component.childrenComponents || component.childrenComponents.length === 0) {
        return [];
    }
    return component.childrenComponents.flatMap(child => [
        ...(child.functionalities || []),
        ...getDescendantFunctionalities(child)
    ]);
}

export function getAllFunctionalities(component) {
    const ownFuncs = component.functionalities || [];
    if (!component.childrenComponents || component.childrenComponents.length === 0) {
        return ownFuncs;
    }
    const childFuncs = component.childrenComponents.flatMap(child => getAllFunctionalities(child));
    return [...ownFuncs, ...childFuncs];
}
