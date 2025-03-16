<script setup>
import { ref, watch, onMounted } from 'vue'
import { pageApi, queryByIdApi, addApi, updateApi, deleteApi } from '@/api/clazz.js'
import { listApi as empListApi } from '@/api/emp';
import { ElMessage } from 'element-plus';


//onMounted预加载
onMounted(async () => {
  //加载全部班级数据到表格
  search();
  //给班主任列表信息赋值
  queryTeachers();

})

//班级表格数据
const clazzData = ref([])

//表单搜索参数
const queryParams = ref({
  name: '',
  date: [],
  begin: '',
  end: ''
})

//侦听表单日期 queryParams.date
watch(() => queryParams.value.date, (newVal, oldVal) => {
  if (newVal.length == 2) {
    queryParams.value.begin = newVal[0];
    queryParams.value.end = newVal[1];
  } else {
    queryParams.value.begin = '';
    queryParams.value.end = '';
  }
});



//searchForm-button(search):根据表单查询相关班级信息
const search = async () => {
  const result = await pageApi(
    queryParams.value.name, queryParams.value.begin, queryParams.value.end, currentPage.value, pageSize.value);
  if (result.code) {
    total.value = result.data.total;
    clazzData.value = result.data.rows;
  } else {
    ElMessage.error('查询出错');
  }
}


//searchForm-button(clear):清空表单数据
const clear = () => {
  queryParams.value = {
    name: '',
    date: [],
    begin: '',
    end: ''
  };
  search();
}


//pagination-分页功能参数
const currentPage = ref(1)//当前页
const total = ref(0)//总记录数
const pageSize = ref(10)//每页记录数
const size = ref('default')
const background = ref(true)
const disabled = ref(false)

//pagination-每页记录数变化（handleSizeChange）
const handleSizeChange = (val) => {
  pageSize.value = val;
  search();
}

//分页-页码变化（handleCurrentChange）
const handleCurrentChange = (val) => {
  currentPage.value = val;
  search();
}

//table-button-编辑按钮(edit):修改班级信息
const edit = async (id) => {
  //设置对话框标题
  dialogTitle.value = '修改班级'


  //根据id查看班级信息
  const result = await queryByIdApi(id);
  if (result.code) {
    dialogForm.value = result.data;
    //显示对话框
    dialogFormVisible.value = true;
  } else {
    ElMessage.error("服务端异常");
  }
}

//dialog对话框相关参数
const dialogFormVisible = ref(false)
const formLabelWidth = '80px'
const dialogTitle = ref('')
//dialog对话框表单
const dialogForm = ref({
  id: '',
  name: '',
  room: '',
  beginDate: '',
  endDate: '',
  masterId: '',
  subject: '',
  createTime: '',
  updateTime: '',
})
//dialog-下拉选择栏-学科（subject）栏 
const subjects = ref([
  { name: 'java', value: 1 },
  { name: '前端', value: 2 },
  { name: '大数据', value: 3 },
  { name: 'Python', value: 4 },
  { name: 'Go', value: 5 },
  { name: '嵌入式', value: 6 },
])

//dialog-下拉选择框-班主任(teacher)栏
const teachers = ref()
const queryTeachers = async () => {
  const result = await empListApi();
  if (result.code) {
    teachers.value = result.data;
  }
}
//button-新增班级按钮
const addClazz = () => {
  //清空已有的对话框表单数据
  dialogForm.value = {
    id: '',
    name: '',
    room: '',
    beginDate: '',
    endDate: '',
    masterId: '',
    subject: '',
    createTime: '',
    updateTime: '',
  };
  //将对话框标题设置为‘新增班级’
  dialogTitle.value = '新增班级';
  //显示对话框
  dialogFormVisible.value = true;
}

//dialog-button-保存按钮(save):新增/修改班级信息
const save = async () => {
  let result;
  if(dialogForm.value.id){
    //存在id为更新班级信息功能
    result = await updateApi(dialogForm.value);
  }else{
    //id为空时，为新增班级信息功能
    result = await addApi(dialogForm.value);
  }

  if(result.code){
    //提示成功信息
    ElMessage.success('操作成功！');
    //关闭对话框
    dialogFormVisible.value = false;
    //调用search函数，刷新表格数据
    search();
  }else{
    ElMessage.error('操作失败');
  }
}


//table-button-删除按钮(deleteClazz):根据id删除该行班级数据
const deleteClazz = async (id) => {
  const result = await deleteApi(id);
  if(result.code){
    //提示成功信息
    ElMessage.success('删除成功');
    //关闭对话框
    dialogFormVisible.value = false;
    //调用search函数，刷新表格数据
    search();
  }else{
    ElMessage.error('服务器异常，操作失败');
  }
}


</script>

<template>
  <!-- 标题 -->
  <h1>班级管理</h1>


  <!-- 搜索条件表单 Form -->
  <div class="form">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="班级名称">
        <el-input v-model="queryParams.name" placeholder="请输入班级名称" clearable />
      </el-form-item>

      <el-form-item label="结课时间">
        <el-date-picker v-model="queryParams.date" type="daterange" range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" size="default" value-format="YYYY-MM-DD" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>


  <!-- 新增班级按钮 Button -->
  <div class="addClazzButton">
    <el-button type="primary" size="large" @click="addClazz"><strong>+ 新增班级</strong></el-button>
  </div>

  <!-- 表格 -->
  <div class="table">
    <el-table :data="clazzData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="班级名称" width="150" align="center" />
      <el-table-column prop="room" label="班级教室" width="100" align="center" />
      <el-table-column prop="masterName" label="班主任" width="100" align="center" />
      <el-table-column prop="beginDate" label="开课时间" width="180" align="center" />
      <el-table-column prop="endDate" label="结课时间" width="180" align="center" />
      <el-table-column prop="status" label="状态" width="120" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="280" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteClazz(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页条 -->
  <div class="page">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
      :size="size" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>




  <!-- 编辑dialog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500" aling-center="true" center="true">
    {{ dialogForm }}
    <el-form :model="dialogForm" label-position="right">
      <el-form-item label="班级名称" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="班级教室" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.room" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开课时间" :label-width="formLabelWidth">
        <el-date-picker v-model="dialogForm.beginDate" type="date" placeholder="请选择开课时间" format="YYYY年MM月DD日"
          value-format="YYYY-MM-DD" style="width: 500px" />
      </el-form-item>
      <el-form-item label="结课时间" :label-width="formLabelWidth">
        <el-date-picker v-model="dialogForm.endDate" type="date" placeholder="请选择结课时间" format="YYYY年MM月DD日"
          value-format="YYYY-MM-DD" style="width: 500px" />
      </el-form-item>
      <el-form-item label="班主任" :label-width="formLabelWidth">
        <el-select v-model="dialogForm.masterId" value-key="id" placeholder="请选择学科" style="width: 500px">
          <el-option v-for="teacher in teachers" :key="teacher.id" :label="teacher.name"
            :value="teacher.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学科" :label-width="formLabelWidth">
        <el-select v-model="dialogForm.subject" placeholder="请选择学科" style="width: 500px">
          <el-option v-for="subject in subjects" :key="subject.value" :label="subject.name"
            :value="subject.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save" size="large">保存</el-button>
        <el-button @click="dialogFormVisible = false" size="large">取消</el-button>
      </div>
    </template>
  </el-dialog>

</template>



<style scoped>
.addClazzButton {
  margin-top: -8px;
  margin-bottom: 15px;
}

.form {
  margin-top: 15px;
}

.page {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: space-evenly;
}
</style>