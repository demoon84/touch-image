<template>
  <div class="layout-header">
    <menu-header @update="handleUpdatePage" />
  </div>

  <div class="layout-body">
    <Webp v-show="page === 'Webp'" />
    <Optimize v-show="page === 'Optimize'" />
  </div>
</template>

<script setup>
import MenuHeader from '@/components/menu-header.vue';
import Optimize from '@/pages/optimize/index.vue';
import Webp from '@/pages/webp/index.vue';
import {ref} from 'vue';

const page = ref('Webp');

const handleUpdatePage = (value) => {
  page.value = value;
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

a {
  color: #ffffff;
  text-decoration: none;

  &:hover {
    color: #fff
  }
}

button {
  outline: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

body {
  font-family: sans-serif;
  color: #a7a7a7;
  background: #2c2c2c;
  font-size: 12px;
  user-select: none;
}

.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  user-select: none;
  -webkit-app-region: drag;
  text-align: center;
  padding: 13px;
  box-sizing: border-box;
  font-weight: bold;
  cursor: move;
  background: #1e1e1e;
  height: 40px;
}

.layout-body {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
}

input[type='text'] {
  height: 36px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 0;
  outline: 0;
  color: #666;
}

html {
  .el-select .el-input__wrapper.is-focus,
  .el-select .el-input.is-focus .el-input__wrapper {
    box-shadow: none !important;
  }

  .el-input__wrapper,
  .el-input-group__append {
    background: #383838 !important;
    box-shadow: none !important;
    color: #9aa0ac !important;

    .el-icon {
      color: #fff !important;
    }
  }

  .el-input-group__append {
    background: #175888 !important;
    padding: 0 !important;

    button {
      width: 50px;
      height: 100%;
    }
  }

  .el-form-item__label {
    height: 38px !important;
    line-height: 38px !important;
    color: #a7a7a7 !important;
  }

  .el-form-item {
    margin: 0;
    padding: 5px 0 !important;
  }

  .el-input {
    border-radius: 8px !important;
    overflow: hidden;
  }

  .el-popper.is-light {
    background: #383838;
  }

  .el-popper.is-light .el-popper__arrow::before {
    background: #383838;
  }

  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: rgba(42, 42, 42, 0.7);
  }

  .el-select-dropdown__item.selected {
    background: #2a2a2a !important;
    color: #666 !important;
  }

  .el-switch.is-checked .el-switch__core {
    background: #175888 !important;
    border: 1px solid #175888 !important;
  }

  .el-switch.is-disabled,
  .el-input.is-disabled {
    opacity: .2 !important;
    transition: opacity .3s ease;
  }

  .el-switch {
    transition: opacity .3s ease;
  }

  .el-progress-circle__track {
    stroke-linecap: round;
  }

  .el-loading-mask {
    background: #383838;
  }

  .el-input-number__decrease,
  .el-input-number__increase {
    background: #175888 !important;
    border-color: #175888 !important;
  }

  .el-input-number {
    height: 28px;
    line-height: 28px;
  }
}
</style>
