import {INextreqPayloadInterceptor} from "../../core/interfaces";

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
]

const addInterceptors = <FullFill = unknown, Rejected = unknown> () => {
    const interceptor: INextreqPayloadInterceptor<FullFill, Rejected> = {
        list: [],
        use: function(fulfilled, rejected) {
            const id = this.list.length

            this.list.push({
                fulfilled,
                rejected
            })

            return id
        },
        eject: (idx) => {
            if (interceptor.list[idx]) {
                // @ts-ignore
                interceptor.list[idx] = null
            }
        }
    }

    return interceptor
}

export {
    methods,
    addInterceptors
}