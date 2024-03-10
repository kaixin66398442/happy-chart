// container小仓库，存放与container有关的信息
import { defineStore } from "pinia";

const useContainerStore = defineStore('container', {
    state: () => {
        return {
            containerWidth: 1500,
            containerHeight: 1050,
            containerScale: 1,
            operator: {
                isShowOperator: false,
                // 页面尺寸选择框数据列表
                pageSizeArr: [
                    {
                        label: "A3(1500px*2100px)",
                        value: "1500 2100",
                    },
                    {
                        label: "A4(1050px*1500px)",
                        value: "1050 1500",
                    },
                    {
                        label: "A5(750px*1050px)",
                        value: "750 1050",
                    },
                ],
                // 选中的页面尺寸
                pageSizeValue: "A4(1050px*1500px)",
                // 是否显示网格
                isShowGrid: true,
                // 网格类型列表"fixedDot"
                gridTypeArr: [
                    {
                        label: "点阵网格",
                        value: "dot",
                    },
                    {
                        label: "固定点阵",
                        value: "fixedDot",
                    },
                    {
                        label: "网格",
                        value: "mesh",
                    },
                    {
                        label: "双线网格",
                        value: "doubleMesh",
                    },
                ],
                // 选中的网格类型
                gridTypeValue: "doubleMesh",
                // 网格间距
                gridSpacingValue: 10,
                // 网格间距最大值
                gridSpacingMaxValue: 20,
                // 网格间距最小值
                gridSpacingMinValue: 1,
                // 网格颜色(主)
                gridColorMainValue: "#f2f2f2",
                // 网格颜色(次)
                gridColorSecondValue: "#e5e5e5",
                // 背景颜色
                gridBackgroundColorValue: "#fff",
                // 页面大小是选择预设还是自定义（默认预设）
                pageSizeType: "preset", // 预设：preset || 自定义：custom
                // 画布横向或竖向（默认横向）
                canvaDirectionArr: [
                    // 横向：transverse || 竖向： vertical
                    {
                        label: "横向页面",
                        value: "transverse",
                    },
                    {
                        label: "竖向页面",
                        value: "vertical",
                    },
                ],
                canvaDirectionValue: "transverse",
            },
            material: {
                isShowMaterial: true,
            },
            canvasDOM: null
        }
    }
})

// 导出
export default useContainerStore