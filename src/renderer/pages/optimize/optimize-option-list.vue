<template>
  <div class="optimize__option-list">
    <div class="optimize-option">
      <div class="optimize-option__title">Output Directory</div>

      <el-input v-model="output" readonly>
        <template #append>
          <button class="optimize-option__open-file"
                  @click="handleFindOutputDirectory">
            <el-icon>
              <FolderOpened />
            </el-icon>
          </button>
        </template>
      </el-input>
    </div>

    <div class="optimize-option">
      <div class="optimize-option__title">Quality</div>

      <el-form-item label="JPG"
                    label-width="40">

        <el-select v-model="jpgValue"
                   @change="handleUpdateLevel($event,'jpg')"
                   class="optimize-option__select">
          <el-option
              v-for="level in jpgLevel"
              :key="level.value"
              :label="level.label"
              :value="level.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="PNG" label-width="40">
        <el-select v-model="pngValue"
                   @change="handleUpdateLevel($event,'png')"
                   class="optimize-option__select">
          <el-option
              v-for="level in pngLevel"
              :key="level.value"
              :label="level.label"
              :value="level.value">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const output = ref(window.optimizeAPI.defaultOutputDirectory());

const jpgValue = ref('80');

const pngValue = ref('80');

const jpgLevel = [
  {
    value: '80',
    label: '80'
  },
  {
    value: '70',
    label: '70'
  },
  {
    value: '60',
    label: '60'
  }
];

const pngLevel = [
  {
    value: '90',
    label: '90'
  },
  {
    value: '80',
    label: '80'
  },
  {
    value: '70',
    label: '70'
  },
  {
    value: '60',
    label: '60'
  }
];

const handleUpdateLevel = (value, type) => {
  window.optimizeAPI.updateLevel({value, type});
};

const handleFindOutputDirectory = async () => {
  output.value = await window.optimizeAPI.openDirectory();
};
</script>

<style lang="scss">
.optimize-option {
  border: 1px solid #444444;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.optimize-option__title {
  margin-bottom: 10px;
  font-size: 14px;
  color: #fff;
  height: 17px;
}

.optimize-option__select {
  width: 100%;
}
</style>
