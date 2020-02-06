<template>
  <div class="upload-container">
    <el-upload action='' :http-request="httpRequest" :with-credentials="true" :list-type="listType" :disabled="disabled" :limit="limit" :drag="drag" :show-file-list="showFileList" :multiple="multiple" :accept="accept" :file-list="fileList" :on-exceed='onExceed' :on-success="onSuccess" :on-remove="onRemove">
      <!-- <img :src="imgUrl" v-if="(!limit || limit == 1) && imgUrl" alt=""> -->
      <i class="el-icon-plus"></i>
    </el-upload>
    <div class="uploading" v-if="showLoading && uploading">

    </div>
  </div>
</template>

<script>
import { log } from 'util';
// import OSS from 'ali-oss'
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
      default: true
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
    },
    // 
    listType:{
      type:String,
      default:'text'
    },
    // 已上传的文件列表  文件回填
    fileListData:{
      type: Array,
      default:()=>{
        return [];
      }
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
      ossSign: {},
      imgUrl:''
    }
  },
  created() {
    this.initOss();
    this.fileList = this.fileListData;
  },
  methods: {
    initOss() {
      this.$http.post('common/alioss/distribute_token').then(res => {
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
      var client = new OSS.Wrapper({
        region:'oss-cn-hongkong',
        accessKeyId: res.accessKeyId,
        accessKeySecret: res.accessKeySecret,
        success_action_status: '200',
        stsToken:res.securityToken,
        bucket: 'ipfsoss'
      });
      // 生成图片名字 时间戳 + 随即字符串
      var fileName = Date.parse(new Date());
      var randStr = this.randomString(6);
      var arr = file.file.name.split('.');

      client.multipartUpload('jingcai/'+fileName + randStr + '.' + arr[arr.length - 1],file.file).then(rst=>{
        this.uploading = false;
        file.onSuccess(rst.res);
      }).catch(err=>{
        file.onError()
        this.$message({
          message: "图片上传失败",
          type: 'error'
        });
      })
    },
    // 上传完成回调
    uploadEnd(res) {
      
    },
    // element 上传成功
    onSuccess(response, file, fileList){
      if(!this.limit || this.limit==1){
        this.imgUrl = response.requestUrls[0];
      }
      this.$emit('uploadSuccess', response.requestUrls);
    },
    // 文件移除回调
    onRemove(file, fileList){
      this.$emit('uploadRemove', {file,fileList});
    },
    // 文件超出个数限制时的钩子
    onExceed(fileList) {
      this.$message({
        message: "最多只能上传" + this.limit + "张图片",
        type: 'warning',
        duration: 1200
      });
    }
  },
  watch:{
    fileListData(newV){
      this.fileList = newV;
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
</style>
