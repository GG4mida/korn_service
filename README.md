## korn-service

模拟炒币（现货）、数字货币实时行情 & 资讯、最新空投信息等。基于 eggjs 构建。

> 该项目是 [korn_wallet](https://github.com/GG4mida/korn_wallet) 对应的后台服务项目。

## 配套

- 对应前端应用：[korn_wallet](https://github.com/GG4mida/korn_wallet)
- 对应后台管理：[korn_web](https://github.com/GG4mida/korn_web)

## 开发设置

### eggjs

[eggjs 开发文档](https://eggjs.org/)

### 环境要求

- node v10.0.0+
- redis v4.0.2+
- mysql v8.0.23+
- yarn
- 网络环境，需要能访问到：binance.com 的接口服务。建议开启 vpn 服务。否则无法获取行情、K 线数据。

### 配置信息

#### mysql

/config/config.default.js，修改：config.sequelize.password 配置节。

#### 汇率获取

前往阿里去市场，购买汇率服务：https://market.aliyun.com/products/57000002/cmapi011221.html
然后修改 /config/user.default.js 相关 code

#### 区块链资讯

前往：https://www.coindog.com/，申请接入权限
然后修改 /config/user.default.js 相关 accessKey & secretKey

### 运行步骤

- yarn install
- yarn dev
- 访问：http://127.0.0.1:7070/api/system/init 初始化
- 访问：http://127.0.0.1:7070/api/system/start 启动服务

## TODO

- [ ] 部署线上服务
- [ ] 简化部署流程，弄一个 docker-compose

## 联系

- 可直接提 issue
- 小飞机：[@kornchain](https://t.me/kornchain)

## 免责声明

- 本项目使用到的行情及资讯数据，均来自于币安，本应用不会修改任何接口数据。
- 本项目代码仅供学习交流，如用于商业用途造成任何负面影响，与代码贡献人员无关。

## License

[BSD](https://www.wikiwand.com/en/BSD_licenses)
