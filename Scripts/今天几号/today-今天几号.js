// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
/**
 * @author kevinjobs
 * @date '2021-02-03'
 */

const w = new ListWidget();
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;

const stack1 = w.addStack();
const stack2 = w.addStack();

// list widget style
w.setPadding(0,0,0,0);
// stack1 styles
stack1.backgroundColor = new Color('#E61A1A');
stack1.size = new Size(155, 50);
const stack1text = stack1.addText(`${month.toString()}月`);
stack1text.font = new Font('PingFangSC', 30);
stack1text.textColor = new Color('#fff')
stack1.centerAlignContent();
// stack2 styles
stack2.size = new Size(155, 105);
const stack2text = stack2.addText(day.toString());
stack2text.font = new Font('PingFangSC', 60);
stack2.centerAlignContent();

Script.setWidget(w);
Script.complete();