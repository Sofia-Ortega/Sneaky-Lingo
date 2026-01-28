// Define the type for user inputs stored in chrome.storage.local
// interface StorageData {
//   userInputs: string[];
// }

// // Function to update history display
// function updateHistory(): void {
//   chrome.storage.local.get("userInputs", function (result: StorageData) {
//     let historyDiv = document.getElementById("history") as HTMLElement;
//     historyDiv.innerHTML = "<h3>History:</h3>"; // Reset history header

//     if (result.userInputs && result.userInputs.length > 0) {
//       result.userInputs.forEach((input: string) => {
//         let historyItem = document.createElement("div");
//         historyItem.classList.add("history-item");
//         historyItem.textContent = input;
//         historyDiv.appendChild(historyItem);
//       });
//     } else {
//       historyDiv.innerHTML += "<p>No history yet!</p>";
//     }
//   });
// }

// // Function to save user input
// document.getElementById("saveButton")?.addEventListener("click", function () {
//   const userInput = (document.getElementById("userInput") as HTMLInputElement)
//     .value;

//   if (userInput.trim() === "") {
//     return; // Don't save empty input
//   }

//   chrome.storage.local.get("userInputs", function (result: StorageData) {
//     let userInputs = result.userInputs || [];

//     // Add new input to the array
//     userInputs.push(userInput);

//     // Save the updated array back to chrome storage
//     chrome.storage.local.set({ userInputs: userInputs }, function () {
//       console.log("User input saved!");
//       updateHistory(); // Refresh the history after saving the new input
//     });
//   });
// });

// // On startup, update the history display
// updateHistory();
const addButton = document.getElementById("add-word-btn") as HTMLButtonElement;
const originalInput = document.getElementById(
  "original-word",
) as HTMLInputElement;
const replaceInput = document.getElementById(
  "replace-word",
) as HTMLInputElement;
const table = document.getElementById("words-table") as HTMLTableElement;

addButton.addEventListener("click", () => {
  const originalWord: string = originalInput.value.trim();
  const replaceWord: string = replaceInput.value.trim();

  if (!originalWord || !replaceWord) return;

  // 1️⃣ Log values
  console.log(originalWord, replaceWord);

  // 2️⃣ Create row
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="checkbox" /></td>
    <td>${originalWord}</td>
    <td>${replaceWord}</td>
    <td><button class="remove-btn">-</button></td>
  `;

  // 3️⃣ Add row to table
  table.appendChild(row);

  // 4️⃣ Clear inputs
  originalInput.value = "";
  replaceInput.value = "";
});

document.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("remove-btn")) {
    target.closest("tr")?.remove();
  }
});
