import request from '../utils/request'

//查询所有班级
export const listApi = () => request.get('/clazzs/list');



//分页查询班级列表数据

export const pageApi = (name,begin,end,page,pageSize) => request.get(
    `/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)