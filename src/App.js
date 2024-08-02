import { useState } from "react";
import { useEffect, useRef } from "react";

const answer = "618246";

export default function App() {
  const [codeLength, setCodeLength] = useState(6);
  const [win, setWin] = useState(null);
  return (
    <>
      <Header />
      {win && <Summary win={win} />}
      <Settings setCodeLength={setCodeLength} />
      <Table codeLength={codeLength} setWin={setWin} />
    </>
  );
}

function Summary({ win }) {
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setShowSummary(true); // Trigger the animation when component mounts
  }, []);
  return (
    <div className="summary-background">
      <div className={`summary ${showSummary ? "show" : ""}`}>
        <h5>Your results</h5>
        You won on the {win}'s try
      </div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1 className="header-title">CRACK THE CODE</h1>
    </header>
  );
}

function checkSpots(rowOutput, answer) {
  const rowOutputArray = rowOutput.split("");
  const answerArray = answer.split("");

  const greenSpots = rowOutputArray.map(
    (char, index) => char === answerArray[index]
  );
  const yellowSpots = new Array(rowOutputArray.length).fill(false);
  let remainingAnswer = answerArray.slice();

  greenSpots.forEach((isGreen, index) => {
    if (isGreen) {
      remainingAnswer[index] = null;
    }
  });

  rowOutputArray.forEach((char, index) => {
    if (!greenSpots[index] && remainingAnswer.includes(char)) {
      yellowSpots[index] = true;
      remainingAnswer[remainingAnswer.indexOf(char)] = null;
    }
  });

  return { greenSpots, yellowSpots };
}

function Settings({ setCodeLength }) {
  return (
    <div className="settings">
      <h3>Choose length of your code</h3>
      <select onChange={(e) => setCodeLength(e.target.value)}>
        {Array.from([4, 5, 6, 7, 8, 9]).map((int, index) => (
          <option key={index}>{int}</option>
        ))}
      </select>
    </div>
  );
}

function Table({ codeLength, setWin }) {
  const [activeNum, setActiveNum] = useState(0);
  const howManyRows = 7;
  return (
    <div className="table">
      {Array.from({ length: howManyRows }).map((_, index) => (
        <TableRow
          key={index}
          index={index}
          isActive={activeNum === index}
          onSetActiveNum={setActiveNum}
          length={codeLength}
          setWin={setWin}
        />
      ))}
    </div>
  );
}

function TableRow({ index, isActive, onSetActiveNum, length, setWin }) {
  const [rowOutput, setRowOutput] = useState(() => "X".repeat(length));
  const [rightSpot, setRightSpot] = useState(() =>
    Array.from({ length }, () => null)
  );
  const [notRightSpot, setNotRightSpot] = useState(() =>
    Array.from({ length }, () => null)
  );
  const inputsRef = useRef([]);
  const isFilled = !rowOutput.includes("X") && rowOutput.length === length;

  useEffect(() => {
    if (isFilled) {
      const { greenSpots, yellowSpots } = checkSpots(rowOutput, answer);
      setRightSpot(greenSpots);
      setNotRightSpot(yellowSpots);
      onSetActiveNum((num) =>
        greenSpots.includes(false) ? (num < length - 1 ? num + 1 : num) : null
      );
      if (!greenSpots.includes(false)) setWin(index + 1);
    }
  }, [isFilled, onSetActiveNum, rowOutput, setWin, index, length]);
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [isActive]);

  function handleChangeOutput(index, newValue) {
    if (newValue !== "") {
      setRowOutput(
        (output) => output.slice(0, index) + newValue + output.slice(index + 1)
      );
      if (index < length - 1) inputsRef.current[index + 1].focus();
    } else {
      setRowOutput(
        (output) => output.slice(0, index) + "X" + output.slice(index + 1)
      );
    }
  }

  return (
    <div className={isActive ? "table-row" : "table-row not-active"}>
      {Array.from({ length }).map((_, index) => (
        <BlockInput
          key={index}
          index={index}
          onChangeValue={handleChangeOutput}
          rightSpot={rightSpot}
          notRightSpot={notRightSpot}
          isActive={isActive}
          inputRef={(el) => (inputsRef.current[index] = el)}
        />
      ))}
    </div>
  );
}

function BlockInput({
  index,
  onChangeValue,
  rightSpot,
  notRightSpot,
  isActive,
  inputRef,
}) {
  const [value, setValue] = useState("");
  function handleChange(e) {
    if (e.target.value.length > 1) return false;
    setValue(e.target.value);
    onChangeValue(index, e.target.value);
  }
  return (
    <div
      className="block-input"
      style={{
        backgroundColor: rightSpot[index]
          ? "#a8bdb0"
          : notRightSpot[index]
          ? "#fff4a3"
          : "transparent",
      }}
    >
      <input
        type="number"
        value={value}
        onChange={(e) => handleChange(e)}
        disabled={!isActive}
        ref={inputRef}
        autoFocus={true}
      />
    </div>
  );
}
