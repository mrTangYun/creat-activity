import React from 'react';
import { Upload, message, Button, Icon, Radio, Input, Card, Timeline, Tooltip } from 'antd';
import UploadImg from './uploadImage';
import EditImage from './editImage';
const RadioGroup = Radio.Group;

function getProperty(object, propertyName) {
    if (object.hasOwnProperty(propertyName)) {
        return object[propertyName];
    } else {
        return false;
    }
}

export function getObjValueByPath(object, path) {
    const paths = path.split('.');
    let obj = object;
    for (let i = 0; i < paths.length; i++) {
        const newObj = getProperty(obj || object, paths[i]);
        if (newObj) {
            obj = newObj;
        } else {
            return false;
        }
    }
    return obj;
}

export default class EditActivity extends React.PureComponent{
    constructor() {
        super();
        this.editors = [];
    }
    state = {
        tmpBtn: {
            dots: [],
            action: {
                type: null
            }
        },
        editingBtnAction: false,
        savedData: []
    };

    clickCanvasXYHandler = (x, y, index) => {
        this.setState({
            tmpBtn: Object.assign({}, this.state.tmpBtn, {
                dots: [...this.state.tmpBtn.dots, {x, y}]
            }),
            currentBtnIndex: index
        });
        // this.editors.filter(i => i !== index).map(editor => {
        //     editor.component.undoTo0();
        // });
    };

    undoTo0 = () => {
        this.setState({
            tmpBtn: Object.assign({}, this.state.tmpBtn, {
                dots: [],
                action: {
                    type: null
                }
            }),
            editingBtnAction: false
        });
        this.editors[this.state.currentBtnIndex] && this.editors[this.state.currentBtnIndex].component.undoTo0();
    };

    undo = async () => {
        await this.setState({
            tmpBtn: Object.assign({}, this.state.tmpBtn, {
                dots: this.state.tmpBtn.dots.slice(0, this.state.tmpBtn.dots.length -1)
            })
        });
        if (this.state.tmpBtn.dots.length < 3) {
            await this.setState({
                tmpBtn: Object.assign({}, this.state.tmpBtn, {
                    action: {
                        type: null
                    }
                }),
                editingBtnAction: false
            });
        }
        this.editors[this.state.currentBtnIndex] && this.editors[this.state.currentBtnIndex].component.undo();
    };

    changeActionTypeHandler = (e) => {
        this.setState({
            tmpBtn: Object.assign({}, this.state.tmpBtn, {
                action: {
                    type: e.target.value
                }
            })
        });
    };

    clickShortcutHandler = async (data, rootAction) => {
        if (rootAction === 'redirect') {
            await this.setState({
                tmpBtn: Object.assign({}, this.state.tmpBtn, {
                    action: Object.assign({}, this.state.tmpBtn.action, {
                        data
                    })
                })
            });
        } else if (rootAction === 'getCoupon') {
            await this.setState({
                tmpBtn: Object.assign({}, this.state.tmpBtn, {
                    action: Object.assign({}, this.state.tmpBtn.action, {
                        type: rootAction,
                        data: {
                            afterGetCoupon: {
                                type: 'redirect',
                                data
                            }
                        }
                    })
                })
            });
        }
    };

    changeAfterGetCouponActionTypeHandler = ({target: {value}}) => {
        const newObj = Object.assign({}, this.state.tmpBtn, {
            action: Object.assign({}, this.state.tmpBtn.action, {
                data: {
                    afterGetCoupon: {
                        type: value
                    }
                }
            })
        });
        this.setState({
            tmpBtn: newObj
        });
    };

    judeDataCanSave = () => {
        const {dots, action} = this.state.tmpBtn;
        if (dots.length < 3) {
            return false;
        }
        if (!action.type) {
            return false;
        }
        switch (action.type) {
            case 'getCoupon':
                const type = getObjValueByPath(action, 'data.afterGetCoupon.type');
                if (type === 'nothing') return true;
                if (type === 'close') return true;
                if (type === 'redirect') {
                    const afterGetCouponData = getObjValueByPath(action, 'data.afterGetCoupon.data');
                    if (!afterGetCouponData) return false;
                    if (!getObjValueByPath(afterGetCouponData, 'wx.url')) {
                        return false;
                    }
                    if (!getObjValueByPath(afterGetCouponData, 'app.url')) {
                        return false;
                    }
                    return true;
                }
                return false;
                break;
            case 'redirect':
                const afterGetCouponData = getObjValueByPath(action, 'data');
                if (!afterGetCouponData) return false;
                if (!getObjValueByPath(afterGetCouponData, 'wx.url')) {
                    return false;
                }
                if (!getObjValueByPath(afterGetCouponData, 'app.url')) {
                    return false;
                }
                return true;
                break;
            case 'close':
                return true;
                break;
        }
        return true;
    };

    saveTmpData = async () => {
        const imgIndex = this.state.currentBtnIndex;
        const savedDataByImgIndex = [...this.state.savedData];

        const canvasWidth = this.editors[imgIndex].component.WIDTH;
        const canvasHeight = this.editors[imgIndex].component.HEIGHT;
        savedDataByImgIndex[imgIndex] = [...savedDataByImgIndex[imgIndex] || [], Object.assign({}, this.state.tmpBtn, {
            dots: this.state.tmpBtn.dots.map(({x, y}) => ({
                x: x / canvasWidth,
                y: y / canvasHeight
            }))
        })];
        await this.setState({
            savedData: savedDataByImgIndex,
            tmpBtn: {
                dots: [],
                action: {
                    type: null
                }
            },
            editingBtnAction: false
        });
        this.editors[this.state.currentBtnIndex] && this.editors[this.state.currentBtnIndex].component.saveData();
    };

    deleteButton = async (index, imgIndex) => {
        const savedDataByImgIndex = [...this.state.savedData];
        savedDataByImgIndex[imgIndex].splice(index, 1);
        await this.setState({
            savedData: savedDataByImgIndex
        });
        this.editors[imgIndex] && this.editors[imgIndex].component.deleteButton(index);
    };

    pushEditors = (key, component) => {
        if (this.editors.some(componentItem => componentItem.key === key)) return false;
        this.editors.push({
            key,
            component
        })
    };

    getWordByType = typeStr => {
        if (!typeStr) return false;
        return [
            {
                type: 'getCoupon',
                title: '获取优惠券'
            },
            {
                type: 'redirect',
                title: '页面跳转'
            },
            {
                type: 'close',
                title: '关闭'
            }
        ].filter(({type}) => typeStr === type)[0].title
    };

    mouseEnterButton = (imgIndex, dotIndex) => {
        this.editors[imgIndex] && this.editors[imgIndex].component.highlight(dotIndex, true);
    };

    mouseLeaveButton = (imgIndex, dotIndex) => {
        this.editors[imgIndex] && this.editors[imgIndex].component.highlight(dotIndex, false);
    };

    deleteImgHandler = index => {
        const savedData = this.state.savedData;
        savedData.splice(index, 1);
        this.setState({
            savedData: savedData
        });
        this.editors.splice(index, 1);
        this.props.deleteImgHandler(index);
    };

    render() {
        const data = this.props.data;
        const uploadedImages = data && data.uploadedImages || [];
        const showSave = this.judeDataCanSave();
        let hasShowedEditButtonArea = false;
        return(<div>
            <div className="pageEdit-container">
                <div className="page-layout">
                    <div>
                        {
                            uploadedImages.map((image, index) => (
                                <EditImage
                                    src={image}
                                    key={image + index}
                                    ref={component => this.pushEditors(image + index, component)}
                                    index={index}
                                    clickCanvasXYHandler={this.clickCanvasXYHandler}
                                />
                            ))
                        }
                        <div>
                            {
                                uploadedImages.length === 0 && (
                                    <div><br /><br /><br /><br /></div>
                                )
                            }

                            <UploadImg addImageHandler={this.props.addImageHandler} />
                        </div>
                    </div>
                </div>
                <div className="button-actions">
                    <div>
                        {
                            this.state.savedData.map((imgData, imgIndex) => {
                                if (imgData.length === 0) return null;
                                return (
                                    <Card
                                        key={imgIndex}
                                        title={'第' + (imgIndex + 1) + '张图片'}
                                        hoverable
                                    >
                                        <div>
                                            {
                                                imgData.map(({action, dots}, index) => {
                                                    return (
                                                        <div
                                                            key={action.type + '-' + dots.length + '-' + dots[0].x+ '-' + dots[0].y }
                                                            style={{
                                                                margin: '0.5em auto'
                                                            }}
                                                            onMouseEnter={() => this.mouseEnterButton(imgIndex, index)}
                                                            onMouseLeave={() => this.mouseLeaveButton(imgIndex, index)}
                                                        >
                                                            <Button
                                                                onClick={() => this.deleteButton(index, imgIndex)}
                                                                icon={'delete'}>
                                                                删除
                                                            </Button>
                                                            <span>
                                                    点击后:{this.getWordByType(action.type)}
                                                </span>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </Card>
                                )
                            })
                        }
                        {
                            this.state.tmpBtn.dots.length > 0 && !hasShowedEditButtonArea && (
                                <Card
                                    title="动作编辑"
                                    extra={<div>
                                        <Button icon="reload" onClick={this.undoTo0}>重绘</Button>
                                        <Button icon="rollback" onClick={this.undo}>撤销</Button>
                                    </div>}
                                    actions={
                                        showSave && [<div>
                                            <Button
                                                onClick={this.saveTmpData}
                                                type='primary'
                                                icon={'save'}>
                                                暂存
                                            </Button>
                                        </div>]
                                    }
                                >
                                    {
                                        this.state.tmpBtn.dots.length > 2 && (
                                            <div>
                                                <div>
                                                    <Timeline>
                                                        <Timeline.Item>用户点击按钮区域</Timeline.Item>
                                                        <Timeline.Item>
                                                            <RadioGroup
                                                                name="radiogroup"
                                                                defaultValue={this.state.tmpBtn.action.type || ''}
                                                                onChange={this.changeActionTypeHandler}
                                                            >
                                                                <Radio value={'getCoupon'}>领券</Radio>
                                                                <Radio value={'redirect'}>跳转</Radio>
                                                                <Radio value={'close'}>关闭</Radio>
                                                            </RadioGroup>
                                                        </Timeline.Item>
                                                        {
                                                            this.state.tmpBtn.action.type && this.state.tmpBtn.action.type !== 'close' && (
                                                                <Timeline.Item>
                                                                    <RenderFormByActionType
                                                                        type={this.state.tmpBtn.action.type}
                                                                        data={this.state.tmpBtn.action.data}
                                                                        clickShortcutHandler={this.clickShortcutHandler}
                                                                        changeAfterGetCouponActionTypeHandler={this.changeAfterGetCouponActionTypeHandler}
                                                                    />
                                                                </Timeline.Item>)
                                                        }
                                                    </Timeline>
                                                </div>
                                            </div>
                                        )
                                    }
                                </Card>
                            )
                        }
                    </div>
                </div>
            </div>
            {
                uploadedImages.length > 0 && (
                    <div className="page-thumbs">
                        <div className="page-thumbs-list">
                            {
                                uploadedImages.map((url, index) => (
                                        <Tooltip
                                            key={url + index}
                                        >
                                            <div
                                                /*onClick={() => {this.deleteImgHandler(index)}}*/
                                                className={'page-thumbs-list-item' + (this.state.currentBtnIndex === index ? ' choosed' : '')}
                                            >
                                                <img src={url} height={'100%'} />
                                                <div className='page-thumbs-list-item-btn-del'>
                                                    <Icon type='delete' style={
                                                        {
                                                            color: '#1890ff',
                                                            fontSize: '2em'
                                                        }
                                                    } />
                                                </div>
                                            </div>
                                        </Tooltip>
                                    )
                                )
                            }
                        </div>
                    </div>
                )
            }

        </div>);
    }
}

const RenderFormByActionType = ({
                                    type,
                                    data,
                                    clickShortcutHandler,
                                    changeAfterGetCouponActionTypeHandler
}) => {
    let renderForm;
    switch (type) {
        case 'getCoupon':
            renderForm = <RenderGetCouponForm
                data={data}
                changeAfterGetCouponActionTypeHandler={changeAfterGetCouponActionTypeHandler}
                clickShortcutHandler={(data) => clickShortcutHandler(data, 'getCoupon')}
            />;
            break;
        case 'redirect':
            renderForm = <RenderRedirectForm
                data={data}
                clickShortcutHandler={(data) => clickShortcutHandler(data, 'redirect')} />;
            break;
        case 'close':
            renderForm = null;
            break;
        default:
            renderForm = null;
            break;
    }
    return renderForm;
};

const RenderGetCouponForm = ({data = {
    afterGetCoupon: {
        type: ''
    }
}, changeAfterGetCouponActionTypeHandler, clickShortcutHandler}) => {
    return <div>
        <div>获取奖券成功后</div>
        <div>
            <RadioGroup
                name="afterGetCouponActionType"
                defaultValue={data.afterGetCoupon.type}
                onChange={changeAfterGetCouponActionTypeHandler}
            >
                <Radio value={'nothing'}>无动作</Radio>
                <Radio value={'redirect'}>跳转</Radio>
            </RadioGroup>
            {
                data.afterGetCoupon.type === 'redirect' ? (
                    <div>
                        <RenderRedirectForm data={data.afterGetCoupon.data} clickShortcutHandler={clickShortcutHandler}/>
                    </div>
                ) : null
            }
        </div>
    </div>
};


const RenderRedirectForm = ({data = {
    wx: {
        url: '',
        redirectType: 'inapp'
    },
    app: {
        url: '',
        redirectType: 'inapp'
    }
}, clickShortcutHandler}) => {
    const json = [{
        title: '个人主页',
        wx: {
            url: '/personal-center/user-index',
            redirectType: 'inapp'
        },
        app: {
            url: 'app::/personal-center/user-index',
            redirectType: 'inapp'
        }
    }, {
        title: '实名认证',
        wx: {
            url: '/ordering/user-certification',
            redirectType: 'inapp'
        },
        app: {
            url: '/ordering/user-certification',
            redirectType: 'inapp'
        }
    }, {
        title: '游伴认证',
        wx: {
            url: '/ordering/user-certification2',
            redirectType: 'inapp'
        },
        app: {
            url: '/ordering/user-certification2',
            redirectType: 'inapp'
        }
    }, {
        title: '经纪人认证',
        wx: {
            url: '/ordering/user-certification3',
            redirectType: 'inapp'
        },
        app: {
            url: '/ordering/user-certification3',
            redirectType: 'inapp'
        }
    }, {
        title: '充值中心',
        wx: {
            url: '/ordering/user-certification4',
            redirectType: 'inapp'
        },
        app: {
            url: '/ordering/user-certification4',
            redirectType: 'inapp'
        }
    }, {
        title: '直播列表',
        wx: {
            url: '/ordering/user-certification5',
            redirectType: 'inapp'
        },
        app: {
            url: '/ordering/user-certification5',
            redirectType: 'inapp'
        }
    }];
    const currentIndex = json.findIndex(item => (
        data.wx.url === item.wx.url && data.wx.redirectType === item.wx.redirectType
    ) && (
        item.app.url === data.app.url && item.app.redirectType === data.app.redirectType
    ));
    return (
        <div>
            <div>
                <div>跳转到</div>
                <div>
                    <div>
                        <div>公众号</div>
                        <div>
                            <input type="text" name="" value={data.wx.url} />
                        </div>
                        <div>
                            <RadioGroup
                                name="wxRedirectType"
                                defaultValue={data.wx.redirectType}
                            >
                                <Radio value={'inapp'}>站内跳转</Radio>
                                <Radio value={'outOfApp'}>站外跳转</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div>
                        <div>App</div>
                        <div>
                            <input type="text" name="" value={data.app.url} />
                        </div>
                        <div>
                            <RadioGroup
                                name="appRedirectType"
                                defaultValue={data.app.redirectType}
                            >
                                <Radio value={'inapp'}>App内跳转</Radio>
                                <Radio value={'outOfApp'}>App外跳转</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>快捷方式</div>
                <div>
                    {
                        json.map((item, index) => {
                            return (<Button
                                    key={item.title}
                                    type={currentIndex === index ? 'primary' : 'dashed'}
                                    onClick={() => {clickShortcutHandler(item)}}
                                >{item.title}</Button>);
                        })
                    }
                </div>
            </div>
        </div>
    );
};
