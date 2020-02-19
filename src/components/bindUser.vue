<template>
    <div id="bg">
        <div id="hint"><!-- 提示框 -->
            <p>登录失败</p>
        </div>
        <div id="login_wrap">
            <div class="login"><!-- 登录注册切换动画 -->
                <div id="status" style="font-size: 20px">
                    <i style="top: 0">{{userRole}}</i>
                  <!--  <i style="top: 35px">医生</i>-->
                    <i style="right: 5px">绑定</i>
                </div>
                <span style="margin-left: -125px">
                   <el-form :rules="rules" ref="form" :model="form" label-width="0px">
                    <el-form-item  prop="name" style="height: 55px">
                          <p class="form">
                         <el-input v-model="form.name" placeholder="姓名"></el-input>
                         </p>
                    </el-form-item>

                    <el-form-item  prop="phone" style="height: 55px">
                            <p class="form">
                            <el-input v-model="form.phone" placeholder="手机号"></el-input>
                            </p>
                    </el-form-item>

                            <!-- <p class="form"><input type="password" id="passwd" placeholder="password"></p>-->
                            <!-- <p class="form confirm"><input type="password" id="confirm-passwd" placeholder="confirm password"></p>-->
                        <el-button :disabled="disable" v-loading="loading" type="button" value="绑定" class="btn" @click="login('form')">
                            {{subMsg}}
                        </el-button>
                        </el-form>
                        <!-- <input type="button" value="Log in" class="btn" onclick="login()" style="margin-right: 20px;">-->

                  <!--  <a href="#">Forget your password?</a>-->
                </span>
            </div>

            <div id="login_img"><!-- 图片绘制框 -->
                <span class="circle">
                    <span></span>
                    <span></span>
                </span>
                <span class="star">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                <span class="fly_star">
                    <span></span>
                    <span></span>
                </span>
                <p id="title">CLOUD</p>
            </div>
        </div>
    </div>
</template>
<script>
    import gql from 'graphql-tag';
    export default {
        name: '',
        data() {
            return {
                rules:{
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    phone:[
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ]
                },
                form:{},
                username: '',
                onoff:true,
                userRole:"患者",
                loading:false,
                disable:false,
                subMsg:"绑定",
                openid:"",
                roleKey:1,
            };
        },
        methods:{
            //登录按钮
             login(ruleForm) {
                 this.loading = true;
                 if (this.openid != ''){
                     this.$refs[ruleForm].validate(async(valid) => {
                         if (valid) {
                             //bindDoctorAndPatient(role:${this.pageNumber},page_size:${this.pageSize})
                             try {
                                 const response = await this.$apollo.mutate({
                                     mutation: gql`mutation(
                                  $role: Int!
                                  $mobile: String!
                                  $openid: String!
                                ){
                                  bindDoctorAndPatient(
                                    role: $role,
                                    mobile: $mobile,
                                    openid: $openid
                                  )
                                }`,
                                     variables: {
                                         role: this.roleKey,
                                         mobile:this.form.phone,
                                         openid:this.openid
                                     },
                                 });
                                 this.$notify({
                                     title: '绑定成功',
                                     message: '请退出该页面',
                                     type: 'success'
                                 });
                                 this.subMsg = "绑定成功"
                                 this.disable = true;
                             }catch (e) {
                                 let message = e.message.split(":")[1];
                                 this.$message.error(message);
                             }
                             this.loading = false;
                         } else {
                             this.loading = false;
                         }
                     });
                 } else {
                     this.$message.error("获取id失败请重新进入页面");
                 }

             },
                    // JS`正则表达式`获取地址栏url参数：
             getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg); // 匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; // 返回参数值
            },
                //引用hint()在最上方弹出提示
            async  hint() {
                 let param = this.$route.query
                console.log(this.getUrlParam('code'))

                let weCode = this.getUrlParam('code');

                this.$message.info(weCode);

                if (param.state =='pation'){
                    this.roleKey = 2
                }else if (param.state == 'doctor') {
                    this.roleKey = 1
                }

                 let variables = {code:weCode}
                 const res = await this.$apollo.query({
                     query: gql`query($code: String!){
                     getFWHCode(code: $code)
                   }`,
                     variables,
                 });
                if (res.data.getFWHCode != 'errcode'){
                    this.openid = res.data.getFWHCode
                }
                this.$message.info(res.data.getFWHCode);
            }

        },
        created(){
            this.hint();
        }
    }
</script>
<style scoped>
    @import "../assets/style/bindUserCss.css";
    *{
        margin: 0;
        padding: 0;
    }

    html,
    body {
        height: 100%;
    }


    input:focus{
        outline: none;
    }
    .form input{
        width: 300px;
        height: 30px;
        font-size: 18px;
        background: none;
        border: none;
        border-bottom: 1px solid #fff;
        color: #fff;
    }

    .form input::placeholder{
        color: rgba(255,255,255,0.8);
        font-size: 18px;
        font-family: "neo";
    }
    .confirm{
        height: 0;
        overflow: hidden;
        transition: .25s;
    }
    .btn{
        width:140px;
        height: 40px;
        border: 1px solid #fff;
        background: none;
        font-size:20px;
        color: #fff;
        cursor: pointer;
        margin-top: 25px;
        font-family: "neo";
        transition: .25s;
    }
    .btn:hover{
        background: rgba(255,255,255,.25);
    }
    #login_wrap{
        width: 980px;
        min-height: 500px;
        border-radius: 10px;
        font-family: "neo";
        overflow: hidden;
        box-shadow: 0px 0px 120px rgba(0, 0, 0, 0.25);
        position: fixed;
        top: 50%;
        right: 50%;
        margin-top: -250px;
        margin-right: -490px;
    }
    .login{
        width: 50%;
        height: 100%;
        min-height: 500px;
        background: linear-gradient(45deg, #abd3f1, #092e53);
        position: relative;
        float: right;
    }
    .login #status{
        width: 90px;
        height: 35px;
        margin: 40px auto;
        color: #fff;
        font-size: 30px;
        font-weight: 600;
        position: relative;
        overflow: hidden;
    }
    .login #status i{
        font-style: normal;
        position: absolute;
        transition: .5s
    }
    .login span{
        text-align: center;
        position: absolute;
        left: 50%;
      /*  margin-left: -150px;*/
        top: 52%;
        margin-top: -140px;
    }
    .login span a{
        text-decoration: none;
        color: #fff;
        display: block;
        margin-top: 80px;
        font-size: 18px;
    }
    #bg{
        background: linear-gradient(40deg,#0f61ae,#b0c7e5);
        height: 100%;
    }
    /*绘图*/
    #login_img{
        width: 50%;
        min-height: 500px;
        background: linear-gradient(45deg, #0e406e, #d0b6b6);
        float: left;
        position: relative;
    }
    #login_img span{
        position: absolute;
        display: block;
    }
    #login_img .circle{
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: linear-gradient(45deg, #df5555, #ef907a);
        top: 70px;
        left: 50%;
        margin-left: -100px;
        overflow: hidden;
    }
    #login_img .circle span{
        width: 150px;
        height: 40px;
        border-radius: 50px;
        position: absolute;
    }
    #login_img .circle span:nth-child(1){
        top: 30px;
        left: -38px;
        background: #c55c59;
    }
    #login_img .circle span:nth-child(2){
        bottom: 20px;
        right: -35px;
        background: #934555;
    }
    #login_img .star span{
        background: radial-gradient(#fff 10%,#fff 20%,rgba(72, 34, 64, 0));
        border-radius: 50%;
        box-shadow: 0 0 7px #fff;
    }
    #login_img .star span:nth-child(1){
        width: 15px;
        height: 15px;
        top: 50px;
        left: 30px;
    }
    #login_img .star span:nth-child(2){
        width: 10px;
        height: 10px;
        left: 360px;
        top: 80px;
    }
    #login_img .star span:nth-child(3){
        width: 5px;
        height: 5px;
        top: 400px;
        left: 80px;
    }
    #login_img .star span:nth-child(4){
        width: 8px;
        height: 8px;
        top: 240px;
        left: 60px;
    }
    #login_img .star span:nth-child(5){
        width: 4px;
        height: 4px;
        top: 20px;
        left: 200px;
    }
    #login_img .star span:nth-child(6){
        width: 4px;
        height: 4px;
        top: 460px;
        left: 410px;
    }
    #login_img .star span:nth-child(7){
        width: 6px;
        height: 6px;
        top: 250px;
        left: 350px;
    }
    #login_img .fly_star span{
        width: 90px;
        height: 3px;
        background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
        background: -o-linear-gradient(left, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
        background: linear-gradient(to right, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
        transform: rotate(-45deg);
    }
    #login_img .fly_star span:nth-child(1){
        top:60px;
        left: 80px;
    }
    #login_img .fly_star span:nth-child(2){
        top: 210px;
        left: 332px;
        opacity: 0.6;
    }
    #login_img p{
        text-align: center;
        color: #af4b55;
        font-weight: 600;
        margin-top: 365px;
        font-size: 25px;
    }
    #login_img p i{
        font-style: normal;
        margin-right: 45px;
    }
    #login_img p i:nth-last-child(1){
        margin-right: 0;
    }
    /*提示*/
    #hint{
        width: 100%;
        line-height: 70px;
        background: linear-gradient(-90deg, #9b494d, #bf5853);
        text-align: center;
        font-size: 25px;
        color: #fff;
        box-shadow: 0 0 20px #733544;
        display: none;
        opacity: 0;
        transition: .5s;
        position: absolute;
        top: 0;
        z-index: 999;
    }
    /* 响应式 */
    @media screen and (max-width:1000px ) {
        #login_img{
            display: none;
        }
        #login_wrap{
            width: 490px;
            margin-right: -245px;
        }
        .login{
            width: 100%;

        }
    }
    @media screen and (max-width:560px ) {
        #login_wrap{
            width: 330px;
            margin-right: -165px;
        }
   /*     .login span{
            margin-left: -125px;
        }*/
        .form input{
            width: 250px;
        }
        .btn{
            width: 113px;
        }
        .btn span{
           margin-left: 0px;
        }
    }
    @media screen and (max-width:345px ) {
        #login_wrap {
            width: 290px;
            margin-right: -145px;
        }
    }
</style>