<template>
  <el-form
    v-if="form"
    :model="form"
    label-width="200px">
    <div v-permission="'/setting/setting/system/shopping/basis'">
      <el-divider>基础设置</el-divider>

      <el-form-item
        :label="form.integral.description"
        prop="integral">
        <el-input-number
          v-model="form.integral.value"
          :placeholder="form.integral.description"
          controls-position="right"
          :min="0"/>
        <div class="help-block" v-html="form.integral.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.withdraw_fee.description"
        prop="withdraw_fee">
        <el-input-number
          v-model="form.withdraw_fee.value"
          :placeholder="form.withdraw_fee.description"
          controls-position="right"
          :precision="2"
          :step="0.1"
          :min="0"
          :max="100"/>
        <div class="help-block" v-html="form.withdraw_fee.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.invoice.description"
        prop="invoice">
        <el-input-number
          v-model="form.invoice.value"
          :placeholder="form.invoice.description"
          controls-position="right"
          :precision="2"
          :step="0.1"
          :min="0"
          :max="100"/>
        <div class="help-block" v-html="form.invoice.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.timeout.description"
        prop="timeout">
        <el-input-number
          v-model="form.timeout.value"
          :placeholder="form.timeout.description"
          controls-position="right"
          :min="0"/>
        <div class="help-block" v-html="form.timeout.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.complete.description"
        prop="complete">
        <el-input-number
          v-model="form.complete.value"
          :placeholder="form.complete.description"
          controls-position="right"
          :min="0"/>
        <div class="help-block" v-html="form.complete.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.spacer.description"
        prop="spacer">
        <el-input
          v-model="form.spacer.value"
          :placeholder="form.spacer.description"
          style="width: 180px;"
          :clearable="true"/>
        <div class="help-block" v-html="form.spacer.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.is_country.description"
        prop="is_country">
        <el-switch
          v-model="form.is_country.value"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <div class="help-block" v-html="form.is_country.help_text"></div>
      </el-form-item>
    </div>

    <div v-permission="'/setting/setting/system/shopping/source'">
      <el-divider>订单来源</el-divider>

      <el-form-item
        v-for="(item, index) in source"
        :label="`${form.source.description}${index}`"
        :key="`source_${index}`">

        <el-input
          class="dynamic-source-key"
          v-model="item.key"
          placeholder="序列值"
          :clearable="true"/>

        <el-input
          class="dynamic-source-value"
          v-model="item.value.name"
          placeholder="来源名称"
          :clearable="true"/>

        <el-input
          class="dynamic-source-value"
          v-model="item.value.icon"
          :prefix-icon="`iconfont icon${item.value.icon}`"
          placeholder="来源图标"
          :clearable="true"/>

        <el-button
          size="small"
          type="text"
          @click.prevent="source.splice(index, 1)">删除</el-button>
      </el-form-item>

      <el-form-item size="small">
        <el-button @click="source.push({'key': null, 'value': {'name': '', 'icon': ''}})">新增来源</el-button>
        <div class="help-block" v-html="form.source.help_text"></div>
      </el-form-item>
    </div>

    <el-form-item size="small">
      <el-button
        type="primary"
        :loading="loading"
        @click="handleFormSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setShoppingList } from '@/api/config/setting'

export default {
  data() {
    return {
      loading: false,
      form: null,
      source: []
    }
  },
  methods: {
    // 设置配置数据
    setFormData(val) {
      this.form = val
      this.source = []

      for (const key in this.form.source.value) {
        if (this.form.source.value.hasOwnProperty(key)) {
          this.source.push({
            'key': key,
            'value': this.form.source.value[key]
          })
        }
      }
    },
    // 确定修改
    handleFormSubmit() {
      let data = {}
      for (const index in this.form) {
        if (this.form.hasOwnProperty(index)) {
          data[index] = this.form[index].value
        }
      }

      let source = {}
      for (const item of this.source) {
        source[item.key] = item.value
      }

      this.loading = true
      data['source'] = JSON.stringify(source)

      setShoppingList(data)
        .then(() => {
          this.$message.success('操作成功')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
  .dynamic-source-key {
    margin-right: 10px;
    width: 120px;
  }

  .dynamic-source-value {
    margin-right: 10px;
    width: 190px;
  }
</style>
