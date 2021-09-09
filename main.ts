input.onGesture(Gesture.ScreenDown, function () {
    if (全局阶段str.compare("工作倒计时") == 0) {
        if (局部阶段num == 0) {
            局部阶段num = 1
            joystickbit.Vibration_Motor(100)
        }
    }
})
function 清空时间显示状态 (初始时间m: number) {
    上次绘制的时间m = 0
    当前闪烁状态01 = 0
    当前倒计时时间ms = 初始时间m * 60000
}
function 等待阶段结束 (阶段Str: string) {
    while (全局阶段str.compare(阶段Str) == 0) {
        basic.pause(100)
    }
}
// 番茄时长 25 到 60
// 
// 短休息 3 到 5
// 
// 长休息 15 到 30
function 显示符号时间 (时间m: number, 闪烁b: boolean) {
    if (上次绘制的时间m != 时间m) {
        basic.clearScreen()
        绘图索引X = 0
        while (绘图索引X < Math.idiv(时间m - 1, 10)) {
            led.plot(绘图索引X, 0)
            绘图索引X += 1
        }
        临时值 = 0
        while (临时值 < 时间m - Math.idiv(时间m - 1, 10) * 10) {
            if (临时值 < 5) {
                绘图索引X = 临时值
                绘图索引Y = 3
            } else {
                绘图索引X = 临时值 % 5
                绘图索引Y = 4
            }
            led.plot(绘图索引X, 绘图索引Y)
            临时值 += 1
        }
        上次绘制的时间m = 时间m
    }
    if (闪烁b && 时间m > 0) {
        临时值 = Math.trunc(input.runningTime() / 500) % 2
        if (当前闪烁状态01 != 临时值) {
            if (当前闪烁状态01 == 0) {
                led.unplot(绘图索引X, 绘图索引Y)
            } else {
                led.plot(绘图索引X, 绘图索引Y)
            }
            当前闪烁状态01 = 临时值
        }
    }
}
input.onButtonPressed(Button.A, function () {
    if (全局阶段str.compare("问候语") == 0) {
        led.stopAnimation()
    } else if (全局阶段str.compare("设置") == 0) {
        if (局部阶段num == 0) {
            番茄时间长度m = 番茄时间长度m + 5
            if (番茄时间长度m > 60) {
                番茄时间长度m = 25
            }
        } else if (局部阶段num == 1) {
            短休息长度m = 短休息长度m + 1
            if (短休息长度m > 5) {
                短休息长度m = 3
            }
        } else if (局部阶段num == 2) {
            长休息长度m = 长休息长度m + 5
            if (长休息长度m > 30) {
                长休息长度m = 15
            }
        }
    } else if (全局阶段str.compare("等待响应") == 0) {
        led.stopAnimation()
        设置当前阶段("所有任务结束")
    }
})
input.onGesture(Gesture.Shake, function () {
    if (全局阶段str.compare("工作倒计时") == 0) {
        设置当前阶段("等待响应")
        if (番茄时间长度m - 当前倒计时时间ms / 60000 <= 5) {
            basic.showString("Retry Or GiveUp?")
        } else {
            basic.showString("GiveUp?")
        }
    } else if (全局阶段str.compare("等待响应") == 0) {
        led.stopAnimation()
        恢复前一阶段()
    }
})
function 进入倒计时 (阶段str: string, 时长m: number) {
    if (全局阶段str.compare(阶段str) == 0) {
        当前时段起始时间ms = input.runningTime()
        当前倒计时时间ms = 时长m * 60000
        while (全局阶段str.compare(阶段str) == 0 || 全局阶段str.compare("等待响应") == 0) {
            basic.pause(100)
            if (全局阶段str.compare(阶段str) == 0) {
                if (局部阶段num == 0) {
                    当前倒计时时间ms = 当前倒计时时间ms - (input.runningTime() - 当前时段起始时间ms)
                    当前时段起始时间ms = input.runningTime()
                    if (当前倒计时时间ms < 0) {
                        设置当前阶段("倒计时结束")
                    }
                }
            } else {
                当前时段起始时间ms = input.runningTime()
            }
        }
    }
}
function 设置当前阶段 (阶段Str: string) {
    前一全局阶段str = 全局阶段str
    前一局部阶段num = 局部阶段num
    全局阶段str = 阶段Str
    局部阶段num = 0
}
function 恢复前一阶段 () {
    全局阶段str = 前一全局阶段str
    局部阶段num = 前一局部阶段num
}
input.onButtonPressed(Button.B, function () {
    if (全局阶段str.compare("问候语") == 0) {
        led.stopAnimation()
    } else if (全局阶段str.compare("设置") == 0) {
        局部阶段num += 1
        if (局部阶段num > 2) {
            设置当前阶段("放弃番茄钟")
        }
    } else if (全局阶段str.compare("等待响应") == 0) {
        led.stopAnimation()
        设置当前阶段("放弃番茄钟")
    }
})
function 初始化状态 () {
    // 全局和局部阶段为 ：
    // 问候语
    // 设置
    // >0: 设置番茄时间长度
    // >1: 设置短休息长度
    // >2: 设置长休息长度
    // 工作倒计时
    // >0: 正常
    // >1: 暂停
    // 短时间倒计时
    // 长时间倒计时
    // 倒计时结束
    // 
    // 等待响应
    // 放弃番茄钟
    // 
    // 所有任务结束
    // 
    // 注：所有以“倒计时”结尾的阶段，都会进入倒计时状态
    全局阶段str = "问候语"
    局部阶段num = 0
    番茄时间长度m = 25
    短休息长度m = 3
    长休息长度m = 15
    上次绘制的时间m = -1
    当前闪烁状态01 = 0
    番茄钟累积num = 0
}
input.onGesture(Gesture.ScreenUp, function () {
    if (全局阶段str.compare("工作倒计时") == 0) {
        if (局部阶段num == 1) {
            局部阶段num = 0
            joystickbit.Vibration_Motor(100)
        }
    }
})
let 番茄钟累积num = 0
let 前一局部阶段num = 0
let 前一全局阶段str = ""
let 当前时段起始时间ms = 0
let 长休息长度m = 0
let 短休息长度m = 0
let 番茄时间长度m = 0
let 绘图索引Y = 0
let 临时值 = 0
let 绘图索引X = 0
let 当前倒计时时间ms = 0
let 当前闪烁状态01 = 0
let 上次绘制的时间m = 0
let 局部阶段num = 0
let 全局阶段str = ""
joystickbit.initJoystickBit()
初始化状态()
basic.showString("Tomato Clock")
设置当前阶段("设置")
basic.forever(function () {
    等待阶段结束("设置")
    while (全局阶段str.compare("所有任务结束") != 0) {
        if (全局阶段str.compare("放弃番茄钟") == 0) {
            清空时间显示状态(番茄时间长度m)
            设置当前阶段("工作倒计时")
        }
        music.playMelody("E D G F B A C5 B ", 120)
        进入倒计时("工作倒计时", 番茄时间长度m)
        if (全局阶段str.compare("倒计时结束") == 0) {
            番茄钟累积num += 1
            music.playMelody("G B A G C5 B A B ", 120)
            if (番茄钟累积num % 4 == 0) {
                设置当前阶段("长时间倒计时")
                进入倒计时("长时间倒计时", 长休息长度m)
            } else {
                设置当前阶段("短时间倒计时")
                进入倒计时("短时间倒计时", 短休息长度m)
            }
        }
    }
    music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
    while (true) {
        basic.showString(" U Win:")
        basic.showString("" + (番茄钟累积num))
        basic.pause(10000)
    }
})
control.inBackground(function () {
    while (true) {
        if (全局阶段str.compare("设置") == 0) {
            if (局部阶段num == 0) {
                显示符号时间(番茄时间长度m, false)
            } else if (局部阶段num == 1) {
                显示符号时间(短休息长度m, false)
            } else if (局部阶段num == 2) {
                显示符号时间(长休息长度m, false)
            }
        } else if (全局阶段str.indexOf("倒计时") == 全局阶段str.length - 3) {
            if (Math.floor(当前倒计时时间ms / 1000) < 10) {
                basic.showNumber(Math.floor(当前倒计时时间ms / 1000))
            } else {
                if (局部阶段num == 0) {
                    显示符号时间(Math.ceil(当前倒计时时间ms / 60000), true)
                } else if (局部阶段num == 1) {
                    显示符号时间(Math.ceil(当前倒计时时间ms / 60000), false)
                }
            }
        }
        basic.pause(50)
    }
})
