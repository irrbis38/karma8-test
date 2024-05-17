(() => {
    var initRangeInput = () => {
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
        inputs.forEach((i) => setBackgroundSize(i));

        // set on input
        inputs.forEach((i) =>
            i.addEventListener("input", () => setBackgroundSize(i))
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

    document.addEventListener("DOMContentLoaded", () => {
        initRangeInput();
        initTabsToggle();
    });
})();
