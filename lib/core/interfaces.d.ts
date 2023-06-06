import { GenerateRequestPayload, GenerateResponsePayload, INextreqRequestPayloadErrorInterceptor, INextreqRequestPayloadInterceptor, INextreqResponsePayloadErrorInterceptor, INextreqResponsePayloadInterceptor, MethodTypes, Payload, ResponsePayloadResponse } from "../common/types";
export interface IHeaderPayload {
    [key: string]: any;
}
export interface IPayload {
    [key: string]: any;
}
interface ISerializationConfigs {
    validateStatus?: Function;
    paramsSerializer?: Function;
    generateRequest?: Array<GenerateRequestPayload>;
    generateResponse?: Array<GenerateResponsePayload>;
    redirect?: RequestRedirect;
    responsePayloadType?: ResponsePayloadResponse;
}
export interface IConfig extends ISerializationConfigs {
    headers?: IHeaderPayload;
    params?: {
        [key: string]: string | number | boolean;
    };
    withCredentials?: boolean;
    timeout?: number;
    authenticate?: {
        username: string;
        password: string;
    };
}
export interface IRequestPayload extends IConfig {
    url?: string;
    baseURL?: string;
    method?: MethodTypes;
    payload?: Payload;
}
export interface INextreqResponsePayload<T = any> {
    status: number;
    statusText: string;
    payload: T;
    headers: Headers;
    config: IRequestPayload;
}
export interface INextreqError<T = unknown> {
    response: {
        status: number;
        statusText: string;
        payload: T;
        headers: Headers;
    };
    config: IRequestPayload;
}
export interface INextreqPayloadInterceptor<FullFill = any, Rejected = any> {
    list: Array<{
        fulfilled?: FullFill | null;
        rejected?: Rejected | null;
    }>;
    use: (fulfilled?: FullFill | null | undefined, rejected?: Rejected | null | undefined) => number;
    eject: (idx: number) => void;
}
export interface INextreqPayloadInterceptors {
    request: INextreqPayloadInterceptor<INextreqRequestPayloadInterceptor, INextreqRequestPayloadErrorInterceptor>;
    response: INextreqPayloadInterceptor<INextreqResponsePayloadInterceptor, INextreqResponsePayloadErrorInterceptor>;
}
export {};
