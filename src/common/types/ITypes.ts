import {IHeaderPayload, INextreqError, INextreqResponsePayload, IPayload, IRequestPayload} from "../../core/interfaces";

export type ResponsePayloadResponse =
    'text' |
    'blob' |
    'stream' |
    'json' |
    'arraybuffer';


// Generate Payload [Request, Response]
export type Payload = string | IPayload | FormData
export type GenerateRequestPayload = (payload: Payload, headers?: IHeaderPayload) => Payload
export type GenerateResponsePayload = (payload: Payload) => Payload

// Interceptor [Request]
export type INextreqRequestPayloadInterceptor = (config: IRequestPayload) => IRequestPayload | Promise<IRequestPayload>
export type INextreqRequestPayloadErrorInterceptor = (error: INextreqError) => Promise<never>

// Interceptor [Response]
export type INextreqResponsePayloadInterceptor <T = any> = (response: INextreqResponsePayload<T>) => INextreqResponsePayload<T>
export type INextreqResponsePayloadErrorInterceptor = (error: INextreqError) => Promise<never>