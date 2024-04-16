// 快照存储方案实现撤销重做

// 引入仓库
import useBlockStore from "@/store/modules/block";
const blockStore = useBlockStore()
// console.log(blockStore.blockList)
// 引入uuid函数
import getUUID from '@/utils/getUUID'
import deepcopy from 'deepcopy'


let snapshotList = []
let currentIndex = -1

// 保存快照
export function pushRecord() {
    snapshotList[++currentIndex] = deepcopy(blockStore.blockList);
    // console.log(snapshotList)
    // 如果要保存快照的时候，指针不在快照列表的最后一位，此时删除 currentIndex 后面的所有快照
    if (currentIndex < snapshotList.length - 1) {
        snapshotList = snapshotList.slice(0, currentIndex + 1);
    }
}

// 撤销操作
export function undo() {
    if (currentIndex < 0) {
        alert('当前无可撤销记录！')
    } else {
        const item = snapshotList[--currentIndex] || [];
        blockStore.blockList = deepcopy(item);
        // 修改画布容器的key值强制刷新
        blockStore.editorContainerKey = getUUID()
    }
}

// 重做操作
export function redo() {
    if (currentIndex >= snapshotList.length - 1) {
        alert('当前无可重做记录！')
    } else {
        const item = snapshotList[++currentIndex] || [];
        blockStore.blockList = deepcopy(item);
        // 修改画布容器的key值强制刷新
        blockStore.editorContainerKey = getUUID()
    }
}






