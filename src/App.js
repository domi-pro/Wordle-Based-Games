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

function BlockInput() {
  const [value, setValue] = useState("");
  return (
    <div className="block-input">
      <input
        type="number"
        maxLength="1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function TableRow({ isActive }) {
  const [numbers, setNumbers] = useState(0);
  // spróbować jednak jako string a nie int

  return (
    <div className={isActive ? "table-row" : "table-row not-active"}>
      <BlockInput />
      <BlockInput />
      <BlockInput />
      <BlockInput />
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
