import { IHeaderPayload, INextreqError, INextreqResponsePayload, IPayload, IRequestPayload } from "../../core/interfaces";
export type ResponsePayloadResponse = 'text' | 'blob' | 'stream' | 'json' | 'arraybuffer';
export type Payload = string | IPayload | FormData;
export type GenerateRequestPayload = (payload: Payload, headers?: IHeaderPayload) => Payload;
export type GenerateResponsePayload = (payload: Payload) => Payload;
export type INextreqRequestPayloadInterceptor = (config: IRequestPayload) => IRequestPayload | Promise<IRequestPayload>;
export type INextreqRequestPayloadErrorInterceptor = (error: INextreqError) => Promise<never>;
export type INextreqResponsePayloadInterceptor<T = any> = (response: INextreqResponsePayload<T>) => INextreqResponsePayload<T>;
export type INextreqResponsePayloadErrorInterceptor = (error: INextreqError) => Promise<never>;
