const addressInput = document.getElementById("addressInput");
const autocompleteResults = document.getElementById("autocompleteResults");

addressInput.addEventListener(
  "input",
  debounce(async (event) => {
    const query = event.target.value.trim();
    if (query.length < 3) return; // Minimum 3 characters for search

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=10`
      );
      const data = await response.json();

      autocompleteResults.innerHTML = "";
      data.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.textContent = `${item.display_name}`;
        resultDiv.addEventListener("click", () => {
          selectAddress(item.display_name);
        });
        autocompleteResults.appendChild(resultDiv);
      });
      console.log(data);
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  }, 300)
); // Debounce delay in milliseconds

function selectAddress(selectedItem) {
  addressInput.value = selectedItem;
  autocompleteResults.innerHTML = ""; // Clear results
}

// Debounce function to reduce API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
