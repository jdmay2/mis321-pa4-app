const userUrl = `https://localhost:5001/api/User`;
const postUrl = `https://localhost:5001/api/Post`;

reload = () => {
  window.location.reload();
};

dateFormat = (date) => {
  var date = new Date(date);
  var hh = date.getHours() - 5;
  if (hh < 0) {
    hh = 24 + hh;
  }
  var min = date.getMinutes();
  var ampm = hh >= 12 ? "pm" : "am";
  hh = hh % 12;
  hh = hh ? hh : 12;
  min = min < 10 ? "0" + min : min;
  var strTime = hh + ":" + min + " " + ampm;
  date =
    date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    strTime;
  return date;
};

handleDeletePost = async (id) => {
  try {
    fetch(`${postUrl}/${id}`, {
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
    setTimeout(reload, 200);
  } catch (error) {
    console.log(error);
  }
};

postItem = ({ p, users, likes, uid }) => {
  const post = document.createElement("div");
  post.className = "col-xl-4 animate__animated animate__zoomIn";
  post.innerHTML = `<div id="cd" class="card text-white">
          <div class="card-header text-center">
            <a id="user-tag" onclick="navUser(${p.userId})">${users[
    p.userId - 1
  ].username.toLowerCase()}</a>
          </div>
          <div class="card-body">
            <div class="card-text">${p.text}</div>
            <div id="rating">
              ${
                p.userId == uid
                  ? `<i id="like-${p.id}" class="bi bi-trash-fill" onclick="handleDeletePost(${p.id})"></i>`
                  : `<i id="like-${p.id}" class="bi ${
                      likes.filter(
                        (like) => like.postId == p.id && like.userId == uid
                      ).length > 0
                        ? "bi-heart-fill"
                        : "bi-heart"
                    }" onclick="like(${p.id})"></i>`
              }
            </div>
          </div>
          <div class="card-footer text-center">
            ${dateFormat(p.date)}
          </div>
        </div>`;
  document.getElementById("posts").appendChild(post);
};

handleOnSubmit = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const email = document.getElementById("userEmail").value;
  const username = document.getElementById("userName").value;
  const password = document.getElementById("userPassword").value;
  if (email.length > 0 && username.length > 0 && password.length > 0) {
    if (email.includes("@") && email.includes(".")) {
      var u = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
          u = true;
          break;
        }
      }
      if (!u) {
        fetch(userUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
          }),
        })
          .then((res) => res.text())
          .then((res) => resolve(res ? JSON.parse(res) : {}))
          .catch((error) => {
            reject(error);
          });
        setTimeout(() => {
          window.location.replace(`/Users/josephmay/mis321-pa4-app/index.html`);
        }, 200);
      } else {
        alert("Username already exists");
      }
    } else {
      alert("Invalid email");
    }
  } else {
    alert("One or more fields do not contain a value!");
  }
};

handleOnLogin = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const username = document.getElementById("userName").value;
  const password = document.getElementById("userPassword").value;
  const check = document.getElementById("check").checked;
  try {
    if (username !== null && password !== null) {
      var u = false;
      var id = null;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
          if (users[i].password == password) {
            u = true;
            id = users[i].id;
            break;
          }
        }
      }
      if (u) {
        if (
          localStorage.getItem("jokkouid") !== null ||
          sessionStorage.getItem("jokkouid") !== null
        ) {
          localStorage.removeItem("jokkouid");
          sessionStorage.removeItem("jokkouid");
        }
        if (check) {
          localStorage.setItem("jokkouid", id);
        } else {
          sessionStorage.setItem("jokkouid", id);
        }
        window.location.replace(`/Users/josephmay/mis321-pa4-app/home.html`);
        console.log(id);
      } else {
        alert("Invalid username or password");
      }
    } else {
      alert("Please enter a username and password!");
    }
  } catch (error) {
    console.log(error);
  }
};

handleOnPost = async () => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  const text = document.getElementById("postInput").value;
  const date = new Date().toISOString();
  console.log(date);
  console.log(uid);
  try {
    if (text.length > 0) {
      fetch(postUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uid,
          text: text,
          date: date,
        }),
      })
        .then((res) => res.text())
        .then((res) => resolve(res ? JSON.parse(res) : {}))
        .catch((error) => {
          reject(error);
        });
      setTimeout(reload, 200);
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

populatePostList = async () => {
  try {
    const uid =
      sessionStorage.getItem("jokkouid") !== null
        ? sessionStorage.getItem("jokkouid")
        : localStorage.getItem("jokkouid");
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(`https://localhost:5001/api/Like`).then((res) =>
      res.json()
    );
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    document.getElementById("posts").innerHTML = "";
    if (posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        setTimeout(() => {
          postItem({ p: posts[i], users, likes, uid });
        }, i * 100);
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-md-4 animate__animated animate__zoomIn";
      post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
      document.getElementById("posts").appendChild(post);
    }
  } catch (error) {
    console.error(error);
  }
};

populateProfileList = async () => {
  document.getElementById("profile-likes").className = "nav-link";
  document.getElementById("profile-your").className = "nav-link active";
  try {
    const uid =
      sessionStorage.getItem("jokkouid") !== null
        ? sessionStorage.getItem("jokkouid")
        : localStorage.getItem("jokkouid");
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(`https://localhost:5001/api/Like`).then((res) =>
      res.json()
    );
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const filteredPosts = posts.filter((post) => post.userId == uid);
    document.getElementById("posts").innerHTML = "";
    if (filteredPosts.length > 0) {
      for (let i = 0; i < filteredPosts.length; i++) {
        postItem({ p: filteredPosts[i], users, likes, uid });
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-md-4 animate__animated animate__zoomIn";
      post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
      document.getElementById("posts").appendChild(post);
    }
  } catch (error) {
    console.error(error);
  }
};

populateLikes = async () => {
  document.getElementById("profile-your").className = "nav-link";
  document.getElementById("profile-likes").className = "nav-link active";
  try {
    const uid =
      sessionStorage.getItem("jokkouid") !== null
        ? sessionStorage.getItem("jokkouid")
        : localStorage.getItem("jokkouid");
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(`https://localhost:5001/api/Like`).then((res) =>
      res.json()
    );
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const filteredLikes = likes.filter((like) => like.userId == uid);
    const likePostIds = filteredLikes.map((like) => like.postId);
    const filteredPosts = posts.filter((post) => likePostIds.includes(post.id));
    document.getElementById("posts").innerHTML = "";
    if (filteredPosts.length > 0) {
      for (let i = 0; i < filteredPosts.length; i++) {
        postItem({ p: filteredPosts[i], users, likes, uid });
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-md-4 animate__animated animate__zoomIn";
      post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
      document.getElementById("posts").appendChild(post);
    }
  } catch (error) {
    console.error(error);
  }
};

populateUserList = async () => {
  document.getElementById("profile-likes").className = "nav-link";
  document.getElementById("profile-your").className = "nav-link active";
  try {
    const uid =
      sessionStorage.getItem("jokkouid") !== null
        ? sessionStorage.getItem("jokkouid")
        : localStorage.getItem("jokkouid");
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(`https://localhost:5001/api/Like`).then((res) =>
      res.json()
    );
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = parseInt(params.jokkouid);
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (uID !== null) {
      const filteredPosts = posts.filter((post) => post.userId === uID);
      document.getElementById("posts").innerHTML = "";
      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          postItem({ p: filteredPosts[i], users, likes, uid });
        }
      } else {
        const post = document.createElement("div");
        post.className = "col-md-4 animate__animated animate__zoomIn";
        post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
        document.getElementById("posts").appendChild(post);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

populateUserLikes = async () => {
  document.getElementById("profile-your").className = "nav-link";
  document.getElementById("profile-likes").className = "nav-link active";
  try {
    const uid =
      sessionStorage.getItem("jokkouid") !== null
        ? sessionStorage.getItem("jokkouid")
        : localStorage.getItem("jokkouid");
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(`https://localhost:5001/api/Like`).then((res) =>
      res.json()
    );
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = parseInt(params.jokkouid);
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (uID !== null) {
      const filteredLikes = likes.filter((like) => like.userId === uID);
      const likePostIds = filteredLikes.map((like) => like.postId);
      const filteredPosts = posts.filter((post) =>
        likePostIds.includes(post.id)
      );
      document.getElementById("posts").innerHTML = "";
      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          postItem({ p: filteredPosts[i], users, likes, uid });
        }
      } else {
        const post = document.createElement("div");
        post.className = "col-md-4 animate__animated animate__zoomIn";
        post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              There are no posts to display!
            </div>
          </div>`;
        document.getElementById("posts").appendChild(post);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

handleOnSearch = async () => {
  try {
    const uid =
      sessionStorage.getItem("jokkouid") !== null
        ? sessionStorage.getItem("jokkouid")
        : localStorage.getItem("jokkouid");
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(`https://localhost:5001/api/Like`).then((res) =>
      res.json()
    );
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const searchBar = document.getElementById("searchbar");
    searchBar.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        var search = searchBar.value.toLowerCase();
        const filteredPosts = [];
        for (let i = 0; i < posts.length; i++) {
          if (
            posts[i].text.toLowerCase().includes(search) ||
            users[posts[i].userId - 1].username.toLowerCase().includes(search)
          ) {
            filteredPosts.push(posts[i]);
          }
        }
        document.getElementById("posts").innerHTML = "";
        if (filteredPosts.length > 0) {
          filteredPosts.forEach((p) => {
            postItem({ p: p, users, likes, uid });
          });
        } else {
          const post = document.createElement("div");
          post.className = "col-md-4 animate__animated animate__zoomIn";
          post.innerHTML = `<div id="cd" class="card text-white">
            <div class="card-header text-center">
              No results found
            </div>
          </div>`;
          document.getElementById("posts").appendChild(post);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

onIndexLoad = () => {
  if (
    localStorage.getItem("jokkouid") !== null ||
    sessionStorage.getItem("jokkouid") !== null
  ) {
    window.location.replace(`/Users/josephmay/mis321-pa4-app/home.html`);
  }
};

onHomeLoad = () => {
  if (
    localStorage.getItem("jokkouid") === null &&
    sessionStorage.getItem("jokkouid") === null
  ) {
    window.location.replace(`/Users/josephmay/mis321-pa4-app/index.html`);
  } else {
    populatePostList();
  }
};

onProfileLoad = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  if (uid !== null) {
    const filteredUsers = users.filter((user) => user.id == uid);
    if (filteredUsers.length > 0) {
      document.getElementById("searchbar").placeholder =
        filteredUsers[0].username;
      populateProfileList();
    } else {
      window.location.replace(`/Users/josephmay/mis321-pa4-app/index.html`);
    }
  } else {
    window.location.replace(`/Users/josephmay/mis321-pa4-app/index.html`);
  }
};

onUserLoad = async () => {
  if (
    localStorage.getItem("jokkouid") === null &&
    sessionStorage.getItem("jokkouid") === null
  ) {
    window.location.replace(`/Users/josephmay/mis321-pa4-app/index.html`);
  } else {
    const users = await fetch(userUrl).then((res) => res.json());
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = params.jokkouid;
    if (uID !== null) {
      const filteredUsers = users.filter((user) => user.id == uID);
      if (filteredUsers.length > 0) {
        document.getElementById("searchbar").placeholder =
          filteredUsers[0].username;
        populateUserList();
      } else {
        window.location.replace(`/Users/josephmay/mis321-pa4-app/home.html`);
      }
    } else {
      window.location.replace(`/Users/josephmay/mis321-pa4-app/home.html`);
    }
  }
};
