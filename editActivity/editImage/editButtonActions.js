import React from 'react';

const Style = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff'
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'transparent'
    },
    floatTool: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2em',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    actionTypeStep1: {
        display: 'flex'
    },
    actionTypeStep1_item: {
        flex: 1
    }
};
class Edit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            obj: props.data || {},
            step: 0,
            isLastStep: false
        };
    }

    onChooseStep1Hander = type => {
        this.setState({
            obj: {
                type
            },
            isLastStep: type === 'close' || type === 'getCoupon'
        });
    };
    onChooseStep2Hander = type => {
        this.setState({
            obj: {
                type: this.state.obj.type,
                pushAction: type
            },
            isLastStep: true
        });
    };


    clickNextHandler = () => {
        const currentStep = this.state.step;
        if (this.state.isLastStep) {
            console.log('保存数据');
            this.props.dispach({
                action: 'save',
                payload: this.state.obj
            });
        } else {
            this.setState({
                step: currentStep + 1
            });
        }
    };
    render() {
        const {obj, step} = this.state;
        let showNextBtn;
        let isLastStep;
        switch (step) {
            case 0:
                showNextBtn = !!obj.type;
                isLastStep = ['close', 'getCoupon'].some(item => item === obj.type);
                break;
            case 1:
                showNextBtn = !!obj.pushAction;
                isLastStep = true;
                break;
            default:
                showNextBtn = false;
                break;
        }
        return (
            <div
                ref={node => this.container = node}
                style={Style.container}>
                {
                    step === 0 && (<EditClickType type={obj.type} onChooseStep1Hander={this.onChooseStep1Hander} />)
                }
                {
                    step === 1 && (<EditPush data={obj.pushAction} onChooseStep2Hander={this.onChooseStep2Hander}  />)
                }
                <div onClick={() => {
                    if (showNextBtn) {
                        this.clickNextHandler();
                    }
                }}>
                    {isLastStep ? '保存' : '下一步'}
                </div>
            </div>
        );
    }
}

export default Edit

export class EditPush extends React.PureComponent{
    constructor(props) {
        super(props);
        this.json = [{
            title: '个人主页',
            wx: "/personal-center/user-index",
            app: "app::/personal-center/user-index"
        }, {
            title: '实名认证',
            wx: "/ordering/user-certification",
            app: "app::/ordering/user-certification"
        }, {
            title: '游伴认证',
            wx: "/personal-center/become-playmate/certification",
            app: "app::/personal-center/become-playmate/certification"
        }, {
            title: '经纪人认证',
            wx: "/personal-center/broker-certification",
            app: "app::/personal-center/broker-certification"
        }, {
            title: '充值中心',
            wx: "//personal-center/wallet/index",
            app: "app:://personal-center/wallet/index"
        }, {
            title: '直播列表',
            wx: "/lives",
            app: "app::///lives"
        }];
    }
    static defaultProps = {
        data : {
            wx: '',
            app: ''
        }
    };
    render() {
        const {wx, app} = this.props.data;
        const currentIndex = this.json.findIndex(item => item.wx === wx && item.app === app);
        return (
            <div style={Style.actionTypeStep2}>
                <div>重定向地址</div>
                <div>
                    {
                        this.json.map((item, index) => {
                            return (<div
                                key={item.title}
                                onClick={() => {this.props.onChooseStep2Hander(item)}}
                                className={currentIndex === index ? 'choosed' : ''}
                            >{item.title}</div>);
                        })
                    }
                </div>
            </div>
        )
    }
}

export const EditClickType = ({type, onChooseStep1Hander}) => (
    <div style={Style.actionTypeStep1}>
        <div
            style={Style.actionTypeStep1_item}
            className={type === 'getCoupon' ? 'choosed' : ''}
            onClick={() => onChooseStep1Hander('getCoupon')}
        >
            领券
        </div>
        <div
            style={Style.actionTypeStep1_item}
            className={type === 'push' ? 'choosed' : ''}
            onClick={() => onChooseStep1Hander('push')}
        >
            跳转
        </div>
        <div
            style={Style.actionTypeStep1_item}
            className={type === 'close' ? 'choosed' : ''}
            onClick={() => onChooseStep1Hander('close')}
        >
            关闭
        </div>
    </div>
);
