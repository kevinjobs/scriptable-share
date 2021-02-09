// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;

const w = new ListWidget();

const param = args.widgetParameter;

// 长按桌面小组件 → 编辑“Scriptable” → 参数
// 输入你买的彩票号码，以英文逗号隔开，双色球前6位为红球，后1位为蓝球
const myArr = param ? param.split(',').slice(0, 6) : ['02', '05', '13', '18', '25', '26'];
const myblue = param ? param.split(',').slice(-1)[0] : '18';

const lottery = await getLottery();
const red = lottery.red;
const blue = lottery.blue;
const balls = red + ',' + blue;
const index = lottery.code;
const week = lottery.week;
const date = lottery.date.slice(0,10);

const win = isWin(red.split(','), blue, myArr, myblue);

// title stack
const titleStack = w.addStack();
titleStack.centerAlignContent();
w.addSpacer(5);
//
const indexText = titleStack.addText(`双色球 第${index}期`);
titleStack.addSpacer(10);
const notionText = titleStack.addText(`中奖了吗？${win}`);
indexText.font = new Font('PingFangSC', 16);
notionText.font = new Font('PingFangSC', 16);
notionText.textColor = new Color('ef4136');

// subtitle stack
const subTitleStack = w.addStack();
w.addSpacer(10);
//
const openText = subTitleStack.addText(`开奖日期${date} 星期${week}`);
openText.font = new Font('PingFangSC-light', 14);

// ball stack
const ballStack = w.addStack();
ballStack.spacing = 2;
// draw balls
drawBalls(ballStack, red, blue, myArr, myblue);

w.addSpacer(10);
const nt = w.addText('提示：黄色的球为命中的');
nt.font = new Font('PingFangSC-light', 10);

Script.setWidget(w);
Script.complete();

async function getLottery() {
    const url = 'http://www.cwl.gov.cn/cwl_admin/kjxx/findDrawNotice?name=ssq&issueCount=1';
    const res = new Request(url);
    res.headers = {'referer': 'http://www.cwl.gov.cn/'};
    const json = await res.loadJSON();
    const result = json.result[0];
    return result;
}

function drawBalls(stack, red, blue, myArr, myblue) {
    const concat = red + ',' + blue;
    
    const redArr = red.split(',');
    const interArr = intersection(redArr, myArr);
    
    const finalArr = concat.split(',');

    finalArr.map((ball, index) => {
        const subStack = stack.addStack();
        subStack.addText(ball);
        subStack.size = new Size(40, 40);
        subStack.centerAlignContent();

        if (index === 6) {
            if (blue === myblue) {
                subStack.backgroundColor = new Color('#fdb933');
            } else {
                subStack.backgroundColor = new Color('#2a5caa');
            }
        } else {
            if (interArr.includes(ball)) {
                subStack.backgroundColor = new Color('#fdb933');
            } else {
                subStack.backgroundColor = new Color('#aa2116');
            }
        };

        subStack.cornerRadius = 20;
    });

    return stack;
}

function isWin(redArr, blue, myArr, myblue) {
    const result = intersection(redArr, myArr);
    if (result.length === 6 && myblue === blue) return '一等奖';
    else if (result.length === 6) return '二等奖';
    else if (result.length === 5 && myblue === blue) return '三等奖';
    else if (result.length === 5) return '四等奖';
    else if (result.length === 4 && myblue === blue) return '四等奖';
    else if (result.length === 4) return '五等奖';
    else if (result.length === 3 && myblue === blue) return '五等奖';
    else if (myblue === blue) return '六等奖';
    else return '并没有';
}

function intersection(arr1, arr2) {
    const result = [];
    for (let i = 0; i < arr1.length; i ++) {
        const current = arr1[i];
        for (let j = 0; j < arr2.length; j ++) {
            if (current === arr2[j]) {
                result.push(current);
            }
        }
    }
    return result;
}