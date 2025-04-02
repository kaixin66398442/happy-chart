// 自定义校验规则的函数(给下面的表单验证规则使用)
// 验证用户名
const validatorUserName = (rule, value, callback) => {
    // rule为校验规则对象
    // value为表单文本内容
    // 如果符合条件callback放行
    // 如果不符合可以通过callback注入错误信息
    if (value.trim().length >= 1 && value.trim().length <= 10) {
        callback();
    } else {
        callback(new Error("用户名长度为1~10位之间！"));
    }
};

// 验证密码
const validatorPassword = (_rule, value, callback) => {
    if (value.trim().length >= 6 && value.trim().length <= 12) {
        callback();
    } else {
        callback(new Error("密码长度为6~12位之间！"));
    }
};

// 验证注册的第一个密码
let firstPassword = ''
const validatorRegisterFirstPassword = (_rule, value, callback) => {
    // 保存第一次密码
    firstPassword = value
    if (value.trim().length >= 6 && value.trim().length <= 12) {
        callback();
    } else {
        callback(new Error("密码长度为6~12位之间！"));
    }
};
// 验证注册的确认密码
const validatorRegisterSecondPassword = (_rule, value, callback) => {
    value === firstPassword ? callback() : callback(new Error("两次密码不一致！"))
};

// 定义表单验证的规则
let formRules = {
    username: [
        // { required: true, message: "用户名不能为空", trigger: "blur" },
        // {
        //   min: 2,
        //   max: 12,
        //   message: "用户名应是2~12位",
        //   trigger: "blur",
        // },
        // 使用自定义校验规则
        { trigger: "blur", validator: validatorUserName },
    ],
    password: [
        // { required: true, message: "密码不能为空", trigger: "blur" },
        // {
        //   min: 6,
        //   max: 12,
        //   message: "密码应是6~12位",
        //   trigger: "blur",
        // },
        // 使用自定义校验规则
        { trigger: "blur", validator: validatorPassword },
    ],
    firstPassword: [
        { trigger: "blur", validator: validatorRegisterFirstPassword },
    ],
    secondPassword: [
        { trigger: "blur", validator: validatorRegisterSecondPassword },
    ],
};

export default formRules