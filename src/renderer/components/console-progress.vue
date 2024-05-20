<template>
  <transition name="fade">
    <div class="console-progress" v-if="isProgressing">
      <el-progress type="dashboard"
                   :percentage="percentage"
                   :duration="10"
                   :indeterminate="true"
                   color="#175888">

        <template #default="{ percentage }">
          <span class="console-progress__percentage">{{ percentage }}%</span>
          <span class="console-progress__label">Progressing</span>
        </template>
      </el-progress>
    </div>
  </transition>
</template>

<script setup>
defineProps(['isProgressing', 'percentage']);
</script>

<style lang="scss">
.console-progress {
  position: absolute;
  top: 292px;
  left: 20px;
  right: 20px;
  height: 203px;
  z-index: 2;
  background: #383838;
  border-radius: 5px;
  box-sizing: border-box;
  padding-top: 50px;
  text-align: center;
}

.console-progress__percentage {
  color: #fff !important;
}

.console-progress__label {
  display: block;
  margin-top: 10px;
  font-size: 12px !important;
  color: #a7a7a7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
