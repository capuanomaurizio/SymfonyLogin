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
        console.error(err);
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
