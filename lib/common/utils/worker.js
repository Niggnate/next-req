"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInterceptors = exports.methods = void 0;
const methods = [
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'options',
    'head',
    'connect',
    'trace'
];
exports.methods = methods;
const addInterceptors = () => {
    const interceptor = {
        list: [],
        use: function (fulfilled, rejected) {
            const id = this.list.length;
            this.list.push({
                fulfilled,
                rejected
            });
            return id;
        },
        eject: (idx) => {
            if (interceptor.list[idx]) {
                // @ts-ignore
                interceptor.list[idx] = null;
            }
        }
    };
    return interceptor;
};
exports.addInterceptors = addInterceptors;
