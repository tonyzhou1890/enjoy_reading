<template>
  <el-dialog :width="'700px'" :visible="visible" :title="title" :before-close="handleBeforeClose">
    <el-form ref="form" :model="item" :rules="rules" label-width="80px" size="mini" width="900px">
      <!-- 书名 -->
      <el-form-item label="书名" prop="name">
        <el-input
          v-model="item.name"
          placeholder="请输入书名"
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
      <!-- 位置 -->
      <el-form-item label="位置">
        <el-radio-group v-model="item.position">
          <el-radio-button :label="1">个人空间</el-radio-button>
          <el-radio-button :label="2">书城</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 书号 -->
      <el-form-item label="书号" prop="ISBN">
        <el-input
          v-model="item.ISBN"
          placeholder="请输入书号"
          maxlength="13"
          show-word-limit
        />
      </el-form-item>
      <!-- 作者 -->
      <el-form-item label="作者" prop="author">
        <el-select
          v-model="item.author"
          multiple
          filterable
          allow-create
          default-first-option
          :multiple-limit="5"
          placeholder="请选择/输入作者"
        >
          <el-option v-for="author in authorList" :key="author.uuid" :label="author.name" :value="author.name" />
        </el-select>
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="标签" prop="tag">
        <el-select
          v-model="item.tag"
          multiple
          filterable
          allow-create
          default-first-option
          :multiple-limit="5"
          placeholder="请选择/输入标签"
        >
          <el-option v-for="tag in tagList" :key="tag.uuid" :label="tag.tag" :value="tag.tag" />
        </el-select>
      </el-form-item>
      <!-- 是否免费 -->
      <el-form-item label="是否免费">
        <el-radio-group v-model="item.free">
          <el-radio-button :label="0">收费</el-radio-button>
          <el-radio-button :label="1">免费</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 积分 -->
      <el-form-item v-if="!item.free" label="积分">
        <el-input-number
          v-model="item.score"
          :min="0"
          :max="100"
          :precision="0"
          placeholder="请输入积分(0-100)"
        />
      </el-form-item>
      <!-- 是否打折 -->
      <el-form-item v-if="!item.free" label="是否打折">
        <el-radio-group v-model="item.discount">
          <el-radio-button :label="0">不打折</el-radio-button>
          <el-radio-button :label="1">打折</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 折后积分 -->
      <el-form-item v-if="!item.free && item.discount" label="折后积分">
        <el-input-number
          v-model="item.discountScore"
          :min="0"
          :max="100"
          :precision="0"
          placeholder="请输入积分(0-100)"
        />
      </el-form-item>
      <!-- 封面 -->
      <el-form-item label="封面" prop="frontCover">
        <el-upload
          action="http://tony93.top"
          :span="11"
          list-type="picture-card"
          :auto-upload="false"
          :limit="1"
          :file-list="item.frontCover"
          :on-change="(file, fileList) => handleBookImageChange(file, fileList, 'frontCover')"
          :on-remove="(file, fileList) => handleBookImageRemove(file, fileList, 'frontCover')"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <!-- 封底 -->
      <el-form-item label="封底" prop="backCover">
        <el-upload
          action="http://tony93.top"
          :span="11"
          list-type="picture-card"
          :auto-upload="false"
          :limit="1"
          :file-list="item.backCover"
          :on-change="(file, fileList) => handleBookImageChange(file, fileList, 'backCover')"
          :on-remove="(file, fileList) => handleBookImageRemove(file, fileList, 'backCover')"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <!-- 简介 -->
      <el-form-item label="简介" prop="summary">
        <el-input
          v-model="item.summary"
          type="textarea"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
      <!-- 正文 -->
      <el-form-item v-if="!item.uuid" label="正文" prop="text">
        <el-upload
          action="http://tony93.top"
          :span="11"
          :auto-upload="false"
          :limit="1"
          :file-list="item.text"
          :on-change="(file, fileList) => handleBookTextChange(file, fileList)"
          :on-remove="(file, fileList) => handleBookTextRemove(file, fileList)"
        >
          <el-button
            type="primary"
          >选择文件</el-button>
        </el-upload>
      </el-form-item>
      <!-- 预览 -->
      <el-form-item v-if="item.previewText" label="预览">
        <pre class="preview">{{ item.previewText }}</pre>
      </el-form-item>
    </el-form>
    <!-- 页脚 -->
    <el-row slot="footer" class="dialog-footer">
      <el-button @click="handleBeforeClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getAuthorList } from '@/api/home'
import { valiFileType, valiFileSize } from '@/utils/validate'
import { fileToBase64, fileToText } from '@/utils/file'
import { picTypes } from '@/utils/setting'
export default {
  name: 'AddBook',
  props: {
    // 标题
    title: {
      type: String,
      default: '新增'
    },
    // 是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 保存 loading
    loading: {
      type: Boolean,
      default: false
    },
    // 保存
    save: {
      type: Function,
      required: true
    },
    // 取消
    cancel: {
      type: Function,
      required: true
    }
  },
  data() {
    // 验证 ISBN
    const valiISBN = (rule, value, callback) => {
      if (/^[0-9-]*$/.test(value)) {
        callback()
      } else {
        callback(new Error('只能是数字和"-"'))
      }
    }
    // 作者/标签 验证
    const valiAuthorOrTag = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('必填'))
      } else if (value.some(item => item.length > 20)) {
        callback(new Error('每个选项不能超过20个字符'))
      } else {
        callback()
      }
    }
    // 验证封面/封底
    const valiPic = (rule, value, callback) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        callback()
      } else if (Array.isArray(value)) {
        if (value.every(item => item.url.startsWith('http') || (valiFileType(item.raw, picTypes)) && valiFileSize(item.raw, 128))) {
          callback()
        } else {
          callback(new Error(`需要小于128K的${picTypes.join('、')}格式图片`))
        }
      } else {
        callback()
      }
    }
    // 验证文本
    const valiText = (rule, value, callback) => {
      if (!value.every(item => valiFileType(item.raw, ['plain']))) {
        callback(new Error('需要是txt格式的文件'))
      } else if (value.some(item => item.url.length > 3000000)) {
        callback(new Error('文本最多300万字'))
      } else {
        callback()
      }
    }
    return {
      // 默认书籍信息
      defaultBook: {
        uuid: undefined,
        name: '',
        type: 1,
        position: 1,
        ISBN: '',
        author: [],
        tag: [],
        frontCover: [],
        backCover: [],
        free: 0,
        score: 0,
        discount: 0,
        discountScore: 0,
        summary: '',
        text: [],
        previewText: ''
      },
      item: {},
      // tagList: [],
      authorList: [],
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        ISBN: [
          { validator: valiISBN, trigger: 'blur' }
        ],
        author: [
          { required: true, validator: valiAuthorOrTag, trigger: 'change' }
        ],
        tag: [
          { required: true, validator: valiAuthorOrTag, trigger: 'change' }
        ],
        frontCover: [
          { required: false, validator: valiPic }
        ],
        backCover: [
          { required: false, validator: valiPic }
        ],
        summary: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        text: [
          { required: true, message: '必填' },
          { validator: valiText }
        ]
      }
    }
  },
  computed: {
    tagList() {
      return this.$store.state.app.tagList || []
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
      this.getTagList()
      this.getAuthorList()
    },
    // 关闭回调
    handleBeforeClose() {
      this.cancel()
    },
    // 保存回调
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(JSON.parse(JSON.stringify(this.item)))
        } else {
          console.log('error submit')
          return false
        }
      })
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
    // 获取标签列表
    getTagList() {
      // getTagList()
      //   .then(res => {
      //     this.tagList = res.data
      //   })
      //   .catch(e => {
      //     this.$message.error(e.errorMsg)
      //   })
      this.$store.dispatch('app/getTagList')
    },
    // 获取作者列表
    getAuthorList() {
      getAuthorList()
        .then(res => {
          this.authorList = res.data
        })
        .catch(e => {
          this.$message.error(e.errorMsg)
        })
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
    },
    // 文本
    handleBookTextChange(file, fileList) {
      fileToText(file.raw)
        .then(res => {
          this.item.text.push({
            name: file.name,
            url: res,
            id: file.uid,
            raw: file.raw
          })
          this.item.previewText = res.slice(0, 1000)
          this.$refs.form.validateField('text')
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    // 文本移除
    handleBookTextRemove(file, fileList) {
      const temp = this.item.text.filter(text => text.id !== file.id)
      this.item.text = temp
      this.item.previewText = ''
      this.$refs.form.validateField('text')
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
