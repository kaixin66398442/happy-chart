import { h, render } from 'vue'
import Menu from './index.vue'

export function openContextMenus(e) {
    let containerEl = document.createElement('div') // 创建一个容器元素
    const vnode = h(Menu)
    render(vnode, containerEl)
    const { clientX, clientY } = e
    containerEl.style.position = 'absolute'
    containerEl.style.left = `${clientX}px`
    containerEl.style.top = `${clientY}px`
    containerEl.style.zIndex = 9999
    document.body.appendChild(containerEl)
}



