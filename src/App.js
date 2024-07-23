import { useState } from "react";

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

function BlockInput({ onSetHowMany }) {
  return (
    <div className="block-input">
      <input type="number" onChange={onSetHowMany} />
    </div>
  );
}

function TableRow({ isActive }) {
  const [howMany, setHowMany] = useState(0);
  const [allFilled, setAllFilled] = useState(false);
  function onSetHowMany() {
    if (howMany === 4) {
      console.log(howMany);
      setAllFilled(true);
    } else {
      setHowMany((howMany) => howMany + 1);
      console.log(howMany);
    }
  }
  return (
    <div className={isActive ? "table-row" : "table-row not-active"}>
      <BlockInput onSetHowMany={onSetHowMany} />
      <BlockInput onSetHowMany={onSetHowMany} />
      <BlockInput onSetHowMany={onSetHowMany} />
      <BlockInput onSetHowMany={onSetHowMany} />
    </div>
  );
}

function Table() {
  const [isActiveNum, setIsActiveNum] = useState(1);

  return (
    <div className="table">
      <TableRow isActive={isActiveNum === 1 ? true : false} />
      <TableRow isActive={isActiveNum === 2 ? true : false} />
      <TableRow isActive={isActiveNum === 3 ? true : false} />
      <TableRow isActive={isActiveNum === 4 ? true : false} />
      <TableRow isActive={isActiveNum === 5 ? true : false} />
    </div>
  );
}
