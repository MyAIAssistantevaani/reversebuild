document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CURRENT YEAR
  ========================== */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =========================
     IDEA FORM
  ========================== */

  const form = document.getElementById("ideaForm");
  const message = document.getElementById("formMessage");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const businessIdea =
      document.getElementById("businessIdea").value.trim();

    const customer =
      document.getElementById("customer").value.trim();

    const market =
      document.getElementById("market").value.trim();

    const revenue =
      document.getElementById("revenue").value.trim();

    if (!businessIdea || !customer || !market || !revenue) {

      message.style.display = "block";

      message.textContent =
        "Please complete the required fields before starting the analysis.";

      message.style.background =
        "rgba(255, 107, 122, 0.08)";

      message.style.borderColor =
        "rgba(255, 107, 122, 0.18)";

      message.style.color =
        "#ffb4bd";

      return;
    }


    /*
      This is intentionally only a prototype.

      Later this section will send the user's
      structured input to our research backend.

      For now we demonstrate that the interface
      is functioning correctly.
    */

    const formData = {

      businessIdea,

      customer,

      market,

      revenue,

      timeframe:
        document.getElementById("timeframe").value,

      budget:
        document.getElementById("budget").value,

      resources:
        document.getElementById("experience").value

    };


    console.log(
      "ReverseBuild prototype input:",
      formData
    );


    message.style.display = "block";

    message.style.background =
      "rgba(66, 211, 146, 0.08)";

    message.style.borderColor =
      "rgba(66, 211, 146, 0.18)";

    message.style.color =
      "#b8f3d4";

    message.textContent =
      "Your idea has been captured. The research engine will be connected in the next development stage.";

  });

});
