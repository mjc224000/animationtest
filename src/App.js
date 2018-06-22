import React, {Component} from 'react';
import Tween from 'rc-tween-one';
import propTypes from 'prop-types';
import './App.css';
import imgUrl from './img/sjb.jpg'

const Separate = 'Separate';
const Flip = 'Flip';
const Spiral = 'Spiral';
const WrapRotate = 'WrapRotate';
const Default = 'Default';
const SpiralBlast = 'SpiralBlast';

class Block extends Component {
    static propTypes = {
        x: propTypes.number.isRequired,
        y: propTypes.number.isRequired,
        width: propTypes.number.isRequired,
        height: propTypes.number.isRequired,
        frontImg: propTypes.string.isRequired,
        Style: {font: 'inherit'}
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {x, y, width, height, frontImg} = this.props;
        return (
            <Tween style={{
                position: 'absolute', left: x, top: y,
                transformStyle: 'preserve-3d',
                perspective: '2000px',
                transformOrigin: '50% 50%',
                width: width,
                height: height,

            }}
                   animation={this.props.animation}>
                <Tween animation={this.props.outAnimation} style={{
                    transformStyle: 'preserve-3d',
                    perspective: '2000px',
                    transformOrigin: '50% 50%',
                }}>
                    <ul className={'block'}>
                        <li style={{
                            backgroundImage: `url(${frontImg}) `,
                            width: width, height: height,
                            backgroundPosition: -x + 'px ' + -y + 'px',
                            backgroundSize: '1200px 600px'
                        }}
                            className="front"></li>
                        <li className="back"
                            style={{
                                width: width, height: height,
                                transformOrigin: '50% 50%',
                                textAlign: 'center',
                                lineHeight: '100%',
                                transform: ` translateZ(${-height / 4}px) rotateX(180deg) rotate(180deg) `
                            }}>
                            hire me
                        </li>
                        <li className="top" style={{width: width, height: height / 4}}></li>
                        <li className="bottom" style={{
                            width: width, height: height / 4,
                            transform: `translateY(${height}px) rotateX(90deg) translateY(${-height / 4}px)`
                        }}></li>
                        <li className="left"></li>
                        <li className="right"></li>
                    </ul>
                </Tween>

            </Tween>)
    }
}


class App extends Component {
    static defaultProps = {
        column:4,
        row: 6,
        width: 1200,
        height: 600,
    }

    componentWillMount() {
        const {column, row} = this.props;
        let result = [];
        var _this = this;
        [Separate, Flip, Spiral, WrapRotate, Spiral, SpiralBlast].forEach(function (v) {
            for (let i = 0; i < column; i++) {
                for (let j = 0; j < row; j++) {
                    result[v] = result[v] || [];
                    result[v][i + '_' + j] = _this['get' + v]({x: i, y: j});
                }
            }
        })
        this.setState({animateData: result});
    }

    constructor(props) {
        super(props);
        this.state = {
            frontImg: imgUrl,
            animateData: [],
            currentInnerAnimationName: Separate,
            currentOuterAnimationName: '',
            Style: {font: 'inherit'}
        }
        this.getSeparate = this.getSeparate.bind(this);
        this.onComplete = this.onComplete(() => this.animationQueueManager()).bind(this)
    }

    animationQueueManager = (() => {
        var num = 0;
        return () => {
            switch (num) {
                case 0: {
                    this.setState({currentInnerAnimationName: Flip});
                    num++;
                    return
                }
                case 1: {
                    this.setState({currentInnerAnimationName: Spiral})
                    num++;
                    return
                }
                case 2: {

                    this.setState({currentOuterAnimationName: SpiralBlast, currentInnerAnimationName: Default});
                    return
                }

            }
        }
    })()

    getSeparate({x, y}) {
        const {width, height, column, row} = this.props;
        var centerX = width / 2,
            centerY = height / 2,
            blockWidth = width / column,
            blockHeight = height / row,
            dX = x * blockWidth,
            dY = y * blockHeight;
        var data = [{
            x: (dX - centerX) * Math.random() * 2,
            y: (dY - centerY) * Math.random() * 2,
            rotateX: Math.random() * 360 + 'deg',
            rotateY: Math.random() * 360 + 'deg',
            ease: 'easeOutElastic',
            duration: 2000
        },
            {rotateX: 0, rotateY: 0, ease: 'easeOutElastic', duration: 200, delay: Math.random() * 1000},
            {x: 0, y: 0, ease: 'easeOutElastic', duration: 2000, onComplete: this.onComplete}
        ]
        return data
    }

    getFlip() {
        return {rotateX: 180, rotate: 180, duration: 1000, delay: Math.random() * 1000, onComplete: this.onComplete}
    }

    getSpiral({x, y}) {
        const {width, height, column, row} = this.props
        var centerX = width / 2,
            centerY = height / 2,
            blockWidth = width / column,
            blockHeight = height / row,
            singularX = -x * blockWidth,
            singularY = -y * blockHeight;
        return [
            {rotateX: 0, rotate: 0, rotateY: 0, duration: 200},
            {x: singularX + centerX, y: singularY + centerY},
            {translateZ: -400},
            {rotateX: parseInt(x / column * 360), rotateY: parseInt(y / row * 360), onComplete: this.onComplete}
        ]
    }

    getWrapRotate({x, y}) {
        const {column, row} = this.props
        return [{rotateX: x / column * 360, rotateY: y / row * 360, translateZ: -400}]
    }

    getSpiralBlast() {
        return [{translateZ: 300}]
    }

    makeBlock() {
        const {column, row, width, height} = this.props;
        var blockWidth = width / column,
            blockHeight = height / row;
        var res = [];
        for (var i = 0; i < column; i++) {
            for (var j = 0; j < row; j++) {
                res.push({
                    width: blockWidth,
                    height: blockHeight,
                    x: i * blockWidth,
                    y: j * blockHeight,
                    key: i + '_' + j
                })
            }
        }
        return res
    }

    onComplete = ((cb) => {
        const {column, row} = this.props;
        const total = column * row;
        let count = 0;
        return () => {
            count++
            if (count === total) {
                setTimeout(function () {
                    cb();
                    count = 0;
                })
            }
        }
    })

    render() {
        var blockArr = this.makeBlock(),
            name = this.state.currentInnerAnimationName,
            outerName = this.state.currentOuterAnimationName;
        let outerAnimation = this.state.animateData[outerName] || [],
            innerAnimation = this.state.animateData[name] || [];
        console.log(outerAnimation);
        return (
            <div className={'wrap'}>
                {blockArr.map(v => {
                    return <Block key={v.key} {...v} frontImg={this.state.frontImg}
                                  outAnimation={outerAnimation[v.key]}
                                  animation={innerAnimation[v.key]}/>
                })}
            </div>)
    }
}

export default App;
