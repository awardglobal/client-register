import requestAPI from '@/utils/request';
import { ById, GetListResponse } from './global';
import { Menu } from './menu';
import { User } from './user';

export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  authorityName: string;
  parentId: string;
  children: Role[];
  users: User[];
  menus: Menu[];
}

export interface CreateRoleRequest {
  authorityName: string;
  parentId: string;
}

export interface RoleResponse {
  authority: Role;
}

export async function createRoleService(data: CreateRoleRequest) {
  const res = await requestAPI<RoleResponse>({
    url: '/authority/createAuthority',
    method: 'post',
    data,
  });
  return res.data;
}

export interface GetRoleListRequest {
  page: number;
  pageSize: number;
  authorityName?: string;
}

export type GetRoleListResponse = GetListResponse<Role>;

export async function getRoleListService(data: GetRoleListRequest) {
  const res = await requestAPI<GetRoleListResponse>({
    url: '/authority/getAuthorityList',
    method: 'post',
    data,
  });
  return res.data;
}

export async function getRoleByIdService(data: ById) {
  const res = await requestAPI<RoleResponse>({
    url: '/authority/getAuthorityById',
    method: 'post',
    data,
  });
  return res.data;
}

export interface UpdateRoleRequest {
  id: string;
  name: string;
}

export async function updateRoleService(data: UpdateRoleRequest) {
  const res = await requestAPI<null>({
    url: '/authority/updateAuthority',
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteRoleService(data: ById) {
  const res = await requestAPI<null>({
    url: '/authority/deleteAuthority',
    method: 'post',
    data,
  });
  return res.data;
}

export interface SetRoleMenuRequest {
  authorityId: string;
  menuIds: string[];
}

export async function setRoleMenuService(data: SetRoleMenuRequest) {
  const res = await requestAPI<null>({
    url: '/authority/setAuthorityMenu',
    method: 'post',
    data,
  });
  return res.data;
}

export interface GetRoleMenuResponse {
  list: string[];
}

export async function getRoleMenuService(data: ById) {
  const res = await requestAPI<GetRoleMenuResponse>({
    url: '/authority/getAuthorityMenu',
    method: 'post',
    data,
  });
  return res.data;
}
