import React, {Component} from 'react';
import Tween from 'rc-tween-one';
import propTypes from 'prop-types';
import './App.css';
import imgUrl from './img/sjb.jpg'
import aUrl from './img/another.jpg'
const Separate = 'Separate'
var store = {
    count: 0,
    arr: [],
    animateData: []
}

class Block extends Component {
    static propTypes = {
        x: propTypes.number.isRequired,
        y: propTypes.number.isRequired,
        width: propTypes.number.isRequired,
        height: propTypes.number.isRequired,
        frontImg: propTypes.string.isRequired,
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
                height: height
            }}
                   animation={this.props.animation} >
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
            </Tween>)
    }
}


class App extends Component {
    static defaultProps = {
        column: 4,
        row: 6,
        width: 1200,
        height: 600,
    }

    componentWillMount() {
        const {column, row} = this.props;
        for (var i = 0; i < column; i++) {
            for (var j = 0; j < row; j++) {
                this.getSeparate({x: i, y: j})
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {frontImg: imgUrl, total: 0}
        this.getSeparate = this.getSeparate.bind(this);
    }

    getSeparate({x, y}) {
        var key = x + '_' + y;
        if (!store.animateData[Separate]) {
            store.animateData[Separate] = [];
        }
        if (store.animateData[Separate][key]) {
            return store.animateData[Separate][key]
        }
        const {width, height, column, row} = this.props

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
            {rotateX: 0, rotateY: 0, ease: 'easeOutElastic', duration: 200},
            {x: 0, y: 0, ease: 'easeOutElastic', duration: 2000,onComplete:this.onComplete}
        ]
        store.animateData[Separate][key] = data
        return data
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

    onComplete = (() => {
        const {column, row} = this.props;
       const total = column * row;
       let count=0;
        return ()=>{
            count++
            if(count===total)
            setTimeout(() => this.setState({frontImg: aUrl}))
        }
    })()

    /*    onComplete() {
            const {column, row} = this.props,
                total = column * row;
            store.count++;
            if (store.count === total) {
                setTimeout(() => this.setState({frontImg: aUrl}, () => store.count = 0))
            }
        }*/

    render() {
        var blockArr = this.makeBlock();

        return (
            <div className={'wrap'}>
                {blockArr.map(v => {
                    return <Block key={v.key} {...v} frontImg={this.state.frontImg} onComplete={this.onComplete}
                                  animation={store.animateData[Separate][v.key]}/>
                })}
            </div>)
    }
}

export default App;
