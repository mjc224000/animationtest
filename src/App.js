import React, {Component} from 'react';
import Tween from 'rc-tween-one';
import propTypes from 'prop-types';
import './App.css';

class Block extends Component {
    static PropTypes = {
        x: propTypes.number.isRequired,
        y: propTypes.number.isRequired,
        width: propTypes.number.isRequired,
        height: propTypes.number.isRequired,
        img: propTypes.string.isRequired
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {x, y, width, height, img} = this.props;

        return (
            <ul className={'block'}>
                <li style={{background: `url(${img}) no-repeat ${-x} ${-y}`, width: width, height: height}}
                    className="front"></li>
                <li className="back"></li>
                <li className="top"></li>
                <li className="bottom"></li>
                <li className="left"></li>
                <li className="right"></li>
            </ul>)
    }
}

class App extends Component {
    makeBlock() {

    }

    render() {
        return (
            <div className={'wrap'}>
                <Tween animation={[{translateX: 200, duration: 2000},
                    {translateY: 100}
                ]}>

                    <div> 里面放依托是你觉得怎么样</div>
                </Tween>
            </div>)
    }
}

export default App;
