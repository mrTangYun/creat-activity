import React from 'react';
import EditButton from './editButtonActions';

const Style = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
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
class Canvas extends React.PureComponent {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.clickXYHandler = this.clickXYHandler.bind(this);
        this.draw = this.draw.bind(this);
        this.clearHandler = this.clearHandler.bind(this);
        this.beginEditHandler = this.beginEditHandler.bind(this);
        this.toogleFloatTool = this.toogleFloatTool.bind(this);
        this.getActionHandler = this.getActionHandler.bind(this);
        this.state = {
            showFloatTool: false,
            isEditAction: false
        };
        this.dotArr = [];
        this.data = this.data || [];
        this.highlightIndex = null;
    }

    toogleFloatTool() {
        this.setState({
            showFloatTool: !!this.tmpArray.length,
            showEditButton: this.tmpArray.length > 2
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this.ctx = this.canvas.getContext("2d");
    }


    clickHandler(e) {
        e.preventDefault();
        const {screenX, pageX, clientX, nativeEvent: {offsetX, offsetY}} = e;
        this.clickXYHandler(offsetX, offsetY);
        this.props.clickXYHandler(offsetX, offsetY, this.ctx);
    }

    beginEditHandler() {
        this.setState({
            isEditAction: true
        });
    }

    drawDots(dots) {
        if (dots.length) {
            const context = this.ctx;
            dots.map(dot => {
                context.beginPath();
                context.arc(dot.x, dot.y, 5, 0, 2 * Math.PI, false);
                context.fillStyle = 'red';
                context.fill();
                context.lineWidth = 0;
                // context.stroke();
            });
        }
    }
    drawLines(dots, highlight) {
        if (dots.length > 2) {
            const context = this.ctx;
            dots.map((dot, index) => {
                if (index === 0) {
                    context.beginPath();
                    context.moveTo(dot.x, dot.y);
                } else if (index === dots.length - 1) {
                    context.lineTo(dot.x, dot.y);
                    context.fillStyle = highlight ? 'rgba(255, 255, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)';
                    context.fill();
                    context.closePath();
                } else {
                    context.lineTo(dot.x, dot.y);
                }
            });
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.dotArr.map((dots, index) => {
            this.drawLines(dots, this.highlightIndex === index)
        });
        this.drawLines(this.tmpArray);
        this.drawDots(this.tmpArray);
    }

    clickXYHandler(x, y) {
        if (!this.isDrawing) {
            this.tmpArray = [{x, y}];
            this.isDrawing = true;
        } else {
            this.tmpArray = [...this.tmpArray, {x, y}];
        }
        this.draw();
        this.toogleFloatTool();
    }

    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    getActionHandler() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.data = [...this.data, {
            dots: this.tmpArray.map(({x, y}) => ({
                x: x / w,
                y: y / h
            }))
        }];
        this.setState({
            isEditAction: false,
            showFloatTool: false,
            showEditButton: false
        });
        this.dotArr = [...this.dotArr, this.tmpArray];
        this.tmpArray = [];
        this.draw();
    }

    saveDataHandler = () => {
        if (this.data.length) {
        }
    };

    backHandler = () => {
        this.tmpArray.pop();
        this.draw();
        this.toogleFloatTool();
    };

    clearHandler() {
        this.tmpArray = [];
        this.draw();
        this.toogleFloatTool();
    }
    undo = () => {
        this.backHandler();
    };
    undoTo0 = () => {
        this.clearHandler();
    };

    saveData = () => {
        this.getActionHandler();
    };

    deleteButton = (index) => {
        const newSavedData = [...this.dotArr];
        newSavedData.splice(index, 1);
        this.dotArr = newSavedData;
        this.draw();
    };

    highlight = (dotIndex, value) => {
        if (value) {
            this.highlightIndex = dotIndex;
        }
        else {
            this.highlightIndex = -1;
        }
        this.draw();
    };

    render() {
        const {showFloatTool, isEditAction, showEditButton} = this.state;
        return (
            <div>
                <div ref={node => this.container = node}
                     style={Style.container}>
                    <canvas
                        width={'0'}
                        height={'0'}
                        style={Style.canvas}
                        ref={node => this.canvas = node}
                        onClick={this.clickHandler}
                    >
                    </canvas>
                </div>
            </div>

        );
    }
}

export default Canvas