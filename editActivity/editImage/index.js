import React from 'react';
import Canvas from './canvas';
import { Spin } from 'antd';

const Style = {
    container: {
        position: 'relative'
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};

class AddButtons extends React.PureComponent {
    constructor(props) {
        super(props);
        this.loadImg = this.loadImg.bind(this);
        this._handleWindowResize = this._handleWindowResize.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.state = {
            loadingImg: true
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadImg(this.props.src);
        window.addEventListener('resize', this._handleWindowResize);
    }

    getSize = () => {
        console.log('hello');
        return {
            width: this.width,
            height: this.height
        }
    };

    static WIDTH = 0;
    static HEIGHT = 0;

    resizeCanvas(width, height) {
        this.WIDTH = width;
        this.HEIGHT = height;
        this.canvas.resizeCanvas(width, height);
    }

    loadImg(src) {
        if (src) {
            let oImg = new Image();
            oImg.src = src || '';
            oImg.onload = e => {
                this._isMounted && (this.img.src = src);
                this.resizeCanvas(this.img.offsetWidth, this.img.offsetHeight);
                oImg = null;
                this.setState({
                    loadingImg: false
                });
            };
        }
    }

    _handleWindowResize(e) {
        this.resizeCanvas(this.container.offsetWidth, this.container.offsetHeight);
    }
    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('resize', this._handleWindowResize);
    }

    saveDataHandler = data => {
        console.log(data);
    };

    clickCanvasXYHandler = (x, y) => {
        this.props.clickCanvasXYHandler(x, y, this.props.index);
    };

    undo = () => {
        this.canvas.undo();
    };
    undoTo0 = () => {
        this.canvas.undoTo0();
    };

    saveData = () => {
        this.canvas.saveData();
    };

    deleteButton = (index) => {
        this.canvas.deleteButton(index);
    };

    highlight = (dotIndex, value) => {
        this.canvas.highlight(dotIndex, value);
    };


    render() {
        return (
            <div style={Style.container} ref={node => this.container = node}>
                <img ref={img => this.img = img} width={'100%'}/>
                {
                    this.state.loadingImg && <Spin size="large" />
                }
                <Canvas
                    width={'0'}
                    height={'0'}
                    style={Style.canvas}
                    ref={node => this.canvas = node}
                    saveDataHandler={this.saveDataHandler}
                    clickXYHandler={this.clickCanvasXYHandler}
                >
                </Canvas>
            </div>
        );
    }
}

export default AddButtons

