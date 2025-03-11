<script setup>
import {ref,onMounted} from 'vue';
import axios from 'axios';

//查询
const search = async() => {
    let result = await axios.get('https://apifoxmock.com/m1/6003419-5691983-default/depts');
    if(result.data.code == 1){ //js隐式类型转换，其他数字--true
      deptList.value = result.data.data;
    }
}

const deptList = ref([]);

onMounted(() => {
  search();
});

</script>

<template>
  <div class="head">
    <h1>部门管理</h1>
  </div>
  
  <div class="addBtn">
    <el-button type="primary">+新增部门</el-button>
  </div>

  <div class="table">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="350" align="center"/>
      <el-table-column prop="createTime" label="创建日期" width="350" align="center"/>
      <el-table-column prop="updateTime" label="更新日期" width="350" align="center"/>
      <el-table-column prop="address" label="操作"  align="center">
        <el-button type="warning" size="small"><el-icon><Edit /></el-icon>&nbsp&nbsp编辑</el-button>
        <el-button type="danger" size="small"><el-icon><Delete /></el-icon>&nbsp&nbsp删除</el-button>
      </el-table-column>
    </el-table>
  </div>

</template>

<style scoped>
.head {
  margin: 18px 0;
}

.addBtn {
  margin: 18px 0;
}

</style>
