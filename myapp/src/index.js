import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {/* TODO */}
        { this.props.value }
      </button>
    );
  }
}

/** 
 * 如果组件只包含一个render方法，并且不包含state,那推荐使用函数组件，这样会更简单
*/
// function Square (props) {
//   return (
//     <button className = 'squqre' onClick={props.onClick}>
//       { props.value }
//     </button>
//   )
// }

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value = { this.props.squares[i] }
        onClick = { () => this.props.onClick(i) }
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step, move) => {
      const desc = move ? `Go to move # ${move}` : `Go to game start`;
      return (
        <li key={ move }>
          <button onClick = {() => this.jumpTo(move)}>{ desc }</button>
        </li>
      );
    } )

    let status;
    if (winner) {
      status = 'Winner:' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = { current.squares }
            onClick = { (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================
class Toggle extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isToggle: true
    }
    // this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.setState( state => ({
      isToggle: !state.isToggle
    }))
  }

  render () {
    return (
      // <button onClick = { this.handleClick.bind(this) }>
      <button onClick = { e => this.handleClick(e) }>
        { this.state.isToggle ? 'ON' : 'OFF' }
      </button>
    )
  }
}

// ====================
// 状态提升
function toCelsius (fahrenheit) {
  return (fahrenheit -32) * 5 / 9;
}
function toFahrenheit (celsius) {
  return (celsius * 9 / 5) + 32;
}
function BoilingVerdict (props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
class Calculator extends React.Component {
  constructor (props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {
      temperature: '',
      scale: 'c'
    }
  }

  // handleChange (e) {
  //   this.setState({
  //     temperature: e.target.value
  //   })
  // }

  handleCelsiusChange (temperature) {
    this.setState({
      scale: 'c',
      temperature
    })
  }

  handleFahrenheitChange (temperature) {
    this.setState({
      scale: 'f',
      temperature
    })
  }

  render () {
    const temperature = this.state.temperature;
    const scale = this.state.scale;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      // <fieldset>
      //   <legend>Enter temperature in Celsius</legend>
      //   <input
      //     value = {temperature}
      //     onChange = { this.handleChange }
      //   />
      //   <BoilingVerdict celsius = { parseFloat(temperature) }/>
      // </fieldset>
      <div>
        <TemperatureInput
          onTemperatureChange = { this.handleCelsiusChange }
          temperature = { celsius }
          scale = 'c'/>
        <TemperatureInput
          onTemperatureChange = { this.handleFahrenheitChange }
          temperature = { fahrenheit }
          scale = 'f'/>
        <BoilingVerdict celsius = { parseFloat(celsius) }/>
      </div>
    )
  }
}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}
class TemperatureInput extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      temperature: ''
    };
  }
  handleChange (e) {
    // this.setState({
    //   temperature: e.target.value
    // })
    this.props.onTemperatureChange(e.target.value)
  }
  render () {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in { scaleNames[scale] }</legend>
        <input
          value = { temperature }
          onChange = { this.handleChange }/>
      </fieldset>
    )
  }
}
function tryConvert (temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

ReactDOM.render(
  // <Game />,
  // <Toggle />,
  <Calculator />,
  document.getElementById('root')
);
