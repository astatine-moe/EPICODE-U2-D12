const key = `563492ad6f9170000100000190d599d8318a454a9909e038883faa57`;

const baseUri = `https://api.pexels.com/v1/`,
    bearer = "Bearer " + key;

const search = (query) => {
    const ext = `search?query=${encodeURIComponent(query)}`;

    return new Promise((resolve, reject) => {
        fetch(baseUri + ext, {
            method: "GET",
            headers: {
                Authorization: bearer,
            },
        })
            .then((res) => res.json())
            .then((json) => resolve(json))
            .catch(reject);
    });
};

const generateCard = (photo) => {
    const {
        width,
        height,
        url,
        photographer,
        photographer_url,
        id,
        alt,
        avg_color,
        src: { medium, original },
    } = photo;

    const $html = `<div class="col-md-4">
    <div class="card bg-dark mb-4 shadow-sm">
        <span class="badge badge-dark">${photographer}</span>
        <img class="card-img-top" src="${medium}" />
        <div class="card-body">
            <p class="card-text">
                ${alt}
            </p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="view(event, '${alt}', '${original}')">View</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="hide(event)">Hide</button>
                </div>
                <small class="text-muted">${id}</small>
            </div>
        </div>
    </div>
</div>`;

    return $html;
};

$("#search").on("input", function () {
    const val = $(this).val().trim();
    if (val.length < 1) {
        $("#load-images").prop("disabled", true).addClass("disabled");
    } else {
        $("#load-images").prop("disabled", false).removeClass("disabled");
    }
});

let alertTimeout;

const showAlert = (text, type = "success", timeout = 5000) => {
    clearTimeout(alertTimeout);
    $("#alert").html(text);
    $("#alert").removeClass("alert-success alert-danger");
    $("#alert").addClass("alert-" + type);

    $("#alert").removeClass("d-none");

    alertTimeout = setTimeout(() => {
        $("#alert").addClass("d-none");
    }, 5000);
};

$("#load-images").on("click", function () {
    const query = $("#search").val().trim();

    if (!query) return;
    $("#images").html(loader());

    search(query)
        .then((data) => {
            const { photos } = data;
            $("#images").html("");

            for (const photo of photos) {
                const html = generateCard(photo);
                $("#images").append(html);
            }

            showAlert("Loaded " + photos.length + " images!");
        })
        .catch((err) => {
            console.error(err);
            showAlert(
                "Error loading images :( <small>Check console!</small>",
                "danger"
            );
        });
});
$("#load-secondary-images").on("click", function () {
    $("#images").html(loader());
    search("night sky")
        .then((data) => {
            const { photos } = data;
            $("#images").html("");

            for (const photo of photos) {
                const html = generateCard(photo);
                $("#images").append(html);
            }

            showAlert("Loaded " + photos.length + " images!");
        })
        .catch((err) => {
            console.error(err);
            showAlert(
                "Error loading images :( <small>Check console!</small>",
                "danger"
            );
        });
});

const loader = () => {
    return `<div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`;
};

const hide = (e) => {
    e.target.closest(".col-md-4").classList.add("d-none");
};

const view = (e, alt, image) => {
    $("#imageModal h5").text(alt);
    $("#imageModal img").attr("src", image);

    $("#imageModal").modal();
};

$(function () {
    $("#carousel").html(loader());
    search("forest")
        .then((data) => {
            const { photos } = data;
            $("#carousel").html("");
            let i = 0;
            for (const photo of photos) {
                const {
                    width,
                    height,
                    url,
                    photographer,
                    photographer_url,
                    id,
                    alt,
                    avg_color,
                    src: { medium, original, large },
                } = photo;
                let active = i++ === 0 ? true : false;
                const html = `<div class="carousel-item${
                    active ? " active" : ""
                }">
                    <img class="d-block w-100" src="${original}" alt="${alt}" />
                </div>`;

                $("#carousel").append(html);
            }
        })
        .catch(console.error);
});
