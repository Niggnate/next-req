<h1 align="center">Welcome to Next Req </h1>
<p>
    <a href="https://www.npmjs.com/package/next-req" target="_blank">
        <img alt="Version" src="https://img.shields.io/npm/v/next-req.svg">
    </a>
    <img alt="Version" src="https://img.shields.io/badge/npm-%3E%3D5.5.0-blue.svg" />
    <img alt="Version" src="https://img.shields.io/badge/node-%3E%3D9.3.0-blue.svg" />
    <a href="#" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    </a>
    <a href="https://twitter.com/niggnate" target="_blank">
        <img alt="Twitter: niggnate" src="https://img.shields.io/twitter/follow/niggnate.svg?style=social" />
    </a>
</p>

> HTTP Promise based client

## Prerequisites

- npm >= 5.5.0
- node >= 9.3.0

## Install

```shell
npm install next-req
```

## Features

- Make HTTP requests
- Promised based API
- Request and Response interceptors
- Transforms Response for JSON payload
- Abort requests[Cancel requests]
- Transforms Request and Response payload

## Usage

```javascript
import nextreq from 'next-req'

nextreq.get('www.yourapi.com').then(response => {
    const payload = response.payload

    // TODO - payload
}).catch(error => {
    // TODO - error
}).finally(() => {
    // will always run
})
```

Generating `GET` request with `PARAMS`
```javascript
import nextreq from 'next-req'

nextreq.get('www.yourapi.com/user?session=true').then(response => {
    const payload = response.payload

    // TODO - payload
}).catch(error => {
    // TODO - error
}).finally(() => {
    // will always run
})
```

Generating `GET` request with params of config
```javascript
import nextreq from 'next-req'

nextreq.get('www.yourapi.com/user', {
    params: {
        session: true
    }
}).then(response => {
    const payload = response.payload

    // TODO - payload
}).catch(error => {
    // TODO - error
}).finally(() => {
    // will always run
})
```

Generating `POST` request
```javascript
import nextreq from 'next-req'

nextreq.post('www.yourapi.com/user', {
    params: {
        setSession: true
    }
}).then(response => {
    const payload = response.payload

    // TODO - payload
}).catch(error => {
    // TODO - error
}).finally(() => {
    // will always run
})
```

Generating API request using `async/await` on function using `GET`
```javascript
import nextreq from 'next-req'

const getPayload = async () => {
    try {
        const request = await nextreq.get('www.yourapi.com/user?session=true')
        const payload = request.payload
        
        // TODO - with payload
    } catch (error) {
        // TODO - errors
    } finally {
        // will always run
    }
}
```

Generating API request using `async/await` on function using `POST`
```javascript
import nextreq from 'next-req'

const postPayload = async () => {
    try {
        const request = await nextreq.post('www.yourapi.com/user', {
            params: {
                setSession: true
            }
        })
        const payload = request.payload
        
        // TODO - with payload
    } catch (error) {
        // TODO - errors
    } finally {
        // will always run
    }
}
```

## Interceptors

Generating interceptors

```javascript
import nextreq from 'next-req'

// Add request interceptor
nextreq.interceptors.request.use(configs => {
    // TODO - with configs
    return configs
})

// Add response interceptor
nextreq.interceptors.response.use(
    response => {
        // TODO - with response
        return response
    },
    error => {
        // TODO - errors
        // Handle error
        return Promise.reject(error)
    }
)
```

## Error handling
```javascript
import nextreq from 'next-req'

nextreq.post('www.yourapi.com/user', {
    params: {
        setSession: false
    }
}).then(response => {
    // TODO - with response
}).catch (error => {
    // Evaluate error response to proceed
    
    if (error.response) {
        // Get error payload
        const payload = error.response.payload
        
        // Get error status
        const status = error.response.status
        
        // Get headers
        const headers = error.response.headers
        
        // TODO - errors
    } else {
        // An error occured in request
        // Get message
        const message = error.message
    }
    
    // Get configs
    const configs = error.config
})
```

## Author

👤 **Prince Khanyile**

* Twitter: [@Lwazi_Khanyile](https://twitter.com/lwazi_khanyile)
* LinkedIn: [@prince-khanyile-8301a2189](https://www.linkedin.com/in/prince-khanyile-8301a2189/)

## License
MIT
