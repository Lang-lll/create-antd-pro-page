import { request } from '@umijs/max';
import { CategoryListItem } from './data';

/** 获取列表 */
export async function getCategoryList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const res = await request<{
    data: CategoryListItem[];
    /** 列表的内容总数 */
    totalCount?: number;
  }>('/categoryBean/page', {
    method: 'POST',
    data: {
      ...params,
      pageNum: params.current,
      pageSize: params.pageSize
    },
    ...(options || {}),
  });

  return {
    success: res && Array.isArray(res.data),
    data: res.data,
    total: res.totalCount
  }
}

/** 编辑 */
export async function updateCategory(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>(`/categoryBean/updateById`, {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function getCategoryOne(id: any, options?: { [key: string]: any }) {
  return request<any>(`/categoryBean/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建 */
export async function addCategory(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/categoryBean/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除 */
export async function removeCategory(rows: CategoryListItem[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/categoryBean', {
    data: rows.map((row) => row.key),
    method: 'DELETE',
    ...(options || {}),
  });
}
