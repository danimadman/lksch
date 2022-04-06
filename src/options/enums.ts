import {Dict} from "../models/dicts";

export enum StatusEnum {
    Draft = 1,
    OnCheck,
    OnCompletion,
    Checked,
    Rejected
}

export const RoleEnum = {
    SchoolBoy: 1,
    Parent: 2,
    Admin: 3,
};

export const dictStatus: Dict[] = [
    { id: 1, name: 'Черновик' },
    { id: 2, name: 'На проверке' },
    { id: 3, name: 'На доработке' },
    { id: 4, name: 'Проверено' },
    { id: 5, name: 'Отклонено' }
];

export enum DataState {
    Added,
    Deleted,
    Updated
}

export enum EventStatusEnum {
    Draft = 1,
    Recruiting,
    RecruitmentCompleted,
    Closed
}

export enum CourseStatusEnum {
    Draft = 1,
    Recruiting,
    RecruitmentCompleted,
    Closed
}