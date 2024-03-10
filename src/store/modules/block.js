// block小仓库，存放与物料block有关的信息
import { defineStore } from "pinia";

const useBlockStore = defineStore('block', {
    state: () => {
        return {
            blockList: [{
                key: 'text',
                describe: '文本',
                top: 100,
                left: 100,
                zIndex: 1
            }, {
                key: 'text',
                describe: '文本',
                top: 200,
                left: 200,
                zIndex: 1
            }, {
                key: 'text',
                describe: '文本',
                top: 300,
                left: 300,
                zIndex: 1
            }],
            // 全部组件列表
            componentList: [],
            // 组件映射表
            componentMap: {}
        }
    }
})

// 导出
export default useBlockStore