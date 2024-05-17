(() => {
    var changeRangeProgress = () => {
        var inputs = document.querySelectorAll(".range__input");

        var getBackgroundSize = (input) => {
            const min = Number(input.min) || 0;
            const max = Number(input.max) || 100;
            const value = Number(input.value);

            const size = ((value - min) / (max - min)) * 100;

            return size;
        };

        var setBackgroundSize = (input) => {
            input.style.setProperty(
                "--background-size",
                `${getBackgroundSize(input)}%`
            );
        };

        // init set
        inputs.forEach((i) =>
            requestAnimationFrame(() => setBackgroundSize(i))
        );

        // set on input
        inputs.forEach((i) =>
            i.addEventListener("input", () =>
                requestAnimationFrame(() => setBackgroundSize(i))
            )
        );
    };

    var initTabsToggle = () => {
        var tabs = document.querySelectorAll(".pricing__tab");
        var btns = document.querySelectorAll(".pricing__label input");

        btns.forEach((btn, index) => {
            btn.addEventListener("input", () => {
                tabs.forEach((tab) => {
                    tab.classList.add("hidden");
                    tab.classList.remove("shown");
                });
                tabs[index].classList.remove("hidden");
                tabs[index].classList.add("shown");
            });
        });
    };

    var setCurrentValue = (input, current_el) => {
        var value = Number(input.value);
        // if max value then set 1PB, else set value in TB
        current_el.textContent = value === 1000 ? "1 PB" : value + " TB";
    };

    var changeTotalHandler = (params) => {
        var {
            inputTotal,
            totals,
            coefficients,
            max,
            inputDownloads,
            progresses,
        } = params;
        var currentTotalValue = inputTotal.value;
        var currentDownloadsValue = inputDownloads.value;

        totals.forEach((t, idx) => {
            t.textContent = (
                currentTotalValue *
                currentDownloadsValue *
                coefficients[idx]
            ).toFixed(3);
        });

        progresses.forEach((p, idx) => {
            var current = (
                currentTotalValue *
                currentDownloadsValue *
                coefficients[idx]
            ).toFixed(3);
            p.style.transform = `translateX(${((current * 100) / max).toFixed(
                3
            )}%)`;
        });
    };

    var changeCurrentValue = () => {
        var ranges = document.querySelectorAll(".range");

        ranges.forEach((range) => {
            var inputTotal = null;
            var inputDownloads = null;

            var currInput = range.querySelector(".range__input");

            var isTotalInput =
                currInput.classList.contains("range-input-total");

            if (isTotalInput) {
                inputTotal = currInput;
                inputDownloads = range
                    .closest(".pricing__tab")
                    .querySelector(".range-input-downloads");
            } else {
                inputTotal = range
                    .closest(".pricing__tab")
                    .querySelector(".range-input-total");
                inputDownloads = currInput;
            }

            const terabytesInPetabyte = 1000;
            const terabytesDownloadsCost = 0.0001;

            var current = range.querySelector(".range__current");

            var tab = range.closest(".pricing__tab");

            var totals = Array.from(tab.querySelectorAll(".vendors__total"));
            var progresses = Array.from(
                tab.querySelectorAll(".vendors__progress")
            );

            var prices = totals.map((t) => t.dataset.pricePerGb);
            var coefficients = prices.map(
                (p) => p * terabytesInPetabyte * terabytesDownloadsCost
            );
            var maxValues = coefficients.map(
                (с) => с * inputTotal.max * inputDownloads.max
            );
            var max = Math.max(...maxValues);

            requestAnimationFrame(() => setCurrentValue(currInput, current));

            var params = {
                inputTotal,
                totals,
                coefficients,
                max,
                inputDownloads,
                progresses,
            };

            // if ranges contains Total Data Stored input then execute init set
            isTotalInput &&
                requestAnimationFrame(() => changeTotalHandler(params));

            // set on input
            currInput.addEventListener("input", () => {
                requestAnimationFrame(() => {
                    setCurrentValue(currInput, current);
                    changeTotalHandler(params);
                });
            });
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        changeRangeProgress();
        initTabsToggle();
        changeCurrentValue();
    });
})();
