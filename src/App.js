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

function BlockInput({ index, onChangeValue, rightSpot, notRightSpot, isActive}) {
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
      <input type="number" value={value} onChange={(e) => handleChange(e)} disabled={!isActive}/>
    </div>
  );
}

function checkSpots(rowOutput, answer) {
  const rowOutputArray = rowOutput.split("");
  const answerArray = answer.split("");

  // Najpierw zaznaczamy zielone miejsca
  const greenSpots = rowOutputArray.map((char, index) => char === answerArray[index]);

  // Tworzymy tablice dla oznaczenia żółtych miejsc
  const yellowSpots = new Array(rowOutputArray.length).fill(false);

  // Kopia answerArray do śledzenia pozostałych cyfr
  let remainingAnswer = answerArray.slice();

  // Usuwamy zielone miejsca z remainingAnswer
  greenSpots.forEach((isGreen, index) => {
    if (isGreen) {
      remainingAnswer[index] = null;
    }
  });

  // Sprawdzamy żółte miejsca
  rowOutputArray.forEach((char, index) => {
    if (!greenSpots[index] && remainingAnswer.includes(char)) {
      yellowSpots[index] = true;
      // Usuwamy pierwsze wystąpienie tej cyfry z remainingAnswer
      remainingAnswer[remainingAnswer.indexOf(char)] = null;
    }
  });

  return { greenSpots, yellowSpots };
}


function TableRow({ isActive, onSetActiveNum }) {
  const [rowOutput, setRowOutput] = useState("XXXX");
  const [rightSpot, setRightSpot] = useState([null, null, null, null]);
  const [notRightSpot, setNotRightSpot] = useState([null, null, null, null]);
  //const [currentIndex, setCurrentIndex] = useState(0);
  const isFilled = !rowOutput.includes("X") && rowOutput.length === 4;
  function handleChangeOutput(index, newValue) {
    if (newValue !== "") {
      setRowOutput(
        (output) => output.slice(0, index) + newValue + output.slice(index + 1)
      );
      //setCurrentIndex((index) => (index < 5 ? index + 1 : index))
    } else {
      setRowOutput(
        (output) => output.slice(0, index) + "X" + output.slice(index + 1)
      );
    }
  }

  useEffect(() => {
    if (isFilled) {
      const {greenSpots, yellowSpots } = checkSpots(rowOutput, answer);
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
        isActive={isActive}
      />
      <BlockInput
        index={1}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
        isActive={isActive}
      />
      <BlockInput
        index={2}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
        isActive={isActive}
      />
      <BlockInput
        index={3}
        onChangeValue={handleChangeOutput}
        rightSpot={rightSpot}
        notRightSpot={notRightSpot}
        isActive={isActive}
      />
      <p>{rowOutput}</p>
      <p>{isFilled ? "true" : "false"}</p>
    </div>
  );
}

function Table() {
  const [activeNum, setActiveNum] = useState(1);

  return (
    <div className="table">
      <TableRow isActive={activeNum===1} onSetActiveNum={setActiveNum} />
      <TableRow isActive={activeNum===2} onSetActiveNum={setActiveNum} />
      <TableRow isActive={activeNum===3} onSetActiveNum={setActiveNum} />
      <TableRow isActive={activeNum===4} onSetActiveNum={setActiveNum} />
      <TableRow isActive={activeNum===5} onSetActiveNum={setActiveNum} />
    </div>
  );
}
