import request from "../utils/request";


//查询全部部门数据
export const queryAllApi = () => request.get('/depts');


//新增
export const addApi = (dept) => request.post('/depts',dept);

//根据ID查询部门



//修改


//删除


