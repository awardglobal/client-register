import requestAPI from '@/utils/request';
import { ById, GetListResponse } from './global';
import type { Role } from './role';
import type { MinIOFile } from './file';

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone?: string;
  nickname: string;
  avatar: MinIOFile;
  isActive: boolean;
  authorities: Role[];
}

export interface UserResponse {
  user: User;
}

export interface RegisterRequest {
  email: string;
  nickname: string;
  phone?: string;
  password: string;
  avatar: File;
  authorityIds: string[];
}

export async function registerService(data: RegisterRequest) {
  const formData = new FormData();
  formData.append('avatar', data.avatar);
  formData.append('email', data.email);
  formData.append('nickname', data.nickname);
  formData.append('phone', data.phone ?? '');
  formData.append('password', data.password);
  for (const authorityId of data.authorityIds) {
    formData.append('authorityIds', authorityId);
  }
  const res = await requestAPI<null>({
    url: '/user/register',
    method: 'post',
    data: formData,
  });
  return res.data;
}

export interface UpdateSelfRequest {
  nickname: string;
  phone?: string;
}

export interface UpdateSelfResponse {
  user: User;
}

export async function updateSelfService(data: UpdateSelfRequest) {
  const res = await requestAPI<UserResponse>({
    url: '/user/updateSelf',
    method: 'post',
    data,
  });
  return res.data;
}

export interface GetUserListRequest {
  page: number;
  pageSize: number;
  nickname?: string;
  email?: string;
  isActive: boolean;
}

export type GetUserListResponse = GetListResponse<User>;

export async function getUserListService(data: GetUserListRequest) {
  const res = await requestAPI<GetUserListResponse>({
    url: '/user/getUserList',
    method: 'post',
    data,
  });
  return res.data;
}

export async function getUserByIdService(data: ById) {
  const res = await requestAPI<UserResponse>({
    url: '/user/getUserById',
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteUserService(data: ById) {
  const res = await requestAPI<null>({
    url: '/user/deleteUser',
    method: 'post',
    data,
  });
  return res.data;
}

export interface UpdateUserRequest {
  id: string;
  email: string;
  nickname: string;
  phone: string;
  isActive: boolean;
  authorityIds: string[];
}

export async function updateUserService(data: UpdateUserRequest) {
  const res = await requestAPI<null>({
    url: '/user/updateUser',
    method: 'post',
    data,
  });
  return res.data;
}

interface UpdateUserAvatarRequest {
  id: string;
  avatar: File;
}

export async function updateUserAvatarService(data: UpdateUserAvatarRequest) {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('file', data.avatar);
  const res = await requestAPI<null>({
    url: '/user/updateUserAvatar',
    method: 'post',
    data: formData,
  });
  return res.data;
}
