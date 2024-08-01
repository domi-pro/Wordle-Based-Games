import { useState } from "react";
import { useEffect } from "react";

const answer = "2127";

export default function App() {
  return (
    <>
      <Header />
      <Table />
    </>
  );
}

function Header() {
  return (
    <header>
      <h1 className="header-title">CRACK THE CODE</h1>
    </header>
  );
}

function BlockInput({ index, onChangeValue, rightSpot, notRightSpot }) {
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
          ? "#88D66C"
          : notRightSpot[index]
          ? "#F6FB7A"
          : "transparent",
      }}
    >
      <input type="number" value={value} onChange={(e) => handleChange(e)} />
    </div>
  );
}

function TableRow({ isActive, onSetActiveNum }) {
  const [rowOutput, setRowOutput] = useState("XXXX");
  const [rightSpot, setRightSpot] = useState([false, false, false, false]);
  const [notRightSpot, setNotRightSpot] = useState([
    false,
    false,
    false,
    false,
  ]);
  const isFilled = !rowOutput.includes("X") && rowOutput.length === 4;
  function handleChangeOutput(index, newValue) {
    if (newValue !== "") {
      setRowOutput(
        (output) => output.slice(0, index) + newValue + output.slice(index + 1)
      );
    } else {
      setRowOutput(
        (output) => output.slice(0, index) + "X" + output.slice(index + 1)
      );
    }
  }
  useEffect(() => {
    if (isFilled) {
      const greenSpots = rowOutput
        .split("")
        .map((char, index) => char === answer[index]);
      console.log(rowOutput);
      console.log(greenSpots);
      const yellowSpots = rowOutput
        .split("")
        .map((char) => answer.includes(char));
      console.log(yellowSpots);
      setRightSpot(greenSpots);
      setNotRightSpot(yellowSpots);
      onSetActiveNum((num) => (num < 5 ? num + 1 : num));
    }
  }, [isFilled, onSetActiveNum, rowOutput]);
  return (
    <div className={isActive ? "table-row" : "table-row not-active"}>
      <BlockInput
        index={0}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
      />
      <BlockInput
        index={1}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
      />
      <BlockInput
        index={2}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
      />
      <BlockInput
        index={3}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
      />
      <p>{rowOutput}</p>
      <p>{isFilled ? "true" : "false"}</p>
    </div>
  );
}

function Table() {
  const [isActiveNum, setIsActiveNum] = useState(1);

  return (
    <div className="table">
      <TableRow isActive={isActiveNum === 1} onSetActiveNum={setIsActiveNum} />
      <TableRow isActive={isActiveNum === 2} onSetActiveNum={setIsActiveNum} />
      <TableRow isActive={isActiveNum === 3} onSetActiveNum={setIsActiveNum} />
      <TableRow isActive={isActiveNum === 4} onSetActiveNum={setIsActiveNum} />
      <TableRow isActive={isActiveNum === 5} onSetActiveNum={setIsActiveNum} />
    </div>
  );
}
