import { INextreqPayloadInterceptor } from "../../core/interfaces";
declare const methods: string[];
declare const addInterceptors: <FullFill = unknown, Rejected = unknown>() => INextreqPayloadInterceptor<FullFill, Rejected>;
export { methods, addInterceptors };
