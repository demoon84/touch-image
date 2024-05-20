<template>
  <div class="webp-option-list">
    <div class="webp-option">
      <div class="webp-option__title">Output Directory</div>

      <el-input v-model="output" readonly>
        <template #append>
          <button class="webp-option__open-file"
                  @click="handleFindOutputDirectory">
            <el-icon>
              <FolderOpened />
            </el-icon>
          </button>
        </template>
      </el-input>
    </div>

    <div class="webp-option">
      <div class="webp-option__title">Options</div>

      <el-form-item label="Quality"
                    label-width="60">

        <el-select v-model="webpValue"
                   @change="handleUpdateLevel"
                   class="webp-option__select">
          <el-option
              v-for="level in webpLevel"
              :key="level.value"
              :label="level.label"
              :value="level.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-row>
        <el-col :span="4">
          <el-form-item label="Animated"
                        label-width="60">
            <el-switch v-model="animated"
                       @change="handleUpdateAnimated" />
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="Loop"
                        label-width="60">
            <el-switch v-model="loop"
                       @change="handleUpdateRepeat"
                       :disabled="!animated" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="FPS"
                        label-width="60">
            <el-input-number v-model="fps"
                             :disabled="!animated"
                             controls-position="right"
                             @change="handleUpdateFps"
                             :min="0"
                             :max="60"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script setup>
import {ref} from 'vue';

const output = ref(window.webpAPI.defaultOutputDirectory());

const webpValue = ref('80');

const animated = ref(false);

const loop = ref(true);

const fps = ref(30);

const webpLevel = [
  {
    value: '100',
    label: '100'
  },
  {
    value: '90',
    label: '90'
  },
  {
    value: '85',
    label: '85'
  },
  {
    value: '80',
    label: '80'
  },
  {
    value: '75',
    label: '75'
  }
];

const handleUpdateLevel = (value) => {
  window.webpAPI.updateLevel(value);
};

const handleUpdateAnimated = (value) => {
  window.webpAPI.updateAnimated(value);
};

const handleUpdateRepeat = (value) => {
  window.webpAPI.updateLoop(value);
};

const handleUpdateFps = (value) => {
  window.webpAPI.updateFps(value);
};

const handleFindOutputDirectory = async () => {
  output.value = await window.webpAPI.openDirectory();
};
</script>

<style lang="scss">
.webp-option {
  border: 1px solid #444444;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.webp-option__title {
  margin-bottom: 10px;
  font-size: 14px;
  color: #fff;
  height: 17px;
}

.webp-option__select {
  width: 100%;
}
</style>
