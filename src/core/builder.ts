import {
    IConfig,
    INextreqError,
    INextreqResponsePayload,
    IRequestPayload
} from "./interfaces";

import {
    INextreqRequestPayloadErrorInterceptor,
    INextreqRequestPayloadInterceptor,
    INextreqResponsePayloadErrorInterceptor,
    INextreqResponsePayloadInterceptor,
    Payload
} from "../common/types";

import {
    addInterceptors,
    methods
} from "../common/utils/worker";

import transppend from "path-transppend";

const MIN_STATUS = 200
const MAX_STATUS = 300
const MAX_STATUS_EXCEEDS = 303

function builder <T = any> (
    url: string | IRequestPayload,
    config?: IRequestPayload
): Promise<INextreqResponsePayload<T>> {
    if (typeof url === 'string') {
        return builder.request(Object.assign({}, builder.defaults, { url }, config))
    }

    return builder.request(Object.assign({}, builder.defaults, url))
}

builder.defaults = {
    url: '/',
    method: 'get',
    timeout: 0,
    validateStatus: (status: number) => {
        return status >= MIN_STATUS && status < MAX_STATUS
    }
}

// Create builder prototypes methods
builder.create = (config: IRequestPayload) => {

    // Bind and set defaults from previous
    const instance = builder.bind({})
    instance.defaults = Object.assign({}, builder.defaults, config)

    // Create new instances of request() function
    instance.iRequest = request

    instance.get = (url: string, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'get' }),
        );
    }

    instance.post = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'post', payload }),
        );
    }

    instance.put = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'put', payload }),
        );
    }

    instance.delete = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'delete', payload }),
        );
    }

    instance.patch = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'patch', payload }),
        );
    }

    instance.options = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'options', payload }),
        )
    }

    instance.head = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'head', payload }),
        )
    }

    instance.connect = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'connect', payload }),
        )
    }


    instance.trace = (url: string, payload?: Payload, config?: IConfig) => {
        return instance.request(
            Object.assign({}, { url }, config, { method: 'trace', payload }),
        )
    }

    instance.interceptors = {
        request: addInterceptors<INextreqRequestPayloadInterceptor, INextreqRequestPayloadErrorInterceptor>(),
        response: addInterceptors<INextreqResponsePayloadInterceptor, INextreqResponsePayloadErrorInterceptor>()
    }

    instance.interceptors.request.list = []
    instance.interceptors.response.list = []

    return instance
}

// Build request
async function request <T = any> (
    this: typeof builder,
    config: IRequestPayload
): Promise<INextreqResponsePayload<T>> {
    if (this.interceptors.request.list.length > 0) {
        for (const interceptor of this.interceptors.request.list) {
            if (interceptor) {
                const { fulfilled } = interceptor
                if (fulfilled && config) {
                    config = await fulfilled(config)
                }
            }
        }
    }

    let {
        url = '/',
        baseURL,
        method,
        headers,
        params = {},
        payload,
        timeout,
        withCredentials,
        authenticate,
        validateStatus,
        paramsSerializer,
        generateRequest,
        generateResponse,
        redirect,
        responsePayloadType = 'json'
    } = config

    // url and base url
    if (baseURL) {
        url = transppend(baseURL, url)
    }

    ////////////////////////////// [TODO]----------

    if (method) {
        if (methods.indexOf(method.toLowerCase().trim()) === -1) {
            throw new Error(`Method ${method} is not supported`)
        } else {
            method = method.toLowerCase().trim()
        }
    } else {
        method = 'get'
    }

    // Params
    let _params = ''
    if (params) {
        if (paramsSerializer) {
            _params = paramsSerializer(params);
        } else {
            _params = Object.keys(params)
                .map((key) => {
                    return (
                        encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                    );
                })
                .join('&');
        }
    }

    // Add credentials to header
    if (withCredentials) {
        if (authenticate?.username && authenticate?.password) {
            if (!headers) {
                headers = {};
            }

            headers['Authorization'] = 'Basic ' +
                btoa(unescape(encodeURIComponent(`${authenticate.username}:${authenticate.password}`)));
        }
    }

    // Create fetch Request Config
    const fetchRequestObject: RequestInit = {};

    // Add method to Request Config
    if (method !== 'get') {
        fetchRequestObject.method = method.toUpperCase();
    }

    // Add params to Request Config Url
    if (_params) {
        url = transppend(url, `?${_params}`)
    }

    // Add body to Request Config
    if (payload && method !== 'get') {
        // transformRequest
        if (
            generateRequest &&
            Array.isArray(generateRequest) &&
            generateRequest.length > 0
        ) {
            for (let i = 0; i < (generateRequest || []).length; i++) {
                if (generateRequest && generateRequest[i]) {
                    payload = generateRequest[i](payload, headers);
                }
            }
        }

        if (
            payload instanceof FormData ||
            payload instanceof URLSearchParams
        ) {
            fetchRequestObject.body = payload;
        } else {
            try {
                fetchRequestObject.body = JSON.stringify(payload);
                if (!headers) {
                    headers = {};
                }

                headers['Accept'] = 'application/json';
                headers['Content-Type'] = 'application/json';
            } catch (ex) {}
        }
    }

    // Add headers to Request Config
    if (headers) {
        const _headers: Headers = new Headers();
        Object.keys(headers).forEach((header) => {
            if (headers && headers[header]) {
                _headers.set(header, headers[header]);
            }
        });
        fetchRequestObject.headers = _headers;
    }

    // Timeout
    const controller = new AbortController();
    fetchRequestObject.signal = controller.signal;

    let timeoutCounter: number = 0;

    if ((timeout || 0) > 0) {
        timeoutCounter = setTimeout(() => {
            timeoutCounter = 0;
            controller.abort();
        }, timeout);
    }

    if (redirect) {
        fetchRequestObject.redirect = redirect;
    }

    // Start request
    return fetch(url, fetchRequestObject).then(async (x) => {
        // Clear timeout
        if (timeoutCounter) {
            clearTimeout(timeoutCounter);
        }

        const _status: number = x.status;
        const _statusText: string = x.statusText;

        // Data
        let _payload: any = null;

        // Try to auto parse data
        try {
            const response = x.clone();

            if (responsePayloadType === 'json') {
                _payload = await response.json();
            } else if (responsePayloadType === 'text') {
                _payload = await response.text();
            } else if (responsePayloadType === 'arraybuffer') {
                _payload = await response.arrayBuffer();
            } else if (responsePayloadType === 'blob') {
                _payload = await response.blob();
            } else if (responsePayloadType === 'stream') {
                _payload = (await response.blob()).stream();
            } else {
                _payload = await response.text();
            }
        } catch (ex) {
            _payload = await x.clone().text();
        }

        // transformResponse
        if (generateResponse) {
            if (
                generateResponse &&
                Array.isArray(generateResponse) &&
                generateResponse.length > 0
            ) {
                for (var i = 0; i < (generateResponse || []).length; i++) {
                    if (generateResponse && generateResponse[i]) {
                        _payload = generateResponse[i](_payload);
                    }
                }
            }
        }

        const _headers: Headers = x.headers;
        const _config: IRequestPayload = {
            url,
            baseURL,
            method,
            headers,
            params,
            payload,
            timeout,
            withCredentials,
            authenticate,
            paramsSerializer,
            redirect,
            responsePayloadType,
        };

        // Validate the status code
        let isValidStatus = true;

        if (validateStatus) {
            isValidStatus = validateStatus(_status);
        } else {
            isValidStatus = _status >= MIN_STATUS && _status <= MAX_STATUS_EXCEEDS;
        }

        let response: INextreqResponsePayload<T> | null = null;
        let error: INextreqError<T> | null = null;

        if (isValidStatus) {
            response = {
                status: _status,
                statusText: _statusText,
                payload: _payload,
                headers: _headers,
                config: _config,
            };
        } else {
            error = {
                response: {
                    status: _status,
                    statusText: _statusText,
                    payload: _payload,
                    headers: _headers,
                },
                config: _config,
            };
        }

        if (this.interceptors.response.list.length > 0) {
            for (const interceptor of this.interceptors.response.list) {
                if (interceptor) {
                    const { fulfilled, rejected } = interceptor;
                    if (fulfilled && response) {
                        response = (await fulfilled(response)) as INextreqResponsePayload<T>;
                    }
                    if (rejected && error) {
                        error = await rejected(error);
                    }
                }
            }
        }

        if (error) {
            return Promise.reject(error as INextreqError<T>);
        }

        return Promise.resolve(response as INextreqResponsePayload<T>);
    });
}

builder.iRequest = request
builder.request = request

// Create static request functions
builder.get = <T = any>(url: string, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'get' }),
    );
};

builder.post = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'post', payload }),
    );
};

builder.put = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'put', payload }),
    );
};

builder.delete = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'delete', payload }),
    );
};

builder.patch = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'patch', payload }),
    );
}

builder.options = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'options', payload }),
    );
};

builder.head = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'head', payload }),
    );
};

builder.connect = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'connect', payload }),
    );
};

builder.trace = <T = any>(url: string, payload?: Payload, config?: IConfig) => {
    return builder.request<T>(
        Object.assign({}, { url }, config, { method: 'trace', payload }),
    );
};

// Create interceptors
builder.interceptors = {
    request: addInterceptors<INextreqRequestPayloadInterceptor, INextreqRequestPayloadErrorInterceptor>(),
    response: addInterceptors<INextreqResponsePayloadInterceptor, INextreqResponsePayloadErrorInterceptor>()
}

export { builder }