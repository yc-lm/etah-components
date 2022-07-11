<template>
    <SimpleSelect
        v-model="selectValueComputed"
        :options="finalOptions"
        :label="label"
        :value="value"
    />
</template>

<script>
import SimpleSelect from "./simple-select";
import { apiSimpleWrapper } from "./../api";
import { DEFAULT_SELECT_ID, DEFAULT_SELECT_NAME } from "./../constants";

export default {
    name: "SelectLevelData",
    components: { SimpleSelect },
    props: {
        /**
         * 使用 .sync
         */
        selectValue: {
            type: String,
            default: DEFAULT_SELECT_ID,
        },
        label: {
            type: String,
            default: "label",
        },
        value: {
            type: String,
            default: "value",
        },
        api: {
            type: Function,
            default: (_) => _,
        },
        params: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            options: [],
        };
    },
    computed: {
        initOptions() {
            return [
                {
                    [this.label]: DEFAULT_SELECT_NAME,
                    [this.value]: DEFAULT_SELECT_ID,
                },
            ];
        },
        finalOptions() {
            return this.options.length > 0
                ? this.options
                : this.getInitOptions();
        },
        selectValueComputed: {
            get() {
                return this.selectValue;
            },
            set(value) {
                this.updateSelectValue(value);
            },
        },
    },
    methods: {
        async getLevelData() {
            const resultArr = await apiSimpleWrapper({
                api: this.api,
                params: this.params,
                defaultValue: [],
            });
            this.options = [].concat(this.getInitOptions(), resultArr);
        },
        getInitOptions() {
            return JSON.parse(JSON.stringify(this.initOptions));
        },
        updateSelectValue(value) {
            this.$emit("update:selectValue", value);
        },
        reset() {
            this.options = this.getInitOptions();
            this.updateSelectValue(DEFAULT_SELECT_ID);
        },
    },
};
</script>

<style scoped></style>
