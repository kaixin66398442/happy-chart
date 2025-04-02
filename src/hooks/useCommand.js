// 命令相关的组合式函数
// 引入全局事件总线
import emitter from "@/utils/eventBus"
import { onUnmounted, watch } from "vue"
import useBlockStore from "@/store/modules/block"
import deepcopy from "deepcopy"
import getUUID from '@/utils/getUUID.js'
const blockStore = useBlockStore()  

export default function useCommand() {
    const state = {
        // 存放各个命令的列表
        commandList: [],
        // 操作命令队列
        commandQueue: [],
        // 命令和执行函数的映射表
        commandMap: {},
        // 当前命令指针
        current: -1,
        // 销毁函数列表
        destroyList: []
    }

    // 注册命令的函数
    function register(command) {
        // 先将命令翻入命令列表
        state.commandList.push(command)
        // 命令和执行函数的映射
        state.commandMap[command.name] = (...args) => {
            const { forward, back } = command.execute(...args)
            forward()
            // 执行的命令如果不是撤销重做，要放入操作命令队列,是的话直接返回
            if (!command.isPushQueue) {
                return
            }
            // 能继续执行的说明都是非撤销重做命令
            // 此时current指针不指向队列的末尾，指针后面的内容操作需要被覆盖
            if (state.current < state.commandQueue.length - 1) {
                state.commandQueue = state.commandQueue.slice(0, state.current + 1)
            }
            // 保存命令的forward和back函数，用于撤销重做
            state.commandQueue.push({ forward, back })
            state.current++ // 指针跟着移动
        }
    }

    // 注册撤销命令
    register({
        name: 'undo',
        keyboard: 'ctrl+z',
        // 执行函数
        execute() {
            return {
                // 前进（执行撤销命令的时候会执行）
                forward() {
                    if (state.current === -1) {
                        // alert('无法撤销')
                        return
                    }
                    state.commandQueue[state.current].back()
                    state.current--
                }
            }
        }
    })

    // 注册重做命令
    register({
        name: 'redo',
        keyboard: 'ctrl+y',
        // 执行函数
        execute() {
            return {
                // 前进（执行重做命令的时候会执行）
                forward() {
                    if (state.current >= state.commandQueue.length - 1) {
                        // alert('无法重做')
                        return
                    }
                    state.commandQueue[state.current + 1].forward()
                    state.current++
                }
            }
        }
    })

    // 注册拖拽命令（isPushQueue代表需要放入命令操作队列）
    register({
        name: 'drag',
        isPushQueue: true,
        // 初始化函数，在这里往全局事件总线上去绑定开始命令和结束命令的事件
        init() {
            this.before = []
            // 全局事件总线绑定开始命令和结束命令的事件
            const startCommand = () => {
                // console.log('开始拖拽命令')
                // 记录命令开始前的数据
                this.before = deepcopy(blockStore.blockList)
            }
            const endCommand = () => {
                // console.log('结束拖拽命令')
                // 执行拖拽命令的执行函数
                state.commandMap.drag()
            }
            emitter.on('startCommand', startCommand)
            emitter.on('endCommand', endCommand)

            // 返回一个函数进行销毁绑定的事件
            return () => {
                emitter.off('startCommand')
                emitter.off('endCommand')
            }
        },
        // 执行函数
        execute() {
            // 保存前面就已经收集的拖拽前数据
            let before = this.before
            // 保存此时拖拽后的数据
            let after = blockStore.blockList
            return {
                // 前进
                forward() {
                    // 执行完拖拽命令，进行更新
                    // console.log(after, 'after')
                    blockStore.blockList = after
                    // console.log(blockStore.blockList)
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                },
                // 后退
                back() {
                    // 执行撤销时会执行
                    // console.log(before, 'before')
                    blockStore.blockList = before
                    // console.log(blockStore.blockList)
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                }
            }
        }
    });

    // 注册置顶命令
    register({
        name: 'placeTop',
        isPushQueue: true,
        // 执行函数
        execute() {
            // 拿到置顶前的数据
            let before = deepcopy(blockStore.blockList)
            // 保存执行置顶后的数据
            let after = (() => {
                const { focusBlocks, unfocusBlocks } = blockStore.focusData
                // 从未选中的组件中得到最大的zIndex
                let maxZIndex = unfocusBlocks.reduce((pre, block) => { return Math.max(pre, block.zIndex) }, -Infinity)
                focusBlocks.forEach(block => block.zIndex = maxZIndex + 1)
                return blockStore.blockList
            })()
            return {
                // 前进（对于所有选择的block进行置顶操作）
                forward() {
                    blockStore.blockList = after
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                },
                // 后退
                back() {
                    blockStore.blockList = before
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                }
            }
        }
    });

    // 注册置底命令
    register({
        name: 'placeBottom',
        isPushQueue: true,
        // 执行函数
        execute() {
            // 拿到置底前的数据
            let before = deepcopy(blockStore.blockList)
            // 保存执行置底后的数据
            let after = (() => {
                const { focusBlocks, unfocusBlocks } = blockStore.focusData
                // 从未选中的组件中得到最小的zIndex
                let minZIndex = unfocusBlocks.reduce((pre, block) => { return Math.min(pre, block.zIndex) }, Infinity) - 1
                // 如果最小的zIndex小于0，将最小的置为0，其余的往上升
                if (minZIndex < 0) {
                    const dur = Math.abs(minZIndex)
                    minZIndex = 0
                    unfocusBlocks.forEach(block => block.zIndex += dur)
                }
                focusBlocks.forEach(block => block.zIndex = minZIndex)
                return blockStore.blockList
            })()
            return {
                // 前进（对于所有选择的block进行置顶操作）
                forward() {
                    blockStore.blockList = after
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                },
                // 后退
                back() {
                    blockStore.blockList = before
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                }
            }
        }
    });

    // 注册删除命令
    register({
        name: 'delete',
        isPushQueue: true,
        keyboard: 'ctrl+Backspace',
        // 执行函数
        execute() {
            // 拿到删除前的数据
            let before = deepcopy(blockStore.blockList)
            // 保存执行删除后的数据
            let after = blockStore.focusData.unfocusBlocks
            return {
                // 前进（对于所有选择的block进行置顶操作）
                forward() {
                    blockStore.blockList = after
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                },
                // 后退
                back() {
                    blockStore.blockList = before
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                }
            }
        }
    });

    // 注册修改block的命令
    register({
        name: 'updateBlock',
        isPushQueue: true,
        // 执行函数
        execute(newBlcok, oldBlock) {
            // 拿到修改前的数据
            let before = deepcopy(blockStore.blockList)
            // 保存执行删除后的数据
            let after = (() => {
                let blocks = [...blockStore.blockList] // 拷贝一份用于新的block
                //在原来里面把老的找到
                const index = blockStore.blockList.indexOf(oldBlock)
                if (index > -1) {
                    blocks.splice(index, 1, newBlcok)
                }
                return blocks
            })()


            return {
                // 前进（对于所有选择的block进行置顶操作）
                forward() {
                    blockStore.blockList = after
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                },
                // 后退
                back() {
                    blockStore.blockList = before
                    // 强制刷新画布
                    blockStore.editorContainerKey = getUUID()
                }
            }
        }
    });

    // 键盘快捷键，返回初始化事件，执行初始化事件可以在window上挂载事件监听器，并返回监听器的销毁函数
    const keyboardEvent = (() => {
        const onkeydown = (e) => {
            const { ctrlKey, key } = e
            let keyString = []
            if (ctrlKey) keyString.push('ctrl')
            keyString.push(key)
            keyString = keyString.join('+')

            state.commandList.forEach(({ name, keyboard }) => {
                if (!keyboard) return // 没有键盘事件，例如'drag'
                if (keyboard === keyString) {
                    state.commandMap[name]()
                    e.preventDefault();
                }
            })
        }
        const init = () => { // 初始化事件
            window.addEventListener('keydown', onkeydown)
            return () => { // 销毁事件
                window.removeEventListener('keydown', onkeydown)
            }
        }
        return init
    })();

    // 立即执行函数
    ; (function () {
        // console.log(state.commandList)
        // 将命令列表的命令初始化
        state.commandList.forEach(command => {
            command.init && state.destroyList.push(command.init())
        })
        state.destroyList.push(keyboardEvent())
    })();

    // 卸载时执行销毁列表里面的销毁函数
    onUnmounted(() => {
        state.destroyList.forEach(fn => fn())
    })

    return state
}