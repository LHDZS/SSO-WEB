<template>
  <div class="img-tailor">
    <!-- 弹出层-裁剪 -->
    <Modal title="编辑头像" v-model="dialogVisible" @on-cancel="handleClose" @on-ok="confirm('blob')" width="700">
      <span>
        <Row>
          <input
            ref="filElem"
            type="file"
            id="uploads"
            accept="image/png, image/jpeg, image/jpg"
            @change="uploadImg($event,1)"
            class="Button hide"
            style="margin-bottom:15px"
          />
          <!-- <div class="upload-img" @click="clickUpload">点击上传图片</div> -->
          <div><span style="color:red;">提示：</span>图片类型必须是jpeg,jpg,png中的一种且图片大小不能超过10M</div>
          <br>
        </Row>
        <Row>
          <Col :span="14">
            <!-- 裁剪 -->
            <vueCropper
              style="width:100%;height:300px"
              ref="cropper"
              :img="attach.customaryUrl"
              :autoCrop="options.autoCrop"
              :fixedBox="options.fixedBox"
              :canMoveBox="options.canMoveBox"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :centerBox="options.centerBox"
              @realTime="realTime"
            ></vueCropper>
          </Col>
          <Col :span="10" class="rightMain">
            <h2 class="mar-left-50">头像预览</h2>
            <div class="show-preview">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img" width="100%" />
              </div>
            </div>
          </Col>
        </Row>
        <!-- <Row class="footerBtn">
          <Button type="primary" size="small" round @click="confirm('blob')">确认</Button>
          <Button type="info" size="small" round @click="handleClose">取消</Button>
        </Row> -->
      </span>
    </Modal>
  </div>
</template>

<script>
import getTokenErrorHandler from "@/error/user/get-token-error-handler";

//数据库里需要存两份图片地址，一张为原图地址，一张为裁剪后的头像地址
export default {
  name: 'img-tailor',
  data() {
    return {
      dialogVisible: false,
      options: {
        autoCrop: true, //默认生成截图框
        fixedBox: true, //固定截图框大小
        canMoveBox: false, //截图框不能拖动
        centerBox: false, //截图框被限制在图片里面
        autoCropWidth:200,  //截图框宽度
        autoCropHeight:200, //截图框高度        
      },
      previews: {}, //实时预览图数据
      attach: {
        //后端附件表
        id: "",
        userId: "",
        customaryUrl: "", //原图片路径
        laterUrl: "", //裁剪后图片路径  /static/logo.png
        attachType: "photo" //附件类型
      },
      fileName: ''
    };
  },
  props:{
    
  },
  methods: {
    //控制弹出层关闭
    handleClose() {
      this.dialogVisible = false;
    },
    //实时预览
    realTime(data) {
      this.previews = data;
    },
    //点击图片调取input
    clickUpload(){
      this.$refs.filElem.dispatchEvent(new MouseEvent('click')) 
    },
    beforeUpload(file) {
      // console.log(file,'上传')
    },
    //选择本地图片
    uploadImg(e, num) {
      var tmpFile = document.getElementById('uploads');
      var file = e.target.files[0];
      var max_size = 10240;// 10M
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$Modal.error({
            title: '错误提示',
            content: '图片类型必须是jpeg,jpg,png中的一种'
        });
        tmpFile.value = "";
        return false;
      }
      var size = file.size;
      if (size > max_size * 1024) {
          this.$Modal.error({
              title: '错误提示',
              content: '图片大小不能超过10M'
          });
          tmpFile.value = "";
          return false
      }
      //fileReader 接口，用于异步读取文件数据
      var reader = new FileReader();
      this.fileName = file.name;
      reader.readAsDataURL(file); //重要 以dataURL形式读取文件
      reader.onload = e => {
        // data = window.URL.createObjectURL(new Blob([e.target.result])) 转化为blob格式
        let data = e.target.result;
        this.attach.customaryUrl = data;
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
      };
    },
    //确认截图,上传
    confirm(type) {
      this.$refs.cropper.getCropData(d => {
        // console.log(res)//这里截图后的url 是base64格式 让后台转下就可以
        let params = new FormData()
        // 拼接参数
        params.append('file', this.base64ToFile(d, this.fileName))
        this.$axios({
          headers:{'Content-Type':'multipart/form-data'},
          url: this.$server_address + '/file/uploadAvatar',
          method: 'post',
          data: params
        }).then(res => {
          this.$parent._data.userAvatar = d;
          this.dialogVisible = false;
        }).catch(err => {
          getTokenErrorHandler(err)
        });
        
        // console.log(this.base64ToFile(res),'用户头像')
      });
    },
    base64ToFile(urlData, fileName) {
      let arr = urlData.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bytes = atob(arr[1]); // 解码base64
      let n = bytes.length
      let ia = new Uint8Array(n);
      while (n--) {
          ia[n] = bytes.charCodeAt(n);
      }
      return new File([ia], fileName, { type: mime });
    }
  }
};
</script>
<style lang="less" scoped>
  #uploads {
    padding: 0;
    border: none;
  }
  .rightMain {
    text-align: center;
  }
  /* 弹性布局 水平居中 */
  .ivu-modal{
    width: 700px !important;
    height: auto;
  }
  .show-preview {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .preview {
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #cccccc;
    background: #cccccc;
    // width: 150px !important;
    // height: 150px !important;
  }
  .upload-img{
    width: 100px;
    height: 30px;
    border:1px solid #f08512;
    margin-bottom: 5px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .footerBtn {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
</style>