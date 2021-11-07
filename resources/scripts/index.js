const likeUrl = `https://mis321-pa4-api.herokuapp.com/api/Like`;

document.addEventListener("scroll", () => {
  document.documentElement.dataset.scroll = window.scrollY;
});

handleCreate = () => {
  document.getElementById("login-email").style.display = "flex";
  document.getElementById("login-check").style.display = "none";
  document.getElementById("create-btn").style.display = "flex";
  document.getElementById("login-btn").style.display = "none";
  document.getElementById("create-btn-2").style.display = "none";
  document.getElementById("login-btn-2").style.display = "flex";
};

handleSignIn = () => {
  document.getElementById("login-email").style.display = "none";
  document.getElementById("login-check").style.display = "flex";
  document.getElementById("create-btn").style.display = "none";
  document.getElementById("login-btn").style.display = "flex";
  document.getElementById("create-btn-2").style.display = "flex";
  document.getElementById("login-btn-2").style.display = "none";
};

deleteLike = async (id) => {
  try {
    fetch(`${likeUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((res) => resolve(res ? JSON.parse(res) : {}))
      .catch((error) => {
        reject(error);
      });
  } catch (error) {
    console.log(error);
  }
};

postLike = async (id) => {
  const likes = await fetch(likeUrl).then((res) => res.json());
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  const filteredLikes = likes.filter(
    (like) => like.postId == id && like.userId == uid
  );
  if (filteredLikes.length == 0) {
    try {
      console.log(id);
      fetch(likeUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: id,
          userId: uid,
        }),
      })
        .then((res) => res.text())
        .then((res) => resolve(res ? JSON.parse(res) : {}))
        .catch((error) => {
          reject(error);
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    deleteLike(filteredLikes[0].id);
  }
};

like = (id) => {
  const like = document.getElementById(`like-${id}`);
  if (like.className === "bi bi-heart") {
    like.className = "bi bi-heart-fill";
  } else {
    like.className = "bi bi-heart";
  }
  postLike(id);
};

navHome = () => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  if (uid !== null) {
    window.location.assign(`/home.html`);
  } else {
    window.location.assign(`/index.html`);
  }
};

navProfile = () => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  if (uid !== null) {
    window.location.assign(`/profile.html`);
  } else {
    window.location.assign(`/index.html`);
  }
};

navUser = (id) => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  if (uid == id) {
    window.location.assign(`/profile.html`);
  } else {
    window.location.assign(`/user.html?jokkouid=${id}`);
  }
};

signOut = () => {
  if (localStorage.getItem("jokkouid") !== null) {
    localStorage.removeItem("jokkouid");
  } else {
    sessionStorage.removeItem("jokkouid");
  }
  window.location.replace(`/index.html`);
};
