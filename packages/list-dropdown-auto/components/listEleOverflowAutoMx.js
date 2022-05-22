import { useElementSize, useResizeObserver } from '@vueuse/core';

export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        wrapperClassObj: {
            type: Object,
            default: () => {
                return { ['flex justify-right']: true };
            }
        },
        // 列表元素的最小宽度，更小则显示不下
        listMinWidth: {
            type: Number,
            default: 0
        },
        // margin
        wrapperMargin: {
            type: Number,
            default: 20
        },
        // 元素的宽度，如果是动态子元素，则需要取最小的元素大小
        // 最好是每个子元素等宽，则边距才会一样，否则无法一致
        listItemWidth: {
            type: Number,
            default: 0
        },
        blockEle: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            // 点击更多展开状态
            selectExpandFlag: false,
            // 是否展示更多
            hiddenListFlag: false,
            // 浏览器的宽度
            width: 0,
            // 需要监听的容器元素,具有自适应宽度 ！！important
            el: null,
            // 已超出元素个数
            exceedNumber: 0,
            componentName: ''
        };
    },
    computed: {
        listLength() {
            return this.list.length;
        },
        // 进入到更多的开始下标
        hiddenStartIndex() {
            let num = this.listLength - (this.exceedNumber + 1);
            return num >= 0 ? num : 0;
        },
        visibleList() {
            if (isNaN(this.exceedNumber) || this.exceedNumber === 0) {
                return this.list;
            } else {
                return this.list.slice(0, this.hiddenStartIndex);
            }
        },
        hiddenList() {
            if (this.exceedNumber === 0 || isNaN(this.exceedNumber)) {
                return [];
            } else {
                return this.list.slice(this.hiddenStartIndex);
            }
        },
        wrapperMinWidth() {
            return this.listMinWidth + this.wrapperMargin;
        }
    },
    created() {
        this.$options.components['block-ele'] = this.blockEle;
    },
    mounted() {
        // 监听容器的宽度
        this.observerContainer();
    },
    methods: {
        // 观察dom宽度变化
        observerContainer() {
            useResizeObserver(this.$refs['resize-wrap'], entries => {
                const entry = entries[0];
                const { width, height } = entry.contentRect;
                console.log(`width: ${width}, height: ${height}`);
                this.width = width;
                this.allotListItem();
            });
        },

        // 根据当前dom的宽度对list进行分配
        allotListItem() {
            if (this.width < this.wrapperMinWidth) {
                this.hiddenListFlag = true;
                // 超出宽度除以元素宽度 向上取整，如1.x，超过了1个
                // 已超出元素个数
                this.exceedNumber = Math.ceil((this.wrapperMinWidth - this.width) / this.listItemWidth);
                console.log('exceedNumber', this.exceedNumber);
            } else {
                // 重置
                this.exceedNumber = 0;
                this.hiddenListFlag = false;
            }
        },

        handleClick(index, status, flag = false) {
            if (flag) {
                // 如果是隐藏列表，下标需要加上可见列表长度
                index = this.visibleList.length + index;
            }
            this.selectExpandFlag = false;
            this.$emit('handleSelectDeviceStatus', { index, status });
        },

        handleClickMore() {
            this.selectExpandFlag = !this.selectExpandFlag;
        }
    }
};
