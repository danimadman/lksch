﻿'use strict';
import {environment} from "../environments/environment";

export const apiUrl = environment.production
    ? 'https://demo.volgatech.net:666'
    : 'https://localhost:5001';

export const homeUrl = '/Home';
export const announcementsUrl = '/Announcements';

export const loginUrl: string = '/Account/Login';
export const registerUrl = '/Register';
export const forgotPasswordUrl = '/Account/ForgotPassword';
export const resendEmailConfirmUrl = '/Account/ResendEmailConfirmation';

export const achievementsUrl = '/Achievements';
export const addAchievementUrl = '/Achievements/Add';

export const registeredEventsUrl = '/RegisteredEvents';
export const eventsUrl = '/Events';
export const eventDetailsUrl = '/EventDetails';

export const studentCoursesUrl = '/StudentCourses';
export const coursesUrl = '/Courses';
export const courseDetailsUrl = '/CourseDetails';

export const lkschool_tokens = 'lkschool-tokens';
export const access_token_key = 'auth-token';
export const access_token_type = 'auth-token-type';
export const refresh_token_key = 'refresh-token'
export const refresh_token_expires = 1800;