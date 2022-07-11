import requestAPI from '@/utils/request';
import { ById, GetListResponse } from './global';

export interface Menu {
  id: string;
  createTime: string;
  updateTime: string;
  menuName: string;
  menuKey: string;
  path: string;
  hidden: boolean;
  parentId: string;
  children: Menu[];
}
export interface MenuResponse {
  menu: Menu;
}

export interface CreateMenuRequest {
  menuName: string;
  menuKey: string;
  path: string;
  hidden: boolean;
  parentId: string;
}

export async function createMenuService(data: CreateMenuRequest) {
  const res = await requestAPI<MenuResponse>({
    url: '/menu/createMenu',
    method: 'post',
    data,
  });
  return res.data;
}

export type GetMenuListResponse = GetListResponse<Menu>;

export interface GetMenuListRequest {
  page: number;
  pageSize: number;
  menuName?: string;
}

export async function getMenuListService(data: GetMenuListRequest) {
  const res = await requestAPI<GetMenuListResponse>({
    url: '/menu/getMenuList',
    method: 'post',
    data,
  });
  return res.data;
}

export interface GetMenuListAllResponse {
  list: Menu[];
  total: number;
}

export async function getMenuListAllService() {
  const res = await requestAPI<GetMenuListAllResponse>({
    url: '/menu/getMenuListAll',
    method: 'post',
  });
  return res.data;
}

export async function getMenuByIdService(data: ById) {
  const res = await requestAPI<MenuResponse>({
    url: '/menu/getMenuById',
    method: 'post',
    data,
  });
  return res.data;
}

export interface UpdateMenuRequest {
  id: string;
  menuName: string;
  menuKey: string;
  path: string;
  hidden: boolean;
}

export async function updateMenuService(data: UpdateMenuRequest) {
  const res = await requestAPI<null>({
    url: '/menu/updateMenu',
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteMenuService(data: ById) {
  const res = await requestAPI<null>({
    url: '/menu/deleteMenu',
    method: 'post',
    data,
  });
  return res.data;
}

export async function getMenuKeysByUserAuthorityService() {
  const res = await requestAPI<string[]>({
    url: '/menu/getMenuKeysByUserAuthority',
    method: 'post',
  });
  return res.data;
}
