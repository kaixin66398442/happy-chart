// 注册物料组件，配置组件对应的映射关系的配置文件
// componentList存储所有的物料
// componentMap中的key对应组件的映射关系

import Text from '@/components/Text/index.vue'
import TextPreview from '@/components/TextPreview/index.vue'

// 全部组件列表
const componentList = []
// 组件映射表
const componentMap = {}
// 注册组件的方法
const register = (component) => { // 注册
    componentList.push(component)
    componentMap[component.key] = component
}

// 注册文本组件
register({
    label: '文本',
    preview: () => TextPreview,
    render: () => Text,
    key: 'text',
})

export let config = {
    componentList,
    componentMap
}