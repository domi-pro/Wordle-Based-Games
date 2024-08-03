import { useState } from "react";
import { useEffect, useRef } from "react";
import { useKey } from "./useKey";

export default function App() {
  const [codeLength, setCodeLength] = useState(null);
  const [win, setWin] = useState(null);
  const [loss, setLoss] = useState(false);
  const howManyRows = 6;
  useEffect(() => {
    setWin(null);
    setLoss(false);
  }, [codeLength]);
  function handleRestart() {
    setCodeLength(null);
  }
  return (
    <>
      <Header />
      {(win || loss) && <Summary win={win} loss={loss} />}
      <Settings codeLength={codeLength} setCodeLength={setCodeLength} />
      {codeLength && <RestartButton handleRestart={handleRestart} />}
      <Table
        codeLength={codeLength}
        setWin={setWin}
        setLoss={setLoss}
        howManyRows={howManyRows}
      />
    </>
  );
}

function Summary({ win, loss }) {
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setShowSummary(true);
  }, []);
  return (
    <div className={`summary-background ${showSummary ? "" : "hide"}`}>
      <div className={`summary ${showSummary ? "show" : ""}`}>
        <button className="close-summary" onClick={() => setShowSummary(false)}>
          ✖
        </button>
        <h5>Your results</h5>
        {loss ? <p>You've lost 😥</p> : <p>You won on the {win}'s try 🎉</p>}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1 className="header-title">CRACK THE CODE</h1>
      <h4 className="header-subtitle">UNLIMITED</h4>
    </header>
  );
}

function generateCode(length) {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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

function Settings({ codeLength, setCodeLength }) {
  return (
    <div className="settings">
      <h3>Choose length of your code</h3>
      <select
        value={codeLength === null ? "" : codeLength}
        onChange={(e) => setCodeLength(Number(e.target.value))}
      >
        <option value="" disabled>
          Choose length
        </option>
        {Array.from([4, 5, 6, 7, 8, 9]).map((int, index) => (
          <option key={index}>{int}</option>
        ))}
      </select>
    </div>
  );
}

function RestartButton({ handleRestart }) {
  return (
    <button className="restart-button" onClick={handleRestart}>
      Restart Game
    </button>
  );
}

function Table({ codeLength, setWin, setLoss, howManyRows }) {
  const [activeNum, setActiveNum] = useState(0);
  // jeśli bym chciała żeby kod pozostawał niezmienny przy przejściach (jeden kod na dzień)
  /*const codesRef = useRef({});
  useEffect(() => {
    if (!codesRef.current[codeLength]) {
      codesRef.current[codeLength] = generateCode(codeLength);
    }
  }, [codeLength]); */
  const [code, setCode] = useState(() => generateCode(codeLength));
  useEffect(() => {
    setCode(() => generateCode(codeLength));
    setActiveNum(0);
  }, [codeLength]);
  return (
    <div className="table">
      {Array.from({ length: howManyRows }).map((_, index) => (
        <TableRow
          key={index}
          index={index}
          isActive={activeNum === index}
          isLast={index === howManyRows - 1}
          onSetActiveNum={setActiveNum}
          length={codeLength}
          setWin={setWin}
          setLoss={setLoss}
          code={code}
          howManyRows={howManyRows}
        />
      ))}
    </div>
  );
}

function TableRow({
  index,
  isActive,
  isLast,
  onSetActiveNum,
  length,
  setWin,
  setLoss,
  code,
  howManyRows,
}) {
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
      const { greenSpots, yellowSpots } = checkSpots(rowOutput, code);
      setRightSpot(greenSpots);
      setNotRightSpot(yellowSpots);
      onSetActiveNum((num) =>
        greenSpots.includes(false)
          ? num < howManyRows - 1
            ? num + 1
            : num
          : null
      );
      if (greenSpots.includes(false) && isLast) {
        onSetActiveNum(null);
        setLoss(true);
      }
      if (!greenSpots.includes(false)) setWin(index + 1);
    }
  }, [
    isFilled,
    isLast,
    onSetActiveNum,
    rowOutput,
    setWin,
    setLoss,
    index,
    length,
    code,
    howManyRows,
  ]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [isActive]);

  useEffect(() => {
    setRowOutput(() => "X".repeat(length));
    setRightSpot(() => () => Array.from({ length }, () => null));
    setNotRightSpot(() => () => Array.from({ length }, () => null));
  }, [length]);

  function focusNextInput(index) {
    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  }

  function focusPreviousInput(index) {
    if (index >= 0) {
      inputsRef.current[index].focus();
    }
  }

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
          rowOutput={rowOutput}
          focusPreviousInput={focusPreviousInput}
          focusNextInput={focusNextInput}
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
  rowOutput,
  focusNextInput,
  focusPreviousInput,
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (rowOutput[index] === "X") setValue("");
  }, [rowOutput, index]);

  useKey("Backspace", (event) => {
    if (isActive && value !== "") {
      console.log(index);
      focusPreviousInput(index);
    }
  });

  function handleChange(e) {
    const newChar = e.target.value;
    let newValue = "";
    if (newChar[0] === value) {
      newValue = e.target.value.slice(-1);
    } else {
      newValue = e.target.value.charAt(0);
    }
    setValue(newValue);
    onChangeValue(index, newValue);
    if (newValue) {
      focusNextInput(index);
    }
  }
  function handleFocus() {
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
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
        onFocus={handleFocus}
        disabled={!isActive}
        ref={inputRef}
        autoFocus={true}
      />
    </div>
  );
}
