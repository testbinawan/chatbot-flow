import { encrypt, decrypt } from '@/lib/encryption';
import { AuthData } from '@/types/auth';
import { isEmpty } from '@/lib/value';

export default async function fetchJson({ method = 'get', endpoint = '', body = {}, token = false }) {
    method = method?.toString().toLowerCase();

    if (!['get', 'post', 'put', 'delete'].includes(method)) {
        method = 'get';
    }

    endpoint = endpoint.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

    let headers: { [key:string]: any } = {'Content-Type': 'application/json'};

    const storedUrl = sessionStorage.getItem('url');
    const storedAuth = sessionStorage.getItem('auth');

    if (storedAuth) {
        const decryptedAuth = await decrypt(storedAuth);

        if (decryptedAuth) {
            try {
                const parsedAuth: AuthData = JSON.parse(decryptedAuth);
                headers['Authorization'] = `Bearer ${parsedAuth.token}`;
            } catch {
                // do nothing
            }
        }
    }

    let options: any = {
        method,
        headers
    };

    if (!isEmpty(body)) {
        options.body = JSON.stringify(body)
    }

    const res = await fetch(`${storedUrl}/${endpoint}`, options);
    const data = await res.json();

    if (res.status === 401 && !token) {
        token = true;
        await refreshToken();
        await fetchJson({ method, endpoint, body, token });
    }

    return data;
}

async function refreshToken () {
    let headers: { [key:string]: any } = {'Content-Type': 'application/json'};

    const storedUrl = sessionStorage.getItem('url');
    const storedAuth = sessionStorage.getItem('auth');

    if (storedAuth) {
        const decryptedAuth = await decrypt(storedAuth);

        if (decryptedAuth) {
            try {
                const parsedAuth: AuthData = JSON.parse(decryptedAuth);
                headers['Authorization'] = `Bearer ${parsedAuth.refresh_token}`;
            } catch {
                // do nothing
            }
        }
    }

    const options: any = {
        method: 'get',
        headers
    };

    try {
        const res = await fetch(`${storedUrl}/token/refresh`, options);
        const data = await res.json();

        if (res.ok) {
            const stringedAuth = JSON.stringify(data.data);
            const encryptedAuth = await encrypt(stringedAuth);

            if (encryptedAuth !== null) {
                sessionStorage.setItem('auth', encryptedAuth);
            }
        }

        return data;
    } catch (err) {
        return {
            request_time: new Date().getTime(),
            response_code: 503,
            success: false,
            message: err instanceof Error ? err.message : 'Service unavailable'
        };
    }
}
