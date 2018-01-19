import React from 'react';
import { Spin } from 'antd';

const Style = {
    container: {
        position: 'relative'
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
    }
};
export default class ShowAcitvity extends React.Component {

    render() {
        const {pageData} = this.props;
        if (!pageData) return null;
        const pages = pageData.pages;
        return (
            <div>
                {
                    pages.map((pageData, pageIndex) => (
                        <div key={pageIndex}>
                            {
                                pageData.map(({url, coords}, index) => (
                                    <div key={index}>
                                        <RenderImgContainer
                                            src={url}
                                            mapName={'map-' + pageIndex + '-' + index}
                                            coords={coords || []}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        );
    }
}


export class RenderImgContainer extends React.PureComponent{
    constructor(props) {
        super(props);
        this.loadImg = this.loadImg.bind(this);
        this.state = {
            loadingImg: true
        };
        this.resizeCanvas = this.resizeCanvas.bind(this);
    }

    loadImg(src) {
        if (src) {
            let oImg = new Image();
            oImg.src = src || '';
            oImg.onload = e => {
                this._isMounted && (this.img.src = src);
                this.width = this.img.offsetWidth;
                this.height = this.img.offsetHeight;
                // this.resizeCanvas(this.width, this.height);
                oImg = null;
                this.setState({
                    loadingImg: false
                });
            };
        }
    }

    resizeCanvas(width, height) {
        this.WIDTH = width;
        this.HEIGHT = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadImg(this.props.src);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    clickBtnHandler = ({type, data}) => {
        console.log(data);
        if (type === 'close') {
            console.log('关闭');
            return false;
        }
        if (type === 'getCoupon') {
            console.log('获取优惠券');
            return false;
        }
        if (type === 'redirect') {
            console.log('重定向');
            return false;
        }

    };
    render() {
        const {mapName, coords} = this.props;
        return (
            <div style={Style.container}>
                <img
                    ref={img => this.img = img}
                    width={'100%'}
                    useMap={'#' + mapName}
                />
                {
                    !this.state.loadingImg && coords.length > 0 && (
                        <map name={mapName} id={mapName}>
                            {
                                coords.map((button, btnIndex) => (
                                    <RenderArea
                                        key={btnIndex}
                                        dots={button.dots}
                                        width={this.width}
                                        height={this.height}
                                        clickBtnHandler={() => {
                                            this.clickBtnHandler(button.action)
                                        }}
                                    />
                                ))
                            }
                        </map>
                    )
                }
                {
                    this.state.loadingImg && <Spin size="large" />
                }
            </div>
        );
    }
}

function RenderArea({dots, width, height, clickBtnHandler}) {
    let coordArra = [];
    dots.map(({x, y}) => {
        coordArra = [...coordArra, x * width, y * height]
    });
    return (
        <area shape='poly' coords={coordArra.join(',')} onClick={clickBtnHandler}/>
    );
}