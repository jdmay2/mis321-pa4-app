const likeUrl = `https://mis321-pa4-api.herokuapp.com/api/Like`;

document.addEventListener("scroll", () => {
  document.documentElement.dataset.scroll = window.scrollY;
});

refreshLikes = () => {
  if (document.URL.includes("home.html")) {
    populatePostList();
  } else if (
    document.URL.includes("profile.html") ||
    document.URL.includes("user.html")
  ) {
    populateLikes();
  }
};

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
    }).then(() => refreshLikes());
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
      }).then(() => refreshLikes());
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

navChat = () => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  if (uid !== null) {
    window.location.assign(`/chat.html`);
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
