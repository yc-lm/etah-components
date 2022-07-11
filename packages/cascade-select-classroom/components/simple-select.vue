<template>
    <select class="simple-select" @change="handleChange">
        <option
            v-for="item in options"
            :key="item[value]"
            :value="item[value]"
            :selected="selectValue === item[value]"
        >
            {{ item[label] }}
        </option>
    </select>
</template>

<script>
export default {
    name: "SimpleSelect",
    model: {
        prop: "selectValue",
        event: "change",
    },
    props: {
        selectValue: {
            type: String,
            default: "",
        },
        options: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: "label",
        },
        value: {
            type: String,
            default: "value",
        },
    },
    methods: {
        handleChange(event) {
            this.$emit("change", event.target.value);
        },
    },
};
</script>

<style scoped lang="scss">
.simple-select {
    display: inline-block;
    width: 100%;
    min-width: 240px;
}
</style>
