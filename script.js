document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     CURRENT YEAR
  ========================================= */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =========================================
     HELPERS
  ========================================= */

  function formatNumber(number) {
    return Math.ceil(number).toLocaleString("en-US");
  }


  function formatCurrency(number) {
    return Number(number).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
  }


  function parseRevenue(value) {

    if (!value) {
      return null;
    }

    const text = value
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\$/g, "")
      .trim();

    const match = text.match(
      /(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/
    );

    if (!match) {
      return null;
    }

    let amount = parseFloat(match[1]);

    const multiplier = match[2];

    if (
      multiplier === "k" ||
      multiplier === "thousand"
    ) {
      amount *= 1000;
    }

    if (
      multiplier === "m" ||
      multiplier === "million"
    ) {
      amount *= 1000000;
    }

    return amount > 0 ? amount : null;
  }


  function parseBudget(value) {

    if (!value) {
      return 0;
    }

    return parseRevenue(value) || 0;
  }


  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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


  function showCalculatorError(message) {

    if (!backcastError) {
      return;
    }

    backcastError.textContent = message;
    backcastError.style.display = "block";
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


    if (backcastError) {
      backcastError.style.display = "none";
      backcastError.textContent = "";
    }


    if (
      !Number.isFinite(targetRevenue) ||
      targetRevenue <= 0
    ) {

      showCalculatorError(
        "Enter a monthly revenue target greater than zero."
      );

      return;
    }


    if (
      !Number.isFinite(monthlyPrice) ||
      monthlyPrice <= 0
    ) {

      showCalculatorError(
        "Enter a customer price greater than zero."
      );

      return;
    }


    if (
      !Number.isFinite(conversionRate) ||
      conversionRate <= 0 ||
      conversionRate > 100
    ) {

      showCalculatorError(
        "Enter a conversion rate between 0.01% and 100%."
      );

      return;
    }


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


  if (calculateButton) {
    calculateButton.addEventListener(
      "click",
      calculateBackcast
    );
  }


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


  calculateBackcast();


  /* =========================================
     STRATEGY ENGINE
  ========================================= */

  function detectBusinessType(idea) {

    const text = idea.toLowerCase();

    if (
      text.includes("saas") ||
      text.includes("software") ||
      text.includes("platform") ||
      text.includes("tool") ||
      text.includes("app") ||
      text.includes("ai")
    ) {
      return "digital product / SaaS";
    }

    if (
      text.includes("agency") ||
      text.includes("consult") ||
      text.includes("consulting") ||
      text.includes("service")
    ) {
      return "service business";
    }

    if (
      text.includes("course") ||
      text.includes("ebook") ||
      text.includes("template") ||
      text.includes("digital product")
    ) {
      return "digital product";
    }

    if (
      text.includes("store") ||
      text.includes("shop") ||
      text.includes("product") ||
      text.includes("ecommerce") ||
      text.includes("e-commerce")
    ) {
      return "e-commerce / product business";
    }

    return "new business concept";
  }


  function getPricingStrategy(type, budget) {

    if (type === "service business") {

      return {
        recommendation:
          "Start with a clearly defined service package rather than an open-ended hourly offer.",
        experiment:
          "Test three package levels with different scope and outcomes."
      };
    }

    if (type === "digital product") {

      return {
        recommendation:
          "Use a simple entry price and make the value of the outcome immediately understandable.",
        experiment:
          "Test two price points and measure purchase conversion rather than relying on clicks alone."
      };
    }

    if (type === "e-commerce / product business") {

      return {
        recommendation:
          "Build pricing around customer value, product cost, fulfillment, acquisition cost, and target margin.",
        experiment:
          "Test bundles or higher-value packages before competing primarily on price."
      };
    }

    return {
      recommendation:
        "Begin with a simple price that makes the value proposition easy to understand. Avoid optimizing pricing before validating willingness to pay.",
      experiment:
        "Test a small number of price points with real prospects and compare conversion, not just interest."
    };
  }


  function getAcquisitionStrategy(type, customer, market) {

    const customerText = customer.toLowerCase();

    let channels = [
      "Search-driven content",
      "Problem-focused landing pages",
      "Direct customer interviews",
      "Partnerships and referrals"
    ];

    if (
      customerText.includes("business") ||
      customerText.includes("founder") ||
      customerText.includes("startup")
    ) {

      channels = [
        "LinkedIn",
        "Founder communities",
        "Search-driven content",
        "Partnerships",
        "Direct outreach"
      ];
    }

    if (
      customerText.includes("creator") ||
      customerText.includes("influencer")
    ) {

      channels = [
        "YouTube",
        "Short-form content",
        "Creator communities",
        "Search content",
        "Partnerships"
      ];
    }

    if (
      customerText.includes("consumer") ||
      customerText.includes("parent") ||
      customerText.includes("student")
    ) {

      channels = [
        "Search content",
        "Social content",
        "Communities",
        "Referral loops",
        "Email capture"
      ];
    }

    return channels;
  }


  function createStrategyReport(data) {

    const type =
      detectBusinessType(data.businessIdea);

    const revenue =
      parseRevenue(data.revenue);

    const budget =
      parseBudget(data.budget);

    const pricing =
      getPricingStrategy(type, budget);

    const acquisition =
      getAcquisitionStrategy(
        type,
        data.customer,
        data.market
      );


    let assumedPrice = 25;

    if (type === "service business") {
      assumedPrice = 250;
    }

    if (type === "digital product") {
      assumedPrice = 15;
    }

    if (type === "e-commerce / product business") {
      assumedPrice = 50;
    }


    const requiredCustomers =
      revenue
        ? Math.ceil(revenue / assumedPrice)
        : null;


    const conversionRate = 2;

    const requiredVisitors =
      requiredCustomers
        ? Math.ceil(
            requiredCustomers /
            (conversionRate / 100)
          )
        : null;


    return {

      type,

      revenue,

      budget,

      assumedPrice,

      requiredCustomers,

      requiredVisitors,

      conversionRate,

      pricing,

      acquisition

    };
  }


  /* =========================================
     RENDER STRATEGY REPORT
  ========================================= */

  function renderStrategyReport(data, report) {

    let results =
      document.getElementById(
        "strategyResults"
      );


    if (!results) {

      results =
        document.createElement("section");

      results.id =
        "strategyResults";

      results.className =
        "strategy-results-section";

      const analyzer =
        document.getElementById("analyzer");

      if (analyzer) {
        analyzer.after(results);
      }
    }


    const customer =
      escapeHTML(data.customer);

    const market =
      escapeHTML(data.market);

    const idea =
      escapeHTML(data.businessIdea);

    const timeframe =
      escapeHTML(data.timeframe);

    const budgetText =
      data.budget
        ? escapeHTML(data.budget)
        : "Not specified";


    const revenueText =
      report.revenue
        ? formatCurrency(report.revenue)
        : "Target needs clarification";


    const customerText =
      report.requiredCustomers
        ? formatNumber(
            report.requiredCustomers
          )
        : "—";


    const visitorText =
      report.requiredVisitors
        ? formatNumber(
            report.requiredVisitors
          )
        : "—";


    results.innerHTML = `

      <div class="container">

        <div class="strategy-report">

          <div class="strategy-report-header">

            <div>

              <div class="eyebrow">
                REVERSEBUILD STRATEGY REPORT
              </div>

              <h2>
                Your business strategy starting point
              </h2>

              <p>
                This report is a planning framework generated from
                the information you provided. It is not a prediction
                or external competitor research report.
              </p>

            </div>

          </div>


          <div class="strategy-summary">

            <div>
              <small>BUSINESS IDEA</small>
              <strong>${idea}</strong>
            </div>

            <div>
              <small>BUSINESS TYPE</small>
              <strong>${report.type}</strong>
            </div>

            <div>
              <small>TARGET CUSTOMER</small>
              <strong>${customer}</strong>
            </div>

            <div>
              <small>MARKET</small>
              <strong>${market}</strong>
            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">
              <span>01</span>
              <div>
                <h3>Strategy Snapshot</h3>
                <p>
                  The first priority is to validate the customer
                  problem and connect the proposed offer to a measurable
                  business outcome.
                </p>
              </div>
            </div>

            <div class="report-grid">

              <article class="report-card">

                <span class="decision-label keep-label">
                  KEEP
                </span>

                <h4>
                  Start with a narrow customer
                </h4>

                <p>
                  Keep the initial customer definition focused.
                  A narrower segment makes messaging, acquisition,
                  and validation easier to measure.
                </p>

              </article>


              <article class="report-card">

                <span class="decision-label improve-label">
                  IMPROVE
                </span>

                <h4>
                  Strengthen the outcome
                </h4>

                <p>
                  Describe the result the customer receives rather
                  than relying only on product features.
                </p>

              </article>


              <article class="report-card">

                <span class="decision-label change-label">
                  CHANGE
                </span>

                <h4>
                  Avoid premature scaling
                </h4>

                <p>
                  Do not assume that more traffic will solve an
                  unvalidated value proposition.
                </p>

              </article>

            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">
              <span>02</span>
              <div>
                <h3>Customer Strategy</h3>
                <p>
                  Initial customer focus:
                  <strong>${customer}</strong>
                  in <strong>${market}</strong>.
                </p>
              </div>
            </div>

            <div class="recommendation-box">

              <h4>
                Recommendation
              </h4>

              <p>
                Define the customer's specific problem, current
                alternative, trigger for buying, and measurable
                desired outcome. Interview prospective customers
                before investing heavily in product development.
              </p>

            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">
              <span>03</span>
              <div>
                <h3>Value Proposition</h3>
                <p>
                  Make the value proposition outcome-led.
                </p>
              </div>
            </div>

            <div class="recommendation-box">

              <h4>
                Suggested positioning structure
              </h4>

              <p>
                “Help <strong>${customer}</strong> achieve
                <strong>one measurable outcome</strong>
                without the main difficulty they currently face.”
              </p>

            </div>

          </div>


          <div class="report-section">

            <div class="strategy-two-column">

              <div>

                <div class="report-section-title">

                  <span>04</span>

                  <div>
                    <h3>Business Model</h3>
                    <p>
                      Detected model:
                      <strong>${report.type}</strong>.
                    </p>
                  </div>

                </div>

                <p class="report-body">
                  Start with the simplest monetization model that
                  allows customer demand to be measured. Add complexity
                  only when customer behavior justifies it.
                </p>

              </div>


              <div>

                <div class="report-section-title">

                  <span>05</span>

                  <div>
                    <h3>Pricing Strategy</h3>
                    <p>
                      ${report.pricing.recommendation}
                    </p>
                  </div>

                </div>

                <div class="experiment-box">
                  <strong>Pricing experiment</strong>
                  <p>
                    ${report.pricing.experiment}
                  </p>
                </div>

              </div>

            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">

              <span>06</span>

              <div>
                <h3>Customer Acquisition</h3>

                <p>
                  Potential channels to test first:
                </p>
              </div>

            </div>


            <div class="channel-list">

              ${acquisition.map((channel, index) => `
                <div class="channel-item">
                  <span>0${index + 1}</span>
                  <strong>${escapeHTML(channel)}</strong>
                  <p>
                    Test this channel against a measurable customer
                    acquisition objective rather than treating traffic
                    as the goal itself.
                  </p>
                </div>
              `).join("")}

            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">

              <span>07</span>

              <div>
                <h3>Traffic & Demand</h3>

                <p>
                  Build demand around the customer's problem,
                  not only around the product name.
                </p>

              </div>

            </div>


            <div class="report-grid">

              <article class="report-card">

                <h4>
                  Search demand
                </h4>

                <p>
                  Create useful pages around customer problems,
                  comparisons, alternatives, calculators, and
                  practical questions.
                </p>

              </article>


              <article class="report-card">

                <h4>
                  Educational content
                </h4>

                <p>
                  Publish content that helps the target customer
                  understand and solve the problem before asking
                  them to purchase.
                </p>

              </article>


              <article class="report-card">

                <h4>
                  Distribution
                </h4>

                <p>
                  Test communities, partnerships, referrals,
                  and direct distribution alongside organic search.
                </p>

              </article>

            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">

              <span>08</span>

              <div>

                <h3>Conversion Funnel</h3>

                <p>
                  A simple funnel to test:
                </p>

              </div>

            </div>


            <div class="funnel">

              <div>
                <span>01</span>
                <strong>Visitor</strong>
                <small>Problem-focused content</small>
              </div>

              <div>
                <span>02</span>
                <strong>Lead / Trial</strong>
                <small>Useful first interaction</small>
              </div>

              <div>
                <span>03</span>
                <strong>Customer</strong>
                <small>Clear value exchange</small>
              </div>

              <div>
                <span>04</span>
                <strong>Retention</strong>
                <small>Repeat value and engagement</small>
              </div>

            </div>

          </div>


          <div class="report-section">

            <div class="report-section-title">

              <span>09</span>

              <div>

                <h3>Growth Strategy</h3>

                <p>
                  Growth should follow evidence from the first
                  validated acquisition and conversion loops.
                </p>

              </div>

            </div>


            <div class="recommendation-box">

              <p>
                First identify one repeatable customer acquisition
                mechanism. Then improve conversion and retention before
                expanding into multiple channels.
              </p>

            </div>

          </div>


          <div class="report-section backcast-report">

            <div class="report-section-title">

              <span>10</span>

              <div>

                <h3>Revenue Backcast</h3>

                <p>
                  A simple scenario based on your stated revenue target.
                </p>

              </div>

            </div>


            <div class="backcast-report-grid">

              <div>
                <small>TARGET</small>
                <strong>${revenueText}</strong>
                <span>monthly revenue</span>
              </div>

              <div>
                <small>ASSUMED PRICE</small>
                <strong>${formatCurrency(report.assumedPrice)}</strong>
                <span>per customer / month</span>
              </div>

              <div>
                <small>REQUIRED CUSTOMERS</small>
                <strong>${customerText}</strong>
                <span>customers / month</span>
              </div>

              <div>
                <small>ESTIMATED VISITORS</small>
                <strong>${visitorText}</strong>
                <span>at ${report.conversionRate}% conversion</span>
              </div>

            </div>

            <p class="report-disclaimer">
              The price and conversion rate are planning assumptions,
              not market facts. Replace them with validated data as
              your business develops.
            </p>

          </div>


          <div class="report-section">

            <div class="report-section-title">

              <span>11</span>

              <div>

                <h3>Validation Experiments</h3>

                <p>
                  Test the assumptions before committing significant
                  time or capital.
                </p>

              </div>

            </div>


            <ol class="experiment-list">

              <li>
                Interview 10–20 people matching your target customer.
              </li>

              <li>
                Identify the customer's current workaround or alternative.
              </li>

              <li>
                Create a focused landing page describing one outcome.
              </li>

              <li>
                Test at least one acquisition channel with measurable
                conversion tracking.
              </li>

              <li>
                Compare willingness to pay with the price assumption.
              </li>

            </ol>

          </div>


          <div class="report-section">

            <div class="report-section-title">

              <span>12</span>

              <div>

                <h3>30 / 60 / 90 Day Plan</h3>

                <p>
                  A practical sequence for reducing uncertainty.
                </p>

              </div>

            </div>


            <div class="timeline-grid">

              <article>

                <span>DAY 1–30</span>

                <h4>Validate</h4>

                <p>
                  Customer interviews, problem validation,
                  positioning, competitor observation, and initial
                  landing-page testing.
                </p>

              </article>


              <article>

                <span>DAY 31–60</span>

                <h4>Test</h4>

                <p>
                  Launch the smallest useful version, test pricing,
                  measure acquisition, and improve conversion.
                </p>

              </article>


              <article>

                <span>DAY 61–90</span>

                <h4>Optimize</h4>

                <p>
                  Double down on the strongest acquisition mechanism,
                  improve retention, and refine the economics.
                </p>

              </article>

            </div>

          </div>


          <div class="strategy-footer">

            <strong>
              Planning horizon:
            </strong>

            ${timeframe}

            <span>•</span>

            <strong>
              Starting budget:
            </strong>

            ${budgetText}

          </div>


          <div class="strategy-disclaimer">

            <strong>Important:</strong>

            This prototype generates structured strategic suggestions
            from the information entered by the user. It does not claim
            to have independently researched competitors, traffic,
            revenue, conversion rates, or market data. Those evidence-backed
            research capabilities should be connected through a secure
            backend in the next development stage.

          </div>

        </div>

      </div>
    `;


    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


  /* =========================================
     BUSINESS IDEA FORM
  ========================================= */

  const form =
    document.getElementById("ideaForm");

  const message =
    document.getElementById("formMessage");


  if (form) {

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


        const timeframe =
          document
            .getElementById("timeframe")
            ?.value || "12 months";


        const budget =
          document
            .getElementById("budget")
            ?.value
            .trim() || "";


        const resources =
          document
            .getElementById("experience")
            ?.value || "solo";


        if (
          !businessIdea ||
          !customer ||
          !market ||
          !revenue
        ) {

          if (message) {

            message.style.display =
              "block";

            message.style.background =
              "rgba(255, 107, 122, 0.08)";

            message.style.borderColor =
              "rgba(255, 107, 122, 0.18)";

            message.style.color =
              "#ffb4bd";

            message.textContent =
              "Please complete the required fields before starting the analysis.";

          }

          return;
        }


        const formData = {

          businessIdea,

          customer,

          market,

          revenue,

          timeframe,

          budget,

          resources

        };


        const report =
          createStrategyReport(formData);


        if (message) {

          message.style.display =
            "block";

          message.style.background =
            "rgba(66, 211, 146, 0.08)";

          message.style.borderColor =
            "rgba(66, 211, 146, 0.18)";

          message.style.color =
            "#b8f3d4";

          message.textContent =
            "Your ReverseBuild strategy report has been generated below.";

        }


        renderStrategyReport(
          formData,
          report
        );

      }
    );

  }

});
