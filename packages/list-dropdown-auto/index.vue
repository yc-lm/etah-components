<template>
    <div class="block-ele-list-wrap" ref="resize-wrap" :class="wrapperClassObj">
        <div class="main-content">
            <!--此处展示list-->
            <div class="visible-list-wrap">
                <div
                    class="visible-item"
                    v-for="(item, index) in visibleList"
                    :key="index"
                    @click="handleClick(index, item.active)"
                >
                    <block-ele
                        :label="item.label"
                        :number="item.number"
                        :icon="item.icon"
                        :class-obj="{ ['m-r-20']: index !== visibleList.length - 1, ['active']: item.active }"
                    >
                    </block-ele>
                </div>
            </div>
            <!--超出显示更多，更多显示下拉列表-->
            <div class="no-visible-list-wrap" v-show="hiddenListFlag">
                <!--更多按钮-->
                <div class="more-text" @click="handleClickMore">
                    <span>更多</span>
                    <span class="el-icon-arrow-down" v-if="!selectExpandFlag"></span>
                    <span class="el-icon-arrow-up" v-else></span>
                </div>
                <!--隐藏列表-->
                <div class="hidden-list-wrap" v-show="selectExpandFlag">
                    <div
                        v-for="(item, index) in hiddenList"
                        :key="index"
                        @click="handleClick(index, item.active, true)"
                    >
                        <block-ele
                            :label="item.label"
                            :number="item.number"
                            :icon="item.icon"
                            :class-obj="{ ['w-136']: true, ['m-b-10']: true, ['active']: item.active }"
                        >
                        </block-ele>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import listEleOverflowAutoMx from './components/listEleOverflowAutoMx';

export default {
    name: 'ListEleOverflowAuto',
    mixins: [listEleOverflowAutoMx]
};
</script>
<style lang="scss" scoped>
.block-ele-list-wrap {
    height: 100%;
    width: 100%;

    .main-content {
        height: 100%;
        display: flex;

        .visible-list-wrap {
            display: flex;

            /*.visible-item {
                &:nth-last-child(1) {
                    margin-right: 0 !important;
                }
            }*/
        }

        .no-visible-list-wrap {
            margin-left: 20px;
            position: relative;

            .more-text {
                margin-right: 0 !important;
                cursor: pointer;
                font-size: 14px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
                box-sizing: border-box;
                background: #f0f3f5;
                border-radius: 4px;
                color: #2cabf8;
            }

            .hidden-list-wrap {
                padding: 10px;
                box-sizing: border-box;
                right: 0;
                top: 34px;
                position: absolute;
                display: flex;
                flex-direction: column;
                background: #ffffff;
                box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.15);
                border-radius: 4px;
                z-index: 102;
            }
        }
    }
}
</style>
