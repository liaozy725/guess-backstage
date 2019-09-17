<template>
  <div class="upload-container">
    <el-upload action='' :http-request="httpRequest" :disabled="disabled" :limit="limit" :drag="drag" :show-file-list="showFileList" :multiple="multiple" :accept="accept" :file-list="fileList" :on-exceed='onExceed'>
      <!-- <slot></slot> -->
      <i class="iconfont icon-tianjia-"></i>
    </el-upload>
    <div class="uploading" v-if="showLoading && uploading">

    </div>
  </div>
</template>

<script>
import OSS from 'ali-oss'
export default {
  props: {
    // 接受上传的文件类型 audio/*   video/*  image/*
    accept: {
      type: String,
      default: ''
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: null
    },
    // 是否显示上传文件列表
    showFileList: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否拖拽上传
    drag: {
      type: Boolean,
      default: false
    },
    // 是否显示文件上传遮罩层
    showLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commonParams: {
        uploadType: 'image',
        uploadDir: 'merchant',
        uploadImage: 'merchant'
      },
      uploading: false,
      fileList: [],
      returnArr: [],
      ossSign: {}
    }
  },
  created() {
    this.initOss();
  },
  methods: {
    initOss() {
      this.$http.post('common/alioss/get_sign').then(res => {
        if(res.retCode==0){
          this.ossSign = res.data;
        }
      });
    },
    // 随机生成字符串
    randomString(e) {
      e = e || 6;
      var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
      for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
      return n
    },
    // 上传文件 获取凭证
    httpRequest(file) {
      this.uploadFile(file, this.ossSign)
    },
    // 上传文件
    uploadFile(file, res) {
      var client = new OSS({
        accessKeyId: res.accessid,
        accessKeySecret: 'asditDlr12axrE45ydA5xb9qTpeQh3',
        success_action_status: '200',
        callback: res.callback,
        signature: res.signature,
        bucket: 'ipfsoss'
      });
      var fileName = Date.parse(new Date());
      var randStr = this.randomString(6);
      var arr = file.file.name.split('.');
      client.put(res.dir + fileName + randStr + '.' + arr[arr.length - 1], file.file).then(res => {
        console.log("图片上传完成",res);
        
        this.uploading = false;
        this.uploadEnd(res)
      })
    },
    // 上传完成回调
    uploadEnd(res) {
      this.$emit('uploadSuccess', res);
    },
    // 文件超出个数限制时的钩子
    onExceed(fileList) {
      this.$message({
        message: "最多只能上传" + this.limit + "张图片",
        type: 'warning',
        duration: 1200
      });
    }
  }
}

</script>

<style scoped>
.uploading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}
>>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}
>>> .el-upload:hover {
  border-color: #409eff;
}
>>> .el-upload .iconfont{
  font-size: 38px;
  position: absolute;
  top: 50%;
  left: 50%;
  color: #d9d9d9;
  transform: translate(-50%,-50%);
}

>>> .el-upload:hover .iconfont{
  color: #409eff;
}
</style>
