<template>
  <cs-container :is-back-to-top="true">
    <page-main
      ref="main"
      :loading="loading"
      :table-data="table"
      :unread-data="unread"
      :type-data="type"
      @sort="handleSort"
      @minus="minusUnread"
      @submit="handleSubmit"/>

    <page-footer
      slot="footer"
      :loading="loading"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
  </cs-container>
</template>

<script>
import { getMessageType } from '@/api/public'
import { getMessageUserList } from '@/api/message/message'

export default {
  name: 'system-message-user',
  components: {
    'PageMain': () => import('./components/PageMain'),
    'PageFooter': () => import('@/layout/header-aside/components/footer')
  },
  data() {
    return {
      loading: true,
      table: [],
      unread: {},
      type: [],
      page: {
        current: 1,
        size: 25,
        total: 0
      },
      order: {
        order_type: undefined,
        order_field: undefined
      }
    }
  },
  mounted() {
    getMessageType()
      .then(res => {
        this.type.unshift({
          name: '全部消息',
          value: 'total'
        })

        for (const index in res) {
          if (!res.hasOwnProperty(index)) {
            continue
          }

          this.type.push({
            name: res[index],
            value: index
          })
        }
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  methods: {
    // 分页变化改动
    handlePaginationChange(val) {
      this.page = val
      this.$nextTick(() => {
        this.handleSubmit()
      })
    },
    // 排序刷新
    handleSort(val) {
      this.order = val
      this.$nextTick(() => {
        this.handleSubmit()
      })
    },
    // 提交查询请求
    handleSubmit(isRestore = false, isOrder = false) {
      if (isRestore) {
        this.page.current = 1
      }

      if (isOrder) {
        this.order = { order_type: undefined, order_field: undefined }
      }

      this.loading = true
      const form = this.$refs.main ? this.$refs.main.form : {}

      getMessageUserList({
        ...form,
        ...this.order,
        is_unread: 1,
        page_no: this.page.current,
        page_size: this.page.size
      })
        .then(res => {
          this.page.total = res.data.total_result
          this.table = res.data.total_result > 0 ? res.data.items : []
          this.unread = res.data.unread_count || {}
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 减少已读数
    minusUnread(key, total) {
      const newKey = ['total', key]
      newKey.forEach(value => {
        if (this.unread.hasOwnProperty(value)) {
          this.unread[value] = (this.unread[value] - total) <= 0 ? 0 : this.unread[value] - total
        }
      })
    }
  }
}
</script>