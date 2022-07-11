<template>
    <div>
        <!--教育分区-->
        <SelectLevelData
            ref="distRef"
            label="name"
            value="dist_id"
            :select-value.sync="distId"
            :api="distApi"
            :params="distParams"
        />
        <!--学校-->
        <SelectLevelData
            ref="schoolRef"
            label="school_name"
            value="school_id"
            :select-value.sync="schoolId"
            :api="schoolApi"
            :params="schoolParams"
        />
        <!--校区-->
        <SelectLevelData
            ref="areaRef"
            label="area_name"
            value="area_id"
            :select-value.sync="areaId"
            :api="areaApi"
            :params="areaParams"
        />
        <!--楼栋-->
        <SelectLevelData
            ref="buildRef"
            label="build_name"
            value="build_id"
            :select-value.sync="buildId"
            :api="buildApi"
            :params="buildParams"
        />
        <!--教室-->
        <SelectLevelData
            ref="roomRef"
            label="room_name"
            value="room_id"
            :select-value.sync="roomId"
            :api="roomApi"
            :params="roomParams"
        />
    </div>
</template>

<script>
import SelectLevelData from "./components/select-level-data";
import {
    getAreaList,
    getBuildList,
    getDistList,
    getRoomList,
    getSchoolList,
} from "./api";
import { DEFAULT_SELECT_ID } from "./constants";

export default {
    name: "CascadeSelectClassroom",
    components: { SelectLevelData },
    props: {
        /**
         * 请求路径
         */
        url: {
            type: String,
            default: "",
        },
        /**
         * 设备类型
         */
        devType: {
            type: String,
            default: "",
        },
        /**
         * 回显用的id
         */
        echoIds: {
            type: Object,
            default: () => ({
                distId: "-1",
                schoolId: "-1",
                areaId: "-1",
                buildId: "-1",
                roomId: "-1",
            }),
        },
    },
    data() {
        return {
            // 教育分区
            distApi: getDistList,
            distId: DEFAULT_SELECT_ID,

            // 学校
            schoolApi: getSchoolList,
            schoolId: DEFAULT_SELECT_ID,

            // 校区
            areaApi: getAreaList,
            areaId: DEFAULT_SELECT_ID,

            // 楼栋
            buildApi: getBuildList,
            buildId: DEFAULT_SELECT_ID,

            // 教室
            roomApi: getRoomList,
            roomId: DEFAULT_SELECT_ID,
        };
    },
    computed: {
        commonParams() {
            return {
                url: this.url,
                devType: this.devType,
            };
        },
        distParams() {
            return {
                ...this.commonParams,
            };
        },
        schoolParams() {
            return {
                ...this.commonParams,
                data: {
                    dist_id: this.distId,
                },
            };
        },
        areaParams() {
            return {
                ...this.commonParams,
                data: {
                    school_id: this.schoolId,
                },
            };
        },
        buildParams() {
            return {
                ...this.commonParams,
                data: {
                    area_id: this.areaId,
                },
            };
        },
        roomParams() {
            return {
                ...this.commonParams,
                data: {
                    build_id: this.buildId,
                },
            };
        },
    },
    watch: {
        distId() {
            this.distId !== DEFAULT_SELECT_ID
                ? this.getSchoolListAct()
                : this.resetSchoolList();
        },
        schoolId() {
            this.schoolId !== DEFAULT_SELECT_ID
                ? this.getAreaListAct()
                : this.resetAreaList();
        },
        areaId() {
            this.areaId !== DEFAULT_SELECT_ID
                ? this.getBuildListAct()
                : this.resetBuildList();
        },
        buildId() {
            this.buildId !== DEFAULT_SELECT_ID
                ? this.getRoomListAct()
                : this.resetRoomList();
        },
        // 处理回显
        echoIds: {
            immediate: true,
            handler() {
                this.distId = this.echoIds?.distId || DEFAULT_SELECT_ID;
                this.schoolId = this.echoIds?.schoolId || DEFAULT_SELECT_ID;
                this.areaId = this.echoIds?.areaId || DEFAULT_SELECT_ID;
                this.buildId = this.echoIds?.buildId || DEFAULT_SELECT_ID;
                this.roomId = this.echoIds?.roomId || DEFAULT_SELECT_ID;
            },
        },
    },
    mounted() {
        this.initLevelData();
    },
    methods: {
        initLevelData() {
            this.getDistListAct();
        },
        getDistListAct() {
            this.$nextTick(() => {
                this.$refs.distRef.getLevelData();
            });
        },
        getSchoolListAct() {
            console.log(this.distId, 111);
            this.$nextTick(() => {
                this.$refs.schoolRef.getLevelData();
            });
        },
        getAreaListAct() {
            this.$nextTick(() => {
                this.$refs.areaRef.getLevelData();
            });
        },
        getBuildListAct() {
            this.$nextTick(() => {
                this.$refs.buildRef.getLevelData();
            });
        },
        getRoomListAct() {
            console.log(this.buildId, 111);
            this.$nextTick(() => {
                this.$refs.roomRef.getLevelData();
            });
        },
        resetDistList() {
            this.$nextTick(() => {
                this.$refs.distRef.reset();
            });
        },
        resetSchoolList() {
            this.$nextTick(() => {
                this.$refs.schoolRef.reset();
            });
        },
        resetAreaList() {
            this.$nextTick(() => {
                this.$refs.areaRef.reset();
            });
        },
        resetBuildList() {
            this.$nextTick(() => {
                this.$refs.buildRef.reset();
            });
        },
        resetRoomList() {
            this.$nextTick(() => {
                this.$refs.roomRef.reset();
            });
        },
    },
};
</script>
