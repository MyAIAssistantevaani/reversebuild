document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     CURRENT YEAR
     ========================================= */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =========================================
     REVENUE BACKCASTING CALCULATOR
     ========================================= */

  const calculateButton =
    document.getElementById("calculateBackcast");

  const targetRevenueInput =
    document.getElementById("targetRevenue");

  const monthlyPriceInput =
    document.getElementById("monthlyPrice");

  const conversionRateInput =
    document.getElementById("conversionRate");

  const requiredCustomers =
    document.getElementById("requiredCustomers");

  const requiredVisitors =
    document.getElementById("requiredVisitors");

  const displayConversion =
    document.getElementById("displayConversion");

  const backcastError =
    document.getElementById("backcastError");


  function formatNumber(number) {

    return Math.ceil(number).toLocaleString("en-US");

  }


  function calculateBackcast() {

    if (
      !targetRevenueInput ||
      !monthlyPriceInput ||
      !conversionRateInput
    ) {
      return;
    }


    const targetRevenue =
      Number(targetRevenueInput.value);

    const monthlyPrice =
      Number(monthlyPriceInput.value);

    const conversionRate =
      Number(conversionRateInput.value);


    /* Reset error */

    if (backcastError) {

      backcastError.style.display = "none";

      backcastError.textContent = "";

    }


    /* Validate inputs */

    if (
      !Number.isFinite(targetRevenue) ||
      targetRevenue <= 0
    ) {

      showCalculatorError(
        "Please enter a valid monthly revenue target greater than zero."
      );

      return;

    }


    if (
      !Number.isFinite(monthlyPrice) ||
      monthlyPrice <= 0
    ) {

      showCalculatorError(
        "Please enter a valid customer price greater than zero."
      );

      return;

    }


    if (
      !Number.isFinite(conversionRate) ||
      conversionRate <= 0 ||
      conversionRate > 100
    ) {

      showCalculatorError(
        "Please enter a conversion rate between 0.01% and 100%."
      );

      return;

    }


    /*
      Revenue model:

      Required Customers =
      Target Revenue / Monthly Price

      Required Visitors =
      Required Customers / Conversion Rate
    */


    const customers =
      targetRevenue / monthlyPrice;


    const visitors =
      customers / (conversionRate / 100);


    if (requiredCustomers) {

      requiredCustomers.textContent =
        formatNumber(customers);

    }


    if (requiredVisitors) {

      requiredVisitors.textContent =
        formatNumber(visitors);

    }


    if (displayConversion) {

      displayConversion.textContent =
        `${conversionRate}%`;

    }

  }


  function showCalculatorError(message) {

    if (!backcastError) {
      return;
    }

    backcastError.textContent = message;

    backcastError.style.display = "block";

  }


  if (calculateButton) {

    calculateButton.addEventListener(
      "click",
      calculateBackcast
    );

  }


  /*
    Recalculate automatically when
    the user changes an input.
  */

  [
    targetRevenueInput,
    monthlyPriceInput,
    conversionRateInput
  ].forEach((input) => {

    if (input) {

      input.addEventListener(
        "input",
        calculateBackcast
      );

    }

  });


  /*
    Calculate the default example
    immediately on page load.
  */

  calculateBackcast();


  /* =========================================
     BUSINESS IDEA FORM
     ========================================= */

  const form =
    document.getElementById("ideaForm");

  const message =
    document.getElementById("formMessage");


  if (form && message) {

    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const businessIdea =
          document
            .getElementById("businessIdea")
            ?.value
            .trim();


        const customer =
          document
            .getElementById("customer")
            ?.value
            .trim();


        const market =
          document
            .getElementById("market")
            ?.value
            .trim();


        const revenue =
          document
            .getElementById("revenue")
            ?.value
            .trim();


        if (
          !businessIdea ||
          !customer ||
          !market ||
          !revenue
        ) {

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


        const formData = {

          businessIdea,

          customer,

          market,

          revenue,

          timeframe:
            document
              .getElementById("timeframe")
              ?.value || "",

          budget:
            document
              .getElementById("budget")
              ?.value || "",

          resources:
            document
              .getElementById("experience")
              ?.value || ""

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

      }
    );

  }

});
