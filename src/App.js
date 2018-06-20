import React, {Component} from 'react';
import Tween from 'rc-tween-one';
import propTypes from 'prop-types';
import './App.css';
import imgUrl from './img/sjb.jpg'
import aUrl from './img/another.jpg';
class Block extends Component {
    static propTypes = {
        x: propTypes.number.isRequired,
        y: propTypes.number.isRequired,
        width: propTypes.number.isRequired,
        height: propTypes.number.isRequired,
        img: propTypes.string.isRequired,
        deX: propTypes.number.isRequired,
        deY: propTypes.number.isRequired
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {x, y, width, height, img, delay, deX, deY} = this.props;

        return (
            <Tween style={{
                position: 'absolute', left: x, top: y,
                transformStyle: 'preserve-3d',
                perspective: '2000px',
                transformOrigin: '50% 50%',
                width: width,
                height: height,
                delay: 100
            }}

                   animation={[
                       {
                           x: deX,
                           y: deY,
                           rotateX: Math.random() * 360 + 'deg',
                           rotateY: Math.random() * 360 + 'deg',
                           ease: 'easeOutElastic',
                           duration: 2000
                       },
                       {rotateY: 0, rotateX: 0, duration: 200, delay},
                       {x: 0, y: 0, ease: 'easeOutElastic', duration: 2000},
                       {rotateX: 180, rotate: 180, delay: delay + 2000, onComplete: this.props.onComplete}
                       /*    {rotateX: '180deg',rotateY:'180deg', duration: 2000, ease: "easeOutBounce", delay},*/

                   ]}
            >
                <ul className={'block'}>
                    <li style={{
                        backgroundImage: `url(${img}) `,
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
            </Tween>)
    }
}

var store={
    count:0,
    arr:[],
}

class App extends Component {
    static defaultProps = {
        column: 4,
        row: 6,
        width: 1200,
        height: 600
    }

    makeBlock() {
        const {column, row, width, height} = this.props;
        var blockWidth = width / column,
            blockHeight = height / row,
            res = [];
        for (var i = 0; i < column; i++) {
            for (var j = 0; j < row; j++) {
                res.push({
                    width: blockWidth,
                    height: blockHeight,
                    x: i * blockWidth,
                    y: j * blockHeight,
                    img: imgUrl,
                    delay: parseInt(Math.random() * 2000)
                })
            }
        }
        return res
    }

    onComplete(v) {

        v.target['isFirst']=false;
        const {column, row} = this.props,
            total = column * row;
        store.count++;
        if (store.count == total) {
            console.log(store.count);
        }
    }

    getDistance({x, y}) {
        var centerX = this.props.width / 2,
            centerY = this.props.height / 2;
        return {
            deX: (x - centerX) * Math.random() * 2,
            deY: (y - centerY) * Math.random() * 2
        }
    }

    render() {
        var blockArr = this.makeBlock();
        console.log(blockArr);

        return (
            <div className={'wrap'}>
                {blockArr.map(v => {
                    const {x, y} = v,
                        {deX, deY} = this.getDistance({x, y});
                    return <Block {...v} onComplete={this.onComplete.bind(this)} deX={deX} deY={deY}/>
                })}


            </div>)
    }
}

export default App;
