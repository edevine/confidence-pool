/**
 * Listens to an event once
 */
export function listenOnce(host: EventTarget, type: string, handler: (event: Event) => void) {
    function listener(event: Event) {
        host.removeEventListener(type, listener);
        handler(event);
    }
    host.addEventListener(type, listener);
}

/**
 * Send a hyperlink via XHR
 */
export function requestJson<T>(
    url: string,
    onload: (response: T) => void,
    onfail?: () => void,
) {
    const request = new XMLHttpRequest();
    listenOnce(request, 'load', event => {
        if (request.status === 200) {
            onload(request.response as T);
        }
        else {
            onfail && onfail();
        }
    });
    request.responseType = "json";
    request.open('get', url);
    request.setRequestHeader('Accept', 'application/json');
    request.send();
}

/**
 * Submits a form via XHR and invokes the callback with the payload
 */
export function submitForm(
    form: HTMLFormElement,
    onload: (event: Event) => void
) {
    const request = new XMLHttpRequest();
    listenOnce(request, 'load', onload);
    request.responseType = "json";
    request.open(form.method, form.action);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader('Accept', 'application/json');
    request.send(encodeForm(form));
}

/**
 * Process form input elements into a application/x-www-form-urlencoded string
 */
function encodeForm(form: HTMLFormElement) {
    const fields = <NodeListOf<HTMLInputElement>>form.querySelectorAll('input[name]');
    let data = '';
    for (let i = 0; i < fields.length; i++) {
        data += (i > 0 ? '&' : '')
            + encodeURIComponent(fields[i].name).replace(/%20/g, '+')
            + '=' + encodeURIComponent(fields[i].value).replace(/%20/g, '+');
    }
    return data;
}
