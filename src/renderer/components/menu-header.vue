<template>
  <nav :class="['header-menu', {'header-menu--window':isWindow}]">
    <a href="#"
       v-for="menu in menuList"
       @click.prevent="handleClickMenu(menu)"
       :class="[
          'header-menu__item',
          {'header-menu__item--active': active === menu}
       ]">{{ menu }}
    </a>
  </nav>
</template>

<script setup>
import {ref, computed} from 'vue';

const isWindow = computed(() => {
  return window.commonAPI.platform() !== 'darwin';
});

const emit = defineEmits(['update']);

const menuList = ['Webp', 'Optimize'];

const active = ref('Webp');

const handleClickMenu = (name) => {
  active.value = name;
  
  emit('update', name);
};
</script>

<style lang="scss">
.header-menu {
  position: absolute;
  top: 0;
  left: 80px;
  text-align: left;
}

.header-menu--window {
  left: 0;
}

.header-menu__item {
  display: inline-block;
  padding: 0 12px;
  width: 80px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  box-sizing: border-box;
  -webkit-app-region: no-drag;
  user-select: none;
  cursor: pointer;
}

.header-menu__item--active {
  background: #2c2c2c;
  border-left: 1px solid #383838;
  border-right: 1px solid #383838;
}

</style>
