import { IConfig, INextreqResponsePayload, IRequestPayload } from "./interfaces";
import { INextreqRequestPayloadErrorInterceptor, INextreqRequestPayloadInterceptor, INextreqResponsePayloadErrorInterceptor, INextreqResponsePayloadInterceptor, Payload } from "../common/types";
declare function builder<T = any>(url: string | IRequestPayload, config?: IRequestPayload): Promise<INextreqResponsePayload<T>>;
declare namespace builder {
    export var defaults: {
        url: string;
        method: string;
        timeout: number;
        validateStatus: (status: number) => boolean;
    };
    export var create: (config: IRequestPayload) => typeof builder;
    export var iRequest: <T = any>(this: typeof builder, config: IRequestPayload) => Promise<INextreqResponsePayload<T>>;
    export var request: <T = any>(this: typeof builder, config: IRequestPayload) => Promise<INextreqResponsePayload<T>>;
    export var get: <T = any>(url: string, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var post: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var put: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    var _a: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var patch: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var options: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var head: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var connect: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var trace: <T = any>(url: string, payload?: Payload | undefined, config?: IConfig | undefined) => Promise<INextreqResponsePayload<T>>;
    export var interceptors: {
        request: import("./interfaces").INextreqPayloadInterceptor<INextreqRequestPayloadInterceptor, INextreqRequestPayloadErrorInterceptor>;
        response: import("./interfaces").INextreqPayloadInterceptor<INextreqResponsePayloadInterceptor, INextreqResponsePayloadErrorInterceptor>;
    };
    export { _a as delete };
}
export { builder };
