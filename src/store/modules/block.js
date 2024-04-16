// block小仓库，存放与物料block有关的信息
import { defineStore } from "pinia";
// 引入uuid函数
import getUUID from '@/utils/getUUID'

const useBlockStore = defineStore('block', {
    state: () => {
        return {
            // 画布组件列表
            blockList: [{
                id: 'item1',
                to: ['item2', 'item3'],
                key: 'rect',
                top: 100,
                left: 500,
                zIndex: 1,
            }, {
                id: 'item2',
                to: ['item4', 'item5'],
                key: 'rect',
                top: 300,
                left: 300,
                zIndex: 1,
            }, {
                id: 'item3',
                to: ['item5'],
                key: 'rect',
                top: 300,
                left: 700,
                zIndex: 1,
            }, {
                id: 'item4',
                to: [],
                key: 'rect',
                top: 500,
                left: 100,
                zIndex: 1,
            }, {
                id: 'item5',
                to: [],
                key: 'rect',
                top: 500,
                left: 900,
                zIndex: 1,
            },],
            // 记录画布容器的key值
            editorContainerKey: getUUID(),
            // 记录Block组件的key值
            blockKey: getUUID(),
            // 选中的未选中组件信息
            focusData: {},
            // 最后选中的组件
            lastSelectBlock: null,
        }
    }
})

// 导出
export default useBlockStore