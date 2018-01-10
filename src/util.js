/* uba-server-core v3
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2017-12-22 23:31:04
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2018-01-05 11:17:25
 */

const path = require("path");
const chalk = require("chalk");

/**
 * 获得当前运行路径
 * @param {*} file 获得文件路径
 */
exports.getRunPath = (file) => {
  return path.resolve(".", file);
}

/**
 * 获得uba配置
 */
exports.getUbaConfig = () => {
  try {
    return require(this.getRunPath("uba.config.js"))({
      "production": true,
      "HMR": "webpack-hot-middleware/client?noInfo=false&reload=true"
    });
  } catch (error) {
    console.log(error);
    console.log(chalk.red("[uba-dev-server] : 'uba.config.js' is error !"))
    process.exit(0);
  }
}



/**
 * 获取package.json
 */
exports.getPkg = () => {
  return require("../package.json");
}


/**
 * 获得项目下所有dependencies
 */
exports.getVendors = () => {
  let pkg = require(this.getRunPath("package.json"));
  let _vendors = [];
  for (const key in pkg.dependencies) {
    _vendors.push(key);
  }
  if (!_vendors.length) {
    return null;
  }
  return _vendors;
}


/**
 * 加载插件
 */
exports.loadPlugins = app => {
  let plugins = this.getUbaConfig().config.plugins;
  for (let key in plugins) {
    let opt = plugins[key];
    let plg = require(this.getRunPath(`node_modules/uba-server-${key}`));
    plg(app, opt);
    console.log(chalk.yellow(`[plugin] : load uba-server-${key} complete.`))
  }
}


/**
 * 显示插件信息
 */
exports.showPluginInfo = () => {
  let plugins = this.getUbaConfig().config.plugins;
  for (let key in plugins) {
    console.log(chalk.green(` [plugin]    : ${key} plugin`));
  }
}