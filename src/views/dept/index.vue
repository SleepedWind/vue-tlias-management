<script setup>
import {ref,onMounted} from 'vue';
import { queryAllApi,addApi,queryByIdApi,updateApi } from '@/api/dept';
import { ElMessage } from 'element-plus';

//查询
const search = async() => {
    // let result = await axios.get('https://apifoxmock.com/m1/6003419-5691983-default/depts');
    // if(result.data.code == 1){ //js隐式类型转换，其他数字--true
    //   deptList.value = result.data.data;
    // }  
    let result = await queryAllApi();
    if(result.code == 1){ //js隐式类型转换，其他数字--true
      deptList.value = result.data;
    }
}

//保存部门
const save = async () => {
  console.log(deptFormRef.value)

  //表单校验
  if(!deptFormRef.value) return;
  deptFormRef.value.validate(async (valid) => { //valid 表示是否校验通过，如果为true则通过 false不通过

      if(valid) {

        let result ;
        if(dept.value.id){//修改
          console.log(dept.value);
          result = await updateApi(dept.value);
        }else{
          result = await addApi(dept.value);
        }


        if(result.code){//成功
          //提示信息
          ElMessage.success('操作成功')
          //关闭对话框
          dialogFormVisible.value=false;
          //重新查询
          search();
        }else{
          ElMessage.error(result.msg);
        }
      }else {
        ElMessage.error('表单校验不通过');
      }
  })

  
}


//编辑
const edit = async (id) => {
  formTitle.value = '修改部门';
  
  const result = await queryByIdApi(id);
  if(result.code){
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
  
}



//新增部门
const addDept = () => {
  formTitle.value = '新增部门';
  dialogFormVisible.value = true;
  dept.value={name:''};

  if(deptFormRef.value) {
    deptFormRef.value.resetFields();
  };

}

const deptList = ref([]);

const formTitle = ref('');

const dept = ref({name: ''})

const deptFormRef = ref();



onMounted(() => {
  search();
});

//Dilog对话框
let dialogFormVisible = ref(false);


const rules = ref({
  name: [
    { required: true, message: '部门名称是必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度应该在2~10位之间', trigger: 'blur' },
  ]
})

</script>

<!-- 页面标题 -->
<template>
  <div class="head">
    <h1>部门管理</h1>
  </div>

  <!-- 新增部门按钮 -->
  <div class="addBtn">
    <el-button type="primary" @click="addDept">+新增部门</el-button>
  </div>

  <!-- 部门数据表格 -->
  <div class="table">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="350" align="center"/>
      <el-table-column prop="createTime" label="创建日期" width="350" align="center"/>
      <el-table-column prop="updateTime" label="更新日期" width="350" align="center"/>
      <el-table-column prop="address" label="操作"  align="center">
        <template #default="scope">
          <el-button type="warning" size="small" @click="edit(scope.row.id)"><el-icon><Edit /></el-icon>&nbsp&nbsp编辑</el-button>
          <el-button type="danger" size="small"><el-icon><Delete /></el-icon>&nbsp&nbsp删除</el-button>
        </template>
        
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增部门Dialog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title=formTitle width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.head {
  margin: 18px 0;
}

.addBtn {
  margin: 18px 0;
}

</style>
