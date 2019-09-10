<template>
  <div>
    <el-upload list-type="picture-card" :http-request="httpRequest" ref="upload" :accept="accept" :headers="headers" :show-file-list="false" :action="upImgUrl" :multiple="multiple" :data="fileData" :before-upload="beforeAvatarUpload" :on-error="unloadError" :on-success="unloadSucceed" :on-change="uploadChange" >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import $vx from 'utils/vx'
import axios from 'axios'
export default {
  props:{
    multiple:{
      type:Boolean,
      default:false
    },
    isBreak:{
      type:Boolean,
      default:true
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    uploadType: {
      type: Number,
      default: null
    },

  },
  data() {
    return {
      headers: {}, //图片上传头部
      upImgUrl:'', //图片上传地址
      fileData: {}, //图片上传参数
      acceptObj:{1:'image/*',2:'video/*',3:'*/*'}, // 文件上传类型
      maxSize:1024*1024*1,
      percentage:0
    }
  },
  created() {
    this.upImgUrl = window.g.ApiUrl+'upload/FileUpload';
    this.headers['Authorization'] = $vx.localStorage.getItem('token'); //上传图片头部
  },
  methods: {
    // 自定义上传
    httpRequest(file){
      var formData = new FormData();
      file.headers["Content-Type"]='multipart/form-data';
      this.percentage=0;
      var _this = this;

      console.log(file.file)

      if(this.checkImg(file.file.type) && file.file.size > this.maxSize){
        console.log("压缩图片文件")
        this.compress(file.file, function(blob) {
          // Blob 格式文件转为 file 格式
          var newFile=new window.File([blob],file.file.name,{type: file.file.type});
          console.log(newFile)
          formData.append("file",newFile);
          
          axios.post(file.action,formData,{headers:file.headers,timeout:30*60*1000,onUploadProgress(ev){
            _this.percentage = parseInt((ev.loaded/ev.total)*100);
          }}).then(data=>{
            file.onSuccess(data);
          })
        })
      }else{
        formData.append("file",file.file);
        axios.post(file.action,formData,{headers:file.headers,timeout:30*60*1000,onUploadProgress(ev){
          _this.percentage = parseInt((ev.loaded/ev.total)*100);
        }}).then(data=>{
          file.onSuccess(data);
        })
      }
    },

    checkImg(_name){
      var name = _name;
      var index= name.indexOf("/"); //（考虑严谨用lastIndexOf(".")得到）得到"."在第几位
      name = name.substring(index); //截断"."之前的，得到后缀
      // console.log(name)
      if(name=="/bmp"||name=="/png"||name=="/gif"||name=="/jpg"||name=="/jpeg"){  //根据后缀，判断是否符合图片格式
         return true
      }
    },
    // 图片压缩
    compress(fileObj, callback) {
      let quality = 0.6 // 默认图片质量为0.7
      const _this = this;
      try {
        const image = new Image()
        image.src = URL.createObjectURL(fileObj);
        image.onload = function() {
          const that = this
          // 默认按比例压缩
          let w = that.width
          let h = that.height
          const scale = w / h
          w = fileObj.width || w
          h = fileObj.height || (w / scale)
          
          // 生成canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          // 创建属性节点
          const anw = document.createAttribute('width')
          anw.nodeValue = w
          const anh = document.createAttribute('height')
          anh.nodeValue = h
          canvas.setAttributeNode(anw)
          canvas.setAttributeNode(anh)
          ctx.drawImage(that, 0, 0, w, h)
          // 图像质量
          
          if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
            quality = fileObj.quality
          }
          // quality值越小，所绘制出的图像越模糊
          const data = canvas.toDataURL('image/jpeg', quality)
          
          // 压缩完成执行回调
          const newFile = _this.convertBase64UrlToBlob(data)
          callback(newFile)
        }
      } catch (e) {
        console.log('压缩失败!')
      }
    },
    // 压缩图片转为blob 格式
    convertBase64UrlToBlob(urlData) {
      const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      const ab = new ArrayBuffer(bytes.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/png' })
    },
    // 上传前
    beforeAvatarUpload(file) {
      this.$emit('beforeUpload',file,this.uploadType)
      if(!this.isBreak) this.$message.error("只允许上传一张图片！！")
      return this.isBreak
    },
    // 上传
    uploadChange(file, fileList) {
      if (file.status == 'ready') {
      } else if (file.status == 'fail') {
        this.$message.error("图片上传出错，请重试！")
      }
    },
    // 上传失败
    unloadError(err) {
      console.log(err)
      this.$message.error("图片上传出错，请重试！")
    },
    // 上传成功
    unloadSucceed(res,file) {
      if(res.code===0){
        this.$emit('upload',res.data,file,this.percentage)
      }else{
        this.$message.error(res.message)
      }
    },
  },
}
</script>

<style scoped>

</style>
