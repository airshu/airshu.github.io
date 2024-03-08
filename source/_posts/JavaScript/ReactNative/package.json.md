---
title: package.json说明
tags: React Native 
---



```json

{
    "name": "app_name",//应用名
    "version": "1.1.1",//版本，用于展示
    "versionCode": 99,//版本号
    "private": true,
    "scripts": { //常用的命令封装
        "start": "",
        "clear": "",
        "publish": "",
        "android": "",
        "ios": ""
    },
    "engines": {},
    "repository": {
        "type": "git",
        "url": ""
    },
    "keywords": {},
    "author": {
        "name": "",
        "email": ""
    },
    "license": "",
    "bugs": {
        "url": ""
    },
    "homepage": {},
    "dependencies": {//项目的依赖
        "react": "18.2.0",
        "react-native": "0.71.7"
    },
    "resolutions":{ /* 强制依赖， 只在yarn中有效，npm不支持此字段 */
        "@types/react": "^17"
    },
    "devDependencies": {//开发的时候依赖

    }
}

```