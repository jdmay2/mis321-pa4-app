const rateUrl = `https://localhost:5001/api/Rating`;
const likeUrl = `https://localhost:5001/api/Like`;

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
  window.location.assign(`/home.html`);
};

navProfile = () => {
  window.location.assign(`/profile.html`);
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
  localStorage.removeItem("jokkouid");
  sessionStorage.removeItem("jokkouid");
  window.location.replace(`/index.html`);
};
