# 番茄时长 25 到 60
# 
# 短休息 3 到 5
# 
# 长休息 15 到 30
def 显示符号时间(时间: number):
    global 上次绘制的时间
    if 上次绘制的时间 != 时间:
        basic.clear_screen()
        index = 0
        while index <= Math.idiv(时间, 10):
            led.plot(index, 0)
            index += 1
        上次绘制的时间 = 时间

def on_button_pressed_a():
    global 番茄时间长度, 短休息长度, 长休息长度
    if 全局阶段.compare("问候语") == 0:
        led.stop_animation()
    elif 全局阶段.compare("设置") == 0:
        if 局部阶段 == 0:
            番茄时间长度 = 番茄时间长度 + 5
            if 番茄时间长度 > 60:
                番茄时间长度 = 25
        elif 局部阶段 == 1:
            短休息长度 = 短休息长度 + 1
            if 短休息长度 > 5:
                短休息长度 = 3
        elif 局部阶段 == 2:
            长休息长度 = 长休息长度 + 5
            if 长休息长度 > 30:
                长休息长度 = 15
    else:
        pass
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global 局部阶段
    if 全局阶段.compare("问候语") == 0:
        led.stop_animation()
    elif 全局阶段.compare("设置") == 0:
        局部阶段 += 1
    else:
        pass
input.on_button_pressed(Button.B, on_button_pressed_b)

def 初始化状态():
    global 全局阶段, 局部阶段, 番茄时间长度, 短休息长度, 长休息长度, 上次绘制的时间
    # 全局和局部阶段为 ：
    # 问候语
    # 设置
    # >0: 设置番茄时间长度
    # >1: 设置短休息长度
    # >2: 设置长休息长度
    全局阶段 = "问候语"
    局部阶段 = 0
    番茄时间长度 = 25
    短休息长度 = 3
    长休息长度 = 15
    上次绘制的时间 = -1
长休息长度 = 0
短休息长度 = 0
番茄时间长度 = 0
局部阶段 = 0
上次绘制的时间 = 0
全局阶段 = ""
初始化状态()
basic.show_string("Tomato Clock")
全局阶段 = "设置"

def on_forever():
    while 全局阶段.compare("设置") == 0:
        basic.pause(100)
    basic.show_string("SetTime")
basic.forever(on_forever)

def on_in_background():
    while True:
        if 全局阶段.compare("设置") == 0:
            if 局部阶段 == 0:
                显示符号时间(番茄时间长度)
            elif 局部阶段 == 1:
                显示符号时间(短休息长度)
            elif 局部阶段 == 2:
                显示符号时间(长休息长度)
        control.wait_micros(10)
control.in_background(on_in_background)
