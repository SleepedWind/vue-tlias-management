import request from '../utils/request'

//查询所有班级
export const listApi = () => request.get('/clazzs/list');



//分页查询班级列表数据

export const pageApi = (name,begin,end,page,pageSize) => request.get(
    `/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);

//根据id查询班级信息
export const queryByIdApi = (id) => request.get(`/clazzs/${id}`);

//新增
export const addApi = (clazzInfo) => request.post('/clazzs',clazzInfo);

//修改班级
export const updateApi = (clazzInfo) => request.put('/clazzs',clazzInfo);

//删除班级
export const deleteApi = (id) => request.delete(`/clazzs/${id}`);