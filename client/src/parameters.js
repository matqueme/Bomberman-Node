const modal = document.querySelector(".modalParam");
const closeModal = modal.querySelector(".closeModal");
const svgTrigger = document.querySelector(".parameters");

closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

svgTrigger.addEventListener("click", function () {
  modal.style.display = "block";
});
