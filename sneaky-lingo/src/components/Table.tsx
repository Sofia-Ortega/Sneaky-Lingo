export default function Table() {
  return (
    <table id="words-table" className="my-8">
      <tr>
        <th></th>
        <th>Original Word</th>
        <th>Replace</th>
        <th></th>
      </tr>
      <tr id="input-row">
        <td></td>
        <td>
          <input type="text" id="original-word" />
        </td>
        <td>
          <input type="text" id="replace-word" />
        </td>
        <td>
          <div className="bg-sky-300 rounded-full text-desertnight w-8 h-8 flex justify-center items-center">
            <button className=" text-3xl font-bold">+</button>
          </div>
        </td>
      </tr>
    </table>
  );
}
