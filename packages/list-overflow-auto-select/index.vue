<template>
    <div class="list-auto-select-container" ref="resize-wrap" :class="containerClassObj">
        <div class="main-content">
            <!--此处展示list-->
            <div class="visible-list-wrap">
                <div
                    class="visible-item"
                    v-for="(item, index) in visibleList"
                    :key="index"
                    @click="handleClick(index, item)"
                >
                    <child-component
                        :item="item"
                        :class-obj="{ ['m-r-20']: index !== visibleList.length - 1, ['active']: item.active }"
                    >
                    </child-component>
                </div>
            </div>
            <!--超出显示更多，更多显示下拉列表-->
            <div class="no-visible-list-wrap" v-show="isHiddenList">
                <!--更多按钮-->
                <div class="more-text" @click="handleClickMore">
                    <span>更多</span>
                    <span class="el-icon-arrow-down" v-if="!isSelectExpand"></span>
                    <span class="el-icon-arrow-up" v-else></span>
                </div>
                <!--隐藏列表-->
                <div class="hidden-list-wrap" v-show="isSelectExpand">
                    <div v-for="(item, index) in hiddenList" :key="index" @click="handleClick(index, item, true)">
                        <child-component
                            :item="item"
                            :class-obj="{
								[`min-w-${childWidth}`]: true,
								['m-b-10']: index !== hiddenListLength - 1,
								['active']: item.active
							}"
                        >
                        </child-component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import elementResizeDetectorMaker from 'element-resize-detector';

export default {
    name: 'ListOverflowAutoSelect',
    props: {
        /**
         * 需要渲染的list数组
         */
        list: {
            type: Array,
            default: () => []
        },
        /**
         * list元素居左，居右显示，默认右
         * @values right, left
         */
        alignDirect: {
            type: String,
            default: 'right'
        },
        /**
         * 容器的最小宽度，小于此宽度时显示更多
         */
        listMinWidth: {
            type: Number,
            default: 0
        },
        /**
         * 容器的margin值
         */
        wrapperMargin: {
            type: Number,
            default: 20
        },
        /**
         * 元素的宽度，如果是动态子元素，则需要取最小的元素大小
         */
        childWidth: {
            type: Number,
            default: 0
        },
        /**
         * 子元素组件
         */
        childComponent: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            // 点击更多展开状态
            isSelectExpand: false,
            // 是否展示更多
            isHiddenList: false,
            // 浏览器的宽度
            width: 0,
            // 需要监听的容器元素,具有自适应宽度 ！！important
            element: null,
            // 已超出子元素个数
            overChildNum: 0,
            // 观察对象
            resizeObserver: null
        };
    },
    computed: {
        // 容器动态样式
        containerClassObj() {
            return {
                ['justify-right']: this.alignDirect === 'right',
                ['justify-left']: this.alignDirect === 'left'
            };
        },
        listLength() {
            return this.list.length;
        },
        // 隐藏列表的开始下标
        hiddenStartIndex() {
            let num = this.listLength - (this.overChildNum + 1);
            return num >= 0 ? num : 0;
        },
        // 子元素可见列表
        visibleList() {
            if (isNaN(this.overChildNum) || this.overChildNum === 0) {
                return this.list;
            } else {
                return this.list.slice(0, this.hiddenStartIndex);
            }
        },
        // 子元素隐藏列表
        hiddenList() {
            if (isNaN(this.overChildNum) || this.overChildNum === 0) {
                return [];
            } else {
                return this.list.slice(this.hiddenStartIndex);
            }
        },
        // 隐藏列表的长度
        hiddenListLength() {
            return this.hiddenList.length;
        },
        // 容器最小宽度
        containerMinWidth() {
            return this.listMinWidth + this.wrapperMargin;
        }
    },
    created() {
        // 注册子元素为组件
        this.registerChild();
        // 实例挂载完成后触发
        this.$nextTick(() => {
            this.start();
        });
    },
    // activated和deactivated 生命周期兼容keep-alive的页面
    activated() {
        this.start();
    },
    deactivated() {
        this.removeAllListeners();
    },

    beforeDestroy() {
        this.removeAllListeners();
    },
    methods: {
        /**
         * @description 初始化
         */
        start() {
            // 初始化dom对象
            this.initElement();
            // 监听元素宽度变化
            this.observerElementResize();
        },

        /**
         * @description 监听元素宽大小变化，分配子元素显示位置
         */
        observerElementResize() {
            // 如果存在则不出创建
            // 出现这种情况原因是第一次进页面时created和activated生命周期均会触发
            if (!this.resizeObserver) {
                this.resizeObserver = elementResizeDetectorMaker();
                this.resizeObserver.listenTo(this.element, element => {
                    this.width = element.offsetWidth;
                    // 根据当前容器宽度计算子元素显示
                    this.dispatchListItem();
                });
            }
        },

        /**
         * @description 根据当前dom的宽度对list进行分配
         */
        dispatchListItem() {
            if (this.width < this.containerMinWidth) {
                // 此时展示更多列表
                this.isHiddenList = true;
                // 超出宽度除以元素宽度 向上取整，如1.x，超过了1个
                // 已超出元素个数
                this.overChildNum = Math.ceil((this.containerMinWidth - this.width) / this.childWidth);
            } else {
                // 宽度大于最小宽度时重置
                this.overChildNum = 0;
                this.isHiddenList = false;
                // 重置下拉属性
                this.isSelectExpand = false;
            }
        },

        /**
         * @description 子元素的点击事件
         * @param index {Number} 元素下标,
         * @param item {Object} list中下标对应的元素,
         * @param flag {Boolean} 是否为点击更多中的元素，默认false
         * @return undefined
         */
        handleClick(index, item, flag = false) {
            // 如果是隐藏列表，下标需要加上可见列表长度
            if (flag) index = this.visibleList.length + index;
            // 收起下拉展开
            this.isSelectExpand = false;
            // 触发事件
            this.$emit('handleClick', { index, item });
        },

        /**
         * @description 点击更多时展开、收起下拉中的元素
         */
        handleClickMore() {
            this.isSelectExpand = !this.isSelectExpand;
        },

        /**
         * @description 初始化容器dom对象，element-resize-detector依赖库需要使用原生dom对象
         */
        initElement() {
            this.element = document.querySelector('.list-auto-select-container');
        },

        /**
         * @description 将子元素注册到component
         */
        registerChild() {
            this.$options.components['child-component'] = this.childComponent;
        },

        /**
         * @description 移除元素所有监听
         */
        removeAllListeners() {
            if (this.resizeObserver) {
                this.resizeObserver.uninstall(this.element);
                this.resizeObserver = null;
            }
        }
    }
};
</script>
<style lang="scss" src="./index.scss" scoped></style>
