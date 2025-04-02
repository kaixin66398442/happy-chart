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
                top: 50,
                left: 250,
                zIndex: 1,
                props: {
                    text: 'item1',
                    color: 'red',
                    size: '14px'
                }
            }, {
                id: 'item2',
                to: ['item4', 'item5'],
                key: 'rect',
                top: 150,
                left: 150,
                zIndex: 1,
                props: {
                    text: 'item2',
                    color: 'red',
                    size: '14px'
                }
            }, {
                id: 'item3',
                to: ['item5'],
                key: 'rect',
                top: 150,
                left: 350,
                zIndex: 1,
                props: {
                    text: 'item3',
                    color: 'red',
                    size: '14px'
                }
            }, {
                id: 'item4',
                to: [],
                key: 'rect',
                top: 250,
                left: 50,
                zIndex: 1,
                props: {
                    text: 'item4',
                    color: 'red',
                    size: '14px'
                }
            }, {
                id: 'item5',
                to: [],
                key: 'rect',
                top: 250,
                left: 450,
                zIndex: 1,
                props: {
                    text: 'item5',
                    color: 'red',
                    size: '14px'
                }
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