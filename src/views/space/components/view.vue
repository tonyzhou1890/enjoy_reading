<template>
  <el-dialog :width="'700px'" :visible="visible" :title="title" :before-close="handleBeforeClose">
    <el-form ref="form" :model="item" label-width="80px" size="mini" width="900px">
      <!-- 书名 -->
      <el-form-item label="书名">
        <el-row
          v-text="item.name"
        />
      </el-form-item>
      <!-- 位置 -->
      <el-form-item label="位置">
        <el-row
          v-text="item.position === 1 ? '个人空间' : item.positon === 2 ? '书城' : ''"
        />
      </el-form-item>
      <!-- 书号 -->
      <el-form-item label="书号">
        <el-row
          v-text="item.ISBN"
        />
      </el-form-item>
      <!-- 作者 -->
      <el-form-item label="作者">
        <el-row
          v-text="item.author.join('、')"
        />
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="标签">
        <el-row
          v-text="item.tag.join('、')"
        />
      </el-form-item>
      <!-- 是否免费 -->
      <el-form-item label="是否免费">
        <el-row
          v-text="item.free === 0 ? '收费' : item.free === 1 ? '免费' : ''"
        />
      </el-form-item>
      <!-- 积分 -->
      <el-form-item v-if="!item.free" label="积分">
        <el-row
          v-text="item.score"
        />
      </el-form-item>
      <!-- 是否打折 -->
      <el-form-item v-if="!item.free" label="是否打折">
        <el-row
          v-text="item.discount === 0 ? '不打折' : item.discount === 1 ? '打折' : ''"
        />
      </el-form-item>
      <!-- 折后积分 -->
      <el-form-item v-if="!item.free && item.discount" label="折后积分">
        <el-row
          v-text="item.discountScore"
        />
      </el-form-item>
      <!-- 封面 -->
      <el-form-item label="封面">
        <el-image
          v-if="item.frontCoverPath"
          style="width: 100px; height: 140px;"
          :src="item.frontCoverPath"
          :preview-src-list="[item.frontCoverPath]"
        />
      </el-form-item>
      <!-- 封底 -->
      <el-form-item label="封底">
        <el-image
          v-if="item.backCoverPath"
          style="width: 100px; height: 140px;"
          :src="item.backCoverPath"
          :preview-src-list="[item.backCoverPath]"
        />
      </el-form-item>
      <!-- 简介 -->
      <el-form-item label="简介">
        <el-row
          v-text="item.summary"
        />
      </el-form-item>
    </el-form>
    <!-- 页脚 -->
    <el-row slot="footer" class="dialog-footer">
      <el-button @click="handleBeforeClose">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { fileToBase64 } from '@/utils/file'
export default {
  name: 'ViewBook',
  props: {
    // 标题
    title: {
      type: String,
      default: '查看'
    },
    // 是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 取消
    cancel: {
      type: Function,
      required: true
    }
  },
  data() {
    const defaultItem = {
      uuid: undefined,
      name: '',
      type: 1,
      position: 1,
      ISBN: '',
      author: [],
      tag: [],
      frontCoverPath: '',
      backCoverPath: '',
      free: 0,
      score: 0,
      discount: 0,
      discountScore: 0,
      summary: '',
      text: [],
      previewText: ''
    }
    return {
      // 默认书籍信息
      defaultBook: JSON.parse(JSON.stringify(defaultItem)),
      item: JSON.parse(JSON.stringify(defaultItem))
    }
  },
  created() {
    // this.getTagList()
    // this.getAuthorList()
  },
  methods: {
    // 父组件调用此方法传入数据
    setData(item = this.defaultBook) {
      this.item = JSON.parse(JSON.stringify(item))
    },
    // 关闭回调
    handleBeforeClose() {
      this.cancel()
    },
    // 重置表单
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    // 清除验证
    clearValidate() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    // 封面/封底change
    handleBookImageChange(file, fileList, key) {
      fileToBase64(file.raw)
        .then(res => {
          this.item[key].push({
            name: file.name,
            url: res,
            id: file.uid,
            raw: file.raw
          })
          this.$refs.form.validateField(key)
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    // 封面/封底移除
    handleBookImageRemove(file, fileList, key) {
      const temp = this.item[key].filter(img => img.id !== file.id)
      this.item[key] = temp
      this.$refs.form.validateField(key)
    }
  }
}
</script>

<style lang="less" scoped>
.preview {
  max-height: 130px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  background: seashell;
}
</style>
