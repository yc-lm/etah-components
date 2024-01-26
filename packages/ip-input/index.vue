<template>
  <div class="ip-input">
    <div :class="{ disabled: disabled, active: active }" :style="{ width: width }" class="ip-box">
      <input
          ref="ip1"
          :disabled="disabled"
          v-model="ip1"
          maxlength="3"
          @focus="active = true"
          @paste="paste($event)"
          @input="ip1Change()"
          @keyup="keyupEvent(1, $event)"
          @blur="(ip1 = checkIp(ip1)), submitIp()"
      />
      <div class="ip-dot" />
      <input
          ref="ip2"
          :disabled="disabled"
          v-model="ip2"
          maxlength="3"
          @focus="active = true"
          @paste="paste($event)"
          @input="ip2Change()"
          @keyup="keyupEvent(2, $event)"
          @blur="(ip2 = checkIp(ip2)), submitIp()"
      />
      <div class="ip-dot" />
      <input
          ref="ip3"
          :disabled="disabled"
          v-model="ip3"
          @paste="paste($event)"
          @focus="active = true"
          maxlength="3"
          @input="ip3Change"
          @keyup="keyupEvent(3, $event)"
          @blur="(ip3 = checkIp(ip3)), submitIp()"
      />
      <div class="ip-dot" />
      <input
          ref="ip4"
          :disabled="disabled"
          v-model="ip4"
          @paste="paste($event)"
          maxlength="3"
          @focus="active = true"
          @input="ip4 = ip4.replace(/[^\d]/g, '')"
          @keyup="keyupEvent(4, $event)"
          @blur="(ip4 = checkIp(ip4)), submitIp()"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'inputTest',
  model: {
    prop: 'ipAddress',
    event: 'change'
  },
  props: {
    //ip地址回显
    ipAddress: {
      type: String,
      required: true
    },
    //不可输入
    disabled: {
      type: Boolean,
      default: false
    },
    //宽度
    width: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      ip1: '',
      ip2: '',
      ip3: '',
      ip4: '',
      active: false,
    };
  },
  watch: {
    ipAddress: {
      handler: function() {
        if (this.ipAddress) {
          this.initIp(this.ipAddress);
        }
      }
    }
  },
  created() {
    //处理ip回显
    this.initIp(this.ipAddress);
  },
  methods: {
    ip1Change() {
      this.ip1 = this.ip1.replace(/[^\d]/g, '');
      if (this.ip1.length === 3 && this.ip1 > 99) {
        this.$refs.ip2.focus();
      }
    },
    ip2Change() {
      this.ip2 = this.ip2.replace(/[^\d]/g, '');
      if (this.ip2.length === 3 && this.ip2 > 99) {
        this.$refs.ip3.focus();
      }
    },
    ip3Change() {
      this.ip3 = this.ip3.replace(/[^\d]/g, '');
      if (this.ip3.length === 3 && this.ip3 > 99) {
        this.$refs.ip4.focus();
      }
    },
    initIp(ip) {
      if (ip !== '') {
        // split()将字符串分割为子字符串数组
        const ipList = ip.split('.');
        this.ip1 = ipList[0];
        this.ip2 = ipList[1];
        this.ip3 = ipList[2];
        this.ip4 = ipList[3];
      }
    },
    //ip地址粘贴
    paste(event) {
      let pasteText = event.clipboardData.getData('text/plain');
      this.initIp(pasteText);
    },
    //检查ip输入是否合理
    checkIp(ip) {
      if (parseInt(ip) > 255) {
        ip = '255';
      } else if (ip === '0' || ip === '00' || ip === '000') {
        ip = '0';
      } else {
        ip = ip.replace(/\b(0+)/g, '');
      }
      return ip;
    },
    // 失去焦点时判断输入是否完成，向父组件传递ip
    submitIp() {
      this.active = false;
      let ipVal = '';
      if (!(this.ip1 === '') && !(this.ip2 === '') && !(this.ip3 === '') && !(this.ip4 === '')) {
        ipVal = this.ip1 + '.' + this.ip2 + '.' + this.ip3 + '.' + this.ip4;
      }
      this.$emit('getCurrentVal', ipVal);
    },
    // 按下左键,上键和右键，下键焦点左右移动
    keyupEvent(index, e) {
      this.$nextTick(() => {
        // 按下'↑'键焦点左移
        if (e.keyCode === 38 || e.keyCode === 37) {
          if (index === 2) {
            this.$refs.ip1.focus();
          } else if (index === 3) {
            this.$refs.ip2.focus();
          } else if (index === 4) {
            this.$refs.ip3.focus();
          }
        } else if (e.keyCode === 40 || e.keyCode === 39) {
          // 按下'↓'键焦点右移
          if (index === 1) {
            this.$refs.ip2.focus();
          } else if (index === 2) {
            this.$refs.ip3.focus();
          } else if (index === 3) {
            this.$refs.ip4.focus();
          }
        } else if (e.keyCode === 110) {
          // 按下'.'键焦点右移
          if (index === 1) {
            this.$refs.ip2.focus();
          } else if (index === 2) {
            this.$refs.ip3.focus();
          } else if (index === 3) {
            this.$refs.ip4.focus();
          }
        } else if (e.keyCode === 8) {
          //判断input框value长度
          if (index === 2 && e.target.value.length === 0) {
            this.$refs.ip1.focus();
          } else if (index === 3 && e.target.value.length === 0) {
            this.$refs.ip2.focus();
          } else if (index === 4 && e.target.value.length === 0) {
            this.$refs.ip3.focus();
          }
        }
      });
    },
    clearInputValue() {
      this.ip1 = '';
      this.ip2 = '';
      this.ip3 = '';
      this.ip4 = '';
    }
  }
};
</script>
<style lang="scss" src="./index.scss" scoped></style>
