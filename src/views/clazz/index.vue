<script setup>
import { ref, watch, onMounted } from 'vue'
import { pageApi } from '@/api/clazz.js'
import { ElMessage } from 'element-plus';


//页面预加载
onMounted(async () => {
  //加载全部班级数据到表格
  search();
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
  console.log(queryParams.value);
});



//搜索班级数据函数
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


//清空按钮-清空功能函数
const clear = () => {
  queryParams.value = {
    name: '',
    date: [],
    begin: '',
    end: ''
  };
  search();
}


//分页功能参数
const currentPage = ref(1)//当前页
const total = ref(0)//总记录数
const pageSize = ref(10)//每页记录数
const size = ref('default')
const background = ref(true)
const disabled = ref(false)

//分页-每页记录数变化函数
const handleSizeChange = (val) => {
  pageSize.value = val;
  search();
}

//分页-页码变化函数
const handleCurrentChange = (val) => {
  currentPage.value = val;
  search();
}

//编辑按钮功能-修改班级信息
const edit = (id) => {
  //设置对话框标题
  dialogTitle.value = '修改班级'
  //显示对话框
  dialogFormVisible.value = true;
  //根据id查看班级信息 TODO---
}

//对话框相关参数
const dialogFormVisible = ref(false)
const formLabelWidth = '80px'
const dialogTitle = ref('')
//对话框表单
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
//对话框-下拉选择栏-学科（subject）栏 
const subjects = ref([
  { id: 1, label: 'java'},
  { id: 2, label: '前端'},
  { id: 3, label: '大数据'},
  { id: 4, label: 'Python'},
  { id: 5, label: 'Go'},
  { id: 6, label: '嵌入式'},
])



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
          <el-button type="danger" @click="deleteItem">删除</el-button>
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


  <!-- 编辑对话框 dialog -->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500" aling-center="true" center="true">
    <el-form :model="dialogForm" label-position="right">
      <el-form-item label="班级名称" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="班级教室" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.room" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开课时间" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.beginDate" autocomplete="off" />
      </el-form-item>
      <el-form-item label="结课时间" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.endDate" autocomplete="off" />
      </el-form-item>
      <el-form-item label="班主任" :label-width="formLabelWidth">
        <el-input v-model="dialogForm.masterId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学科" :label-width="formLabelWidth">
        <el-select v-model="dialogForm.subject" value-key="id" placeholder="请选择学科" style="width: 500px">
          <el-option v-for="subject in subjects" :key="subject.id" :label="subject.label" :value="subject.value" />
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false" size="large">保存</el-button>
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