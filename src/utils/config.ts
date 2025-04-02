// 注册物料组件，配置组件对应的映射关系的配置文件
// componentList存储所有的物料
// componentMap中的key对应组件的映射关系

import Text from '@/components/Text/index.vue'
import TextPreview from '@/components/TextPreview/index.vue'
import Rect from '@/components/Rect/index.vue'
import RectPreview from '@/components/RectPreview/index.vue'
import RoundedRect from '@/components/RoundedRect/index.vue'
import RoundedRectPreview from '@/components/RoundedRectPreview/index.vue'

import { ElButton, ElInput } from 'element-plus'

// 全部组件列表
const componentList = []
// 组件映射表
const componentMap = {}
// 注册组件的方法
const register = (component) => { // 注册
    componentList.push(component)
    componentMap[component.key] = component
}

// 创建属性对象的方法
const createInputProp = (label) => ({ type: 'input', label })
const createColorProp = (label) => ({ type: 'color', label })
const createSelectProp = (label, options) => ({ type: 'select', label, options })

// 注册文本组件
register({
    label: '文本',
    preview: () => TextPreview,
    render: () => Text,
    key: 'text',
    props: {
        text: createInputProp('文本内容'),
        color: createColorProp('文本颜色'),
        size: createSelectProp('字体大小', [
            { label: '14px', value: '14px', },
            { label: '20px', value: '20px' },
            { label: '24px', value: '24px' },
        ])
    }
})

register({
    label: '矩形',
    preview: () => RectPreview,
    render: () => Rect,
    key: 'rect',
    props: {
        text: createInputProp('文本内容'),
        color: createColorProp('文本颜色'),
        size: createSelectProp('字体大小', [
            { label: '14px', value: '14px', },
            { label: '20px', value: '20px' },
            { label: '24px', value: '24px' },
        ])
    }
})

register({
    label: '圆角矩形',
    preview: () => RoundedRectPreview,
    render: () => RoundedRect,
    key: 'roundedRect',
    props: {
        text: createInputProp('文本内容'),
        color: createColorProp('文本颜色'),
        size: createSelectProp('字体大小', [
            { label: '14px', value: '14px', },
            { label: '20px', value: '20px' },
            { label: '24px', value: '24px' },
        ])
    }
})

export let config = {
    componentList,
    componentMap
}