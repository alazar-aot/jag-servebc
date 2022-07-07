
export function timeFormatter(cell) {
      
  if (cell == null || cell == "" || cell == undefined) {return " ";}
  const date = new Date(cell);
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = ("0" + date.getDate()).slice(-2);
  const localdate = year + "/" + month.toUpperCase() + "/" + day;

  return <label title={cell}>{localdate}</label>;
}