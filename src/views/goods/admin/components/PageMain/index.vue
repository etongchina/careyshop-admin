<template>
  <div class="cs-p">
    <el-form :inline="true" size="small">
      <el-form-item v-if="tabPane !== 'delete' && auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增商品</el-button>
      </el-form-item>

      <el-form-item v-if="tabPane === 'stock' && auth.shelves">
        <el-button
          icon="el-icon-top"
          :disabled="loading"
          @click="handleStatus(null, 1)">上架</el-button>
      </el-form-item>

      <el-form-item v-if="tabPane === 'sale' && auth.shelves">
        <el-button
          icon="el-icon-bottom"
          :disabled="loading"
          @click="handleStatus(null, 0)">下架</el-button>
      </el-form-item>

      <el-form-item v-if="tabPane !== 'delete' && auth.recommend">
        <el-dropdown placement="bottom" :show-timeout="50">
          <el-button
            :disabled="loading">
            <i class="el-icon-medal"/>
            <span>推荐</span>
            <i class="el-icon-arrow-down cs-pl-5"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleRecommend(null, 1)">设为推荐</el-dropdown-item>
            <el-dropdown-item @click.native="handleRecommend(null, 0)">取消推荐</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <el-form-item v-if="tabPane !== 'delete' && auth.new">
        <el-dropdown placement="bottom" :show-timeout="50">
          <el-button
            :disabled="loading">
            <i class="el-icon-star-off"/>
            <span>新品</span>
            <i class="el-icon-arrow-down cs-pl-5"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleNew(null, 1)">设为新品</el-dropdown-item>
            <el-dropdown-item @click.native="handleNew(null, 0)">取消新品</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <el-form-item v-if="tabPane !== 'delete' && auth.hot">
        <el-dropdown placement="bottom" :show-timeout="50">
          <el-button
            :disabled="loading">
            <i class="el-icon-sunny"/>
            <span>热卖</span>
            <i class="el-icon-arrow-down cs-pl-5"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleHot(null, 1)">设为热卖</el-dropdown-item>
            <el-dropdown-item @click.native="handleHot(null, 0)">取消热卖</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button
            v-if="auth.del"
            icon="el-icon-delete"
            :disabled="loading"
            @click="handleDelete(null, true)">
            <span>{{tabPane === 'delete' ? '彻底删除' : '删除'}}</span>
          </el-button>

          <el-button
            v-if="tabPane === 'delete' && auth.restore"
            icon="el-icon-refresh-left"
            :disabled="loading"
            @click="handleDelete(null, false)">恢复</el-button>
        </el-button-group>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-tabs
      v-model="tabPane"
      @tab-click="handleClick"
      class="tab-box">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item"
        :name="index">
        <el-table
          v-if="index === tabPane"
          :data="currentTableData"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange">
          <el-table-column align="center" type="selection" width="55"/>

          <el-table-column
            v-if="tabPane === 'delete'"
            label="来源"
            align="center"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.status ? '出售中' : '已下架'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品"
            prop="goods_id"
            sortable="custom"
            min-width="380">
            <template slot-scope="scope">
              <div class="goods-summary cs-mb-5">
                <span class="cs-mr">商品货号：{{scope.row.goods_code}}</span>
                <span>创建日期：{{scope.row.create_time}}</span>
              </div>

              <el-image
                class="goods-image cs-cp"
                @click="handleView(scope.row.goods_id)"
                :src="scope.row.attachment | getPreviewUrl"
                fit="contain"
                lazy/>

              <div class="goods-info cs-ml">
                <p class="action">
                  <span
                    @click="handleView(scope.row.goods_id)"
                    :title="scope.row.name"
                    class="link">{{scope.row.name}}</span>

                    <i v-if="tabPane !== 'delete' && auth.set"
                       class="el-icon-edit goods-edit active"
                       @click="setGoodsName(scope.$index)"/>
                </p>

                <p class="action">
                  <span
                    :title="scope.row.product_name"
                    class="son">{{scope.row.product_name}}</span>

                  <i v-if="tabPane !== 'delete' && auth.set"
                     class="el-icon-edit goods-edit active"
                     @click="setGoodsProduct(scope.$index)"/>
                </p>

                <p>
                  <u v-for="(item, index) in goodsTab" :key="index">
                    <el-tag
                      v-if="scope.row[index]"
                      :type="item.type"
                      :disable-transitions="true"
                      class="cs-mr-10"
                      effect="dark"
                      size="mini">
                      {{item.name}}
                    </el-tag>
                  </u>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="本店价"
            prop="shop_price"
            sortable="custom">
            <template slot-scope="scope">
              <div class="action">
                <span class="goods-shop-price">{{scope.row.shop_price | getNumber}}</span>
                <i v-if="tabPane !== 'delete' && auth.price"
                   class="el-icon-edit-outline goods-edit active"
                   @click="setGoodsPriceOrStore(scope.$index, 'price')"/>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="库存"
            prop="store_qty"
            sortable="custom">
            <template slot-scope="scope">
              <div class="action">
                <span>{{scope.row.store_qty}}</span>
                <i v-if="tabPane !== 'delete' && auth.store"
                   class="el-icon-edit-outline goods-edit active"
                   @click="setGoodsPriceOrStore(scope.$index, 'store')"/>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="总销量"
            prop="sales_sum"
            sortable="custom">
          </el-table-column>

          <el-table-column
            label="排序值"
            prop="sort"
            align="center"
            sortable="custom"
            min-width="110">
            <template slot-scope="scope">
              <el-input-number
                v-if="tabPane !== 'delete' && auth.sort"
                v-model="scope.row.sort"
                style="width: 88px;"
                size="mini"
                controls-position="right"
                :min="0"
                :max="255"
                @change="handleSort(scope.$index)">
              </el-input-number>
              <span v-else>
                {{scope.row.sort}}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="goods-text">
                <p v-if="tabPane !== 'delete' && auth.set">
                  <el-link
                    class="button"
                    type="primary"
                    @click="handleEdit(scope.row.goods_id)"
                    :underline="false">编辑商品</el-link>
                </p>

                <p v-if="tabPane !== 'delete' && auth.copy">
                  <el-link
                    class="button"
                    type="primary"
                    @click="handleCopy(scope.row.goods_id)"
                    :underline="false">复制商品</el-link>
                </p>

                <p v-if="tabPane !== 'delete' && auth.shelves">
                  <el-link
                    class="button"
                    type="primary"
                    @click="handleStatus(scope.$index, Number(!scope.row.status))"
                    :underline="false">{{scope.row.status ? '下架' : '上架'}}</el-link>
                </p>

                <p v-if="auth.del">
                  <el-link
                    class="button"
                    type="primary"
                    @click="handleDelete(scope.$index, true)"
                    :underline="false">{{tabPane === 'delete' ? '彻底删除' : '删除'}}</el-link>
                </p>

                <p v-if="tabPane === 'delete' && auth.restore">
                  <el-link
                    class="button"
                    type="primary"
                    @click="handleDelete(scope.$index, false)"
                    :underline="false">恢复</el-link>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="商品名称"
      :visible.sync="nameFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        :model="nameForm"
        :rules="rules"
        ref="name"
        label-width="80px"
        label-position="left">
        <el-form-item
          label="名称"
          prop="name">
          <el-input
            v-model="nameForm.name"
            type="textarea"
            :rows="6"
            placeholder="请输入商品名称"
            maxlength="200"
            show-word-limit
            ref="nameInput"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="nameFormVisible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="handleSetName"
          size="small">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="商品促销名"
      :visible.sync="productFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        :model="productForm"
        :rules="rules"
        ref="product"
        label-width="80px"
        label-position="left">
        <el-form-item
          label="促销名"
          prop="product_name">
          <el-input
            v-model="productForm.product_name"
            type="textarea"
            :rows="5"
            placeholder="请输入商品促销名"
            maxlength="100"
            show-word-limit
            ref="productInput"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="productFormVisible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="handleSetProduct"
          size="small">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="typeMap[type]"
      :visible.sync="sellFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="850px">
      <el-table
        v-loading="sellLoading"
        :data="sellForm.spec_combo"
        style="margin-top: -25px;">
        <el-table-column
          label="规格"
          prop="key_value">
        </el-table-column>

        <el-table-column
          v-if="type === 'price'"
          label="本店价"
          align="center"
          prop="price"
          width="140">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.price"
              controls-position="right"
              size="mini"
              :disabled="!auth.price"
              :precision="2"
              :min="0">
            </el-input-number>
          </template>
        </el-table-column>

        <template v-if="type === 'store'">
          <el-table-column
            label="当前库存"
            prop="store_qty"
            width="120">
          </el-table-column>

          <el-table-column
            label="实际库存"
            prop="real_store"
            width="120">
            <template slot-scope="scope">
              {{scope.row.real_store}}
            </template>
          </el-table-column>

          <el-table-column
            label="增加/减少"
            align="center"
            prop="alter"
            width="140">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.alter"
                :disabled="!auth.store"
                controls-position="right"
                size="mini"
                @change="countRealStore(scope.row)">
              </el-input-number>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="sellFormVisible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="sellFormLoading"
          @click="handleGoodsPriceOrStore"
          size="small">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  copyGoodsItem,
  delGoodsList,
  setGoodsItem,
  setGoodsSort,
  setHotGoodsList,
  setNewGoodsList,
  setRecommendGoodsList,
  setShelvesGoodsList,
  getGoodsSpecList
} from '@/api/goods/goods'
import util from '@/utils/util'
import { mapActions } from 'vuex'

export default {
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    tabsConfig: {
      default: () => {}
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      auth: {
        add: false,
        set: false,
        del: false,
        restore: false,
        copy: false,
        shelves: false,
        recommend: false,
        new: false,
        hot: false,
        sort: false,
        price: false,
        store: false
      },
      tabPane: 'sale',
      tabList: { 'sale': '出售中', 'stock': '已下架', 'delete': '回收站' },
      goodsTab: {
        'is_postage': {
          'type': '',
          'name': '包邮'
        },
        'is_recommend': {
          'type': 'success',
          'name': '推荐'
        },
        'is_new': {
          'type': 'danger',
          'name': '新品'
        },
        'is_hot': {
          'type': 'warning',
          'name': '热卖'
        }
      },
      dialogLoading: false,
      nameForm: {},
      nameFormVisible: false,
      productForm: {},
      productFormVisible: false,
      sellForm: [],
      sellLoading: false,
      sellFormVisible: false,
      sellFormLoading: false,
      rules: {
        name: [
          {
            required: true,
            message: '商品名称不能为空',
            trigger: 'blur'
          },
          {
            max: 200,
            message: '长度不能大于 200 个字符',
            trigger: 'blur'
          }
        ],
        product_name: [
          {
            required: true,
            message: '商品促销名不能为空',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '长度不能大于 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      type: '',
      typeMap: {
        price: '修改价格',
        store: '修改库存'
      }
    }
  },
  filters: {
    getPreviewUrl(val) {
      if (Array.isArray(val) && val.length > 0) {
        if (val[0]['source']) {
          return util.getImageCodeUrl(val[0]['source'], 'goods_image_x80')
        }
      }

      return ''
    },
    getNumber(val) {
      return util.getNumber(val)
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
        this.multipleSelection = []
      },
      immediate: true
    }
  },
  activated() {
    this.updateChange({
      name: 'goods-admin-list',
      source: this.currentTableData,
      key: 'goods_id'
    })
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    ...mapActions('careyshop/update', [
      'updateChange'
    ]),
    // 验证权限
    _validationAuth() {
      this.auth.add = this.$permission('/goods/admin/list/add')
      this.auth.set = this.$permission('/goods/admin/list/set')
      this.auth.del = this.$permission('/goods/admin/list/del')
      this.auth.restore = this.$permission('/goods/admin/list/restore')
      this.auth.copy = this.$permission('/goods/admin/list/copy')
      this.auth.shelves = this.$permission('/goods/admin/list/shelves')
      this.auth.recommend = this.$permission('/goods/admin/list/recommend')
      this.auth.new = this.$permission('/goods/admin/list/new')
      this.auth.hot = this.$permission('/goods/admin/list/hot')
      this.auth.sort = this.$permission('/goods/admin/list/sort')
      this.auth.price = this.$permission('/goods/admin/list/price')
      this.auth.store = this.$permission('/goods/admin/list/store')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.goods_id)
        })
      } else {
        idList.push(this.currentTableData[val].goods_id)
      }

      return idList
    },
    // 点击切换标签
    handleClick(tab) {
      let config = { status: 1, is_delete: 0 }
      switch (tab.name) {
        case 'stock':
          config.status = 0
          break

        case 'delete':
          config.is_delete = 1
          break
      }

      this.$emit('tabs', config)
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取排序字段
    sortChange({ column, prop, order }) {
      let sort = {
        order_type: undefined,
        order_field: undefined
      }

      if (column && order) {
        sort.order_type = order === 'ascending' ? 'asc' : 'desc'
        sort.order_field = prop
      }

      this.$emit('sort', sort)
    },
    // 打开商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 批量设置上下架状态
    handleStatus(val, status) {
      let goods_id = this._getIdList(val)
      if (goods_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setShelvesGoodsList(goods_id, status)
            .then(() => {
              util.deleteDataList(this.currentTableData, goods_id, 'goods_id')
              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 批量设置是否推荐
    handleRecommend(val, isRecommend) {
      let goods_id = this._getIdList(val)
      if (goods_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setRecommendGoodsList(goods_id, isRecommend)
            .then(() => {
              this.currentTableData.forEach((value, index) => {
                if (goods_id.indexOf(value.goods_id) !== -1) {
                  this.$set(this.currentTableData, index, {
                    ...value,
                    is_recommend: isRecommend
                  })
                }
              })

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 批量设置是否新品
    handleNew(val, isNew) {
      let goods_id = this._getIdList(val)
      if (goods_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setNewGoodsList(goods_id, isNew)
            .then(() => {
              this.currentTableData.forEach((value, index) => {
                if (goods_id.indexOf(value.goods_id) !== -1) {
                  this.$set(this.currentTableData, index, {
                    ...value,
                    is_new: isNew
                  })
                }
              })

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 批量设置是否热卖
    handleHot(val, isHot) {
      let goods_id = this._getIdList(val)
      if (goods_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setHotGoodsList(goods_id, isHot)
            .then(() => {
              this.currentTableData.forEach((value, index) => {
                if (goods_id.indexOf(value.goods_id) !== -1) {
                  this.$set(this.currentTableData, index, {
                    ...value,
                    is_hot: isHot
                  })
                }
              })

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 批量删除或恢复
    handleDelete(val, isDelete) {
      let goods_id = this._getIdList(val)
      if (goods_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let status = null
          switch (this.tabPane) {
            case 'sale':
            case 'stock':
              status = 1
              break

            case 'delete':
              status = isDelete ? 2 : 0
              break
          }

          delGoodsList(goods_id, status)
            .then(() => {
              util.deleteDataList(this.currentTableData, goods_id, 'goods_id')
              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 设置排序值
    handleSort(index) {
      setGoodsSort(
        this.currentTableData[index].goods_id,
        this.currentTableData[index].sort
      )
    },
    // 复制一个商品
    handleCopy(goods_id) {
      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          copyGoodsItem(goods_id)
            .then(res => {
              this.currentTableData.unshift({
                ...res.data,
                sales_sum: 0,
                comment_sum: 0
              })

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 修改商品名称对话框
    setGoodsName(val) {
      const data = this.currentTableData[val]
      this.nameForm = {
        goods_id: data.goods_id,
        name: data.name,
        index: val
      }

      this.dialogLoading = false
      this.nameFormVisible = true

      this.$nextTick(() => {
        this.$refs.name.clearValidate()
        this.$refs.nameInput.select()
      })
    },
    // 请求修改商品名称
    handleSetName() {
      this.$refs.name.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const index = this.nameForm.index

          setGoodsItem({ ...this.nameForm })
            .then(() => {
              this.currentTableData[index].name = this.nameForm.name
              this.nameFormVisible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    // 修改商品促销名
    setGoodsProduct(val) {
      const data = this.currentTableData[val]
      this.productForm = {
        goods_id: data.goods_id,
        product_name: data.product_name,
        index: val
      }

      this.dialogLoading = false
      this.productFormVisible = true

      this.$nextTick(() => {
        this.$refs.product.clearValidate()
        this.$refs.productInput.select()
      })
    },
    // 请求修改商品促销名
    handleSetProduct() {
      this.$refs.product.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const index = this.productForm.index

          setGoodsItem({ ...this.productForm })
            .then(() => {
              this.currentTableData[index].product_name = this.productForm.product_name
              this.productFormVisible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    // 计算实际库存
    countRealStore(value) {
      value.real_store = value.store_qty + value.alter
    },
    // 修改商品价格或库存
    setGoodsPriceOrStore(index, type) {
      this.sellForm = []
      this.sellLoading = true
      this.sellFormVisible = true
      this.sellFormLoading = false
      this.type = type

      let specCombo = []
      const data = this.currentTableData[index]

      getGoodsSpecList(data.goods_id)
        .then(res => {
          if (res.data) {
            for (let key in res.data) {
              if (!res.data.hasOwnProperty(key)) {
                continue
              }

              specCombo.push({
                ...res.data[key],
                alter: 0,
                real_store: res.data[key]['store_qty']
              })
            }
          } else {
            specCombo.push({
              key_value: '-',
              price: data.shop_price,
              store_qty: data.store_qty,
              alter: 0,
              real_store: data.store_qty
            })
          }

          this.sellForm = {
            goods_id: data.goods_id,
            spec_combo: specCombo,
            empty_spec: res.data == null,
            index
          }
        })
        .finally(() => {
          this.sellLoading = false
        })
    },
    // 请求修改价格或库存
    handleGoodsPriceOrStore() {
      const data = this.sellForm.spec_combo
      let formData = { goods_id: this.sellForm.goods_id }

      if (this.sellForm.empty_spec) {
        formData['shop_price'] = data[0]['price']
        formData['store_qty'] = data[0]['real_store']
      } else {
        formData['spec_combo'] = []
        data.forEach(value => {
          formData['spec_combo'].push({
            ...value,
            store_qty: value['real_store']
          })
        })
      }

      this.sellFormLoading = true
      setGoodsItem(formData)
        .then(res => {
          this.$set(
            this.currentTableData,
            this.sellForm.index,
            {
              ...this.currentTableData[this.sellForm.index],
              ...res.data
            }
          )

          this.sellFormVisible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.sellFormLoading = false
        })
    },
    // 新增商品
    handleCreate() {
      this.$router.push({
        name: 'goods-admin-create'
      })
    },
    // 编辑商品
    handleEdit(key) {
      this.$router.push({
        name: 'goods-admin-update',
        params: {
          goods_id: key
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    padding: 5px 10px;
    background-color: #FFF;
  }

  .el-table /deep/ td {
    background-color: #FFFFFF !important;
  }

  .goods-summary {
    color: $color-text-placehoder;
    font-size: 13px;
  }

  .goods-shop-price {
    color: $color-danger;
  }

  .goods-image {
    float: left;
    width: 80px;
    height: 80px;
  }

  .goods-info {
    float: left;
    width: 70%;

    .son {
      color: $color-text-sub;
      font-size: 13px;
    }

    p {
      margin: 0;

      .link {
        &:hover {
          cursor: pointer;
          color: $color-primary;
          text-decoration: underline;
        }
      }
    }
  }

  .active {
    display: none;
  }

  .action:hover .active {
    display: inline;
  }

  .goods-edit {
    padding-left: 5px;
    font-size: 13px;
    color: $color-info;

    &:hover {
      cursor: pointer;
      color: $color-primary;
    }
  }

  .goods-text {
    p {
      margin: 0;
    }

    .button {
      padding: 0;
      font-size: 13px;
    }
  }
</style>
