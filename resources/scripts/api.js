const userUrl = `https://mis321-pa4-api.herokuapp.com/api/User`;
const postUrl = `https://mis321-pa4-api.herokuapp.com/api/Post`;

reload = () => {
  window.location.reload();
};

getId = () => {
  const uid =
    sessionStorage.getItem("jokkouid") !== null
      ? sessionStorage.getItem("jokkouid")
      : localStorage.getItem("jokkouid");
  return uid;
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

deleteAccount = async () => {
  const uid = getId();
  console.log(uid);
  try {
    fetch(`${userUrl}/${uid}`, {
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
    if (localStorage.getItem("jokkouid") !== null) {
      localStorage.removeItem("jokkouid");
    } else {
      sessionStorage.removeItem("jokkouid");
    }
    setTimeout(reload, 400);
  } catch (error) {
    console.log(error);
  }
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
    setTimeout(reload, 400);
  } catch (error) {
    console.log(error);
  }
};

handleEditPost = async (id) => {
  document.getElementById("sub-post").innerHTML = "";
  const posts = await fetch(postUrl).then((res) => res.json());
  const users = await fetch(userUrl).then((res) => res.json());
  const filteredPosts = posts.filter((post) => post.id == id);
  const p = filteredPosts[0];
  const filteredPosts2 = posts.filter((post) => post.id == p.subId);
  const sp = filteredPosts2.length > 0 ? filteredPosts2[0] : null;
  const filteredUsers2 = sp
    ? users.filter((user) => user.id == p.userId)
    : null;
  const subUser = filteredUsers2.length > 0 ? filteredUsers2[0] : null;
  if (sp) {
    const post = document.createElement("div");
    post.className = "col-xl-4";
    post.innerHTML = `<div id="cd" class="card text-white">
    <div class="card-header text-center">
      <p id="editPostId">${p.id}</p>
      <a id="user-tag" onclick="navUser(${sp.userId})">${subUser.username}</a>
    </div>
    <div class="card-body">
      <div class="card-text">${sp.text}</div>
    </div>
    <div class="card-footer text-center">
      ${dateFormat(sp.date)}
    </div>
  </div>`;
    document.getElementById("edit-sub-post").appendChild(post);
    document.getElementById("editInput").value = p.text;
  } else {
    document.getElementById(
      "edit-sub-post"
    ).innerHTML = `<p id="editPostId">${p.id}</p>`;
    document.getElementById("editInput").value = p.text;
  }
};

postItem = ({ p, posts, users, likes, uid }) => {
  const filteredPosts = posts.filter((post) => post.id == p.subId);
  const subPost = filteredPosts[0];
  const filteredUsers = users.filter((user) => user.id == p.userId);
  const filteredUsers2 =
    subPost !== undefined
      ? users.filter((user) => user.id == subPost.userId)
      : [];
  const subUser = filteredUsers2[0];
  const username = filteredUsers[0].username;
  const post = document.createElement("div");
  post.className = "col-xl-4 animate__animated animate__zoomIn";
  post.innerHTML = `<div id="cd" class="card text-white">
          <div class="card-header text-center">
            <a id="user-tag" onclick="navUser(${p.userId})">${username}</a>
          </div>
          ${
            p.subId == 0
              ? ""
              : `<div id="sub-post-body" class="col-xl-4">
              <div id="sub-cd" class="card text-white">
              <div class="card-header text-center">
                <a id="user-tag" onclick="navUser(${subPost.userId})">${
                  subUser.username
                }</a>
              </div>
              <div class="card-body">
                <div class="card-text">${subPost.text}</div>
              </div>
              <div class="card-footer text-center">
                ${dateFormat(subPost.date)}
              </div>
            </div>
              </div>`
          }
          <div class="card-body">
              <div class="card-text">${p.text}</div>
              <div id="rating">
                ${
                  p.userId == uid
                    ? `<i id="like-${p.id}" class="bi bi-trash-fill" onclick="handleDeletePost(${p.id})"></i>
                      <i class="bi bi-pencil-square" data-bs-toggle="modal"
                      data-bs-target="#editModal" onclick="handleEditPost(${p.id})"></i>`
                    : `<i id="like-${p.id}" class="bi ${
                        likes.filter(
                          (like) => like.postId == p.id && like.userId == uid
                        ).length > 0
                          ? "bi-heart-fill"
                          : "bi-heart"
                      }" onclick="like(${p.id})"></i>
                      <i class="bi bi-arrow-repeat" data-bs-toggle="modal"
                      data-bs-target="#repostModal" onclick="repost(${
                        p.id
                      })"></i>`
                }
            </div>
          </div>
          <div class="card-footer text-center">
            ${dateFormat(p.date)}
          </div>
        </div>`;
  document.getElementById("posts").appendChild(post);
};

repost = async (id) => {
  document.getElementById("sub-post").innerHTML = "";
  const posts = await fetch(postUrl).then((res) => res.json());
  const users = await fetch(userUrl).then((res) => res.json());
  const filteredPosts = posts.filter((post) => post.id == id);
  const p = filteredPosts[0];
  const filteredUsers = users.filter((user) => user.id == p.userId);
  const subUser = filteredUsers[0];
  const post = document.createElement("div");
  post.className = "row-xl-4";
  post.innerHTML = `<div id="cd" class="card text-white">
  <div class="card-header text-center">
    <p id="postId">${p.id}</p>
    <a id="user-tag" onclick="navUser(${p.userId})">${subUser.username}</a>
  </div>
  <div class="card-body">
    <div class="card-text">${p.text}</div>
  </div>
  <div class="card-footer text-center">
    ${dateFormat(p.date)}
  </div>
</div>`;
  document.getElementById("sub-post").appendChild(post);
};

handleOnSubmit = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const email = document.getElementById("userEmail").value.toLowerCase();
  const username = document.getElementById("userName").value.toLowerCase();
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
          window.location.replace(`/index.html`);
        }, 300);
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
  const username = document.getElementById("userName").value.toLowerCase();
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
        window.location.replace(`/home.html`);
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
  const uid = getId();
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
      setTimeout(reload, 400);
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

handleRepost = async () => {
  const uid = getId();
  const pid = parseInt(document.getElementById("postId").innerText);
  const text = document.getElementById("repostInput").value;
  const date = new Date().toISOString();
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
          subId: pid,
          text: text,
          date: date,
        }),
      })
        .then((res) => res.text())
        .then((res) => resolve(res ? JSON.parse(res) : {}))
        .catch((error) => {
          reject(error);
        });
      setTimeout(reload, 400);
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

handleOnEdit = async () => {
  const pid = parseInt(document.getElementById("editPostId").innerText);
  const text = document.getElementById("editInput").value;
  console.log(pid);
  console.log(text);
  try {
    if (text.length > 0) {
      fetch(postUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pid,
          text: text,
        }),
      })
        .then((res) => res.text())
        .then((res) => resolve(res ? JSON.parse(res) : {}))
        .catch((error) => {
          reject(error);
        });
      setTimeout(reload, 400);
    } else {
      alert("You have not typed anything!");
    }
  } catch (error) {
    console.log(error);
  }
};

populatePostList = async () => {
  try {
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(
      `https://mis321-pa4-api.herokuapp.com/api/Like`
    ).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    document.getElementById("posts").innerHTML = "";
    document.getElementById("sub-spinner").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    if (posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        setTimeout(() => {
          postItem({ p: posts[i], posts, users, likes, uid });
        }, i * 100);
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
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
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(
      `https://mis321-pa4-api.herokuapp.com/api/Like`
    ).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const filteredPosts = posts.filter((post) => post.userId == uid);
    document.getElementById("posts").innerHTML = "";
    document.getElementById("sub-spinner").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    if (filteredPosts.length > 0) {
      for (let i = 0; i < filteredPosts.length; i++) {
        postItem({ p: filteredPosts[i], posts, users, likes, uid });
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
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
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(
      `https://mis321-pa4-api.herokuapp.com/api/Like`
    ).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const filteredLikes = likes.filter((like) => like.userId == uid);
    const likePostIds = filteredLikes.map((like) => like.postId);
    const filteredPosts = posts.filter((post) => likePostIds.includes(post.id));
    document.getElementById("posts").innerHTML = "";
    document.getElementById("sub-spinner").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    if (filteredPosts.length > 0) {
      for (let i = 0; i < filteredPosts.length; i++) {
        postItem({ p: filteredPosts[i], posts, users, likes, uid });
      }
    } else {
      const post = document.createElement("div");
      post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
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
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(
      `https://mis321-pa4-api.herokuapp.com/api/Like`
    ).then((res) => res.json());
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const uID = parseInt(params.jokkouid);
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (uID !== null) {
      const filteredPosts = posts.filter((post) => post.userId === uID);
      document.getElementById("posts").innerHTML = "";
      document.getElementById("sub-spinner").style.display = "none";
      document.getElementById("spinner").style.display = "none";
      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          postItem({ p: filteredPosts[i], posts, users, likes, uid });
        }
      } else {
        const post = document.createElement("div");
        post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
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
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(
      `https://mis321-pa4-api.herokuapp.com/api/Like`
    ).then((res) => res.json());
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
      document.getElementById("sub-spinner").style.display = "none";
      document.getElementById("spinner").style.display = "none";
      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          postItem({ p: filteredPosts[i], posts, users, likes, uid });
        }
      } else {
        const post = document.createElement("div");
        post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
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
    const uid = getId();
    const posts = await fetch(postUrl).then((res) => res.json());
    const users = await fetch(userUrl).then((res) => res.json());
    const likes = await fetch(
      `https://mis321-pa4-api.herokuapp.com/api/Like`
    ).then((res) => res.json());
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const searchBar = document.getElementById("searchbar");
    searchBar.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        var search = searchBar.value.toLowerCase();
        const filteredPosts = [];
        for (let i = 0; i < posts.length; i++) {
          const filteredUsers = users.filter(
            (user) => user.id == posts[i].userId
          );
          const username = filteredUsers[0].username;
          if (
            posts[i].text.toLowerCase().includes(search) ||
            username.toLowerCase().includes(search)
          ) {
            filteredPosts.push(posts[i]);
          }
        }
        document.getElementById("posts").innerHTML = "";
        document.getElementById("sub-spinner").style.display = "none";
        document.getElementById("spinner").style.display = "none";
        if (filteredPosts.length > 0) {
          filteredPosts.forEach((p) => {
            postItem({ p: p, posts, users, likes, uid });
          });
        } else {
          const post = document.createElement("div");
          post.className = "col-xl-4 w-100 animate__animated animate__zoomIn";
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
    window.location.replace(`/home.html`);
  }
};

onHomeLoad = () => {
  if (
    localStorage.getItem("jokkouid") === null &&
    sessionStorage.getItem("jokkouid") === null
  ) {
    window.location.replace(`/index.html`);
  } else {
    populatePostList();
  }
};

onProfileLoad = async () => {
  const users = await fetch(userUrl).then((res) => res.json());
  const uid = getId();
  if (uid !== null) {
    const filteredUsers = users.filter((user) => user.id == uid);
    if (filteredUsers.length > 0) {
      document.getElementById("searchbar").placeholder =
        filteredUsers[0].username;
      populateProfileList();
    } else {
      window.location.replace(`/index.html`);
    }
  } else {
    window.location.replace(`/index.html`);
  }
};

onUserLoad = async () => {
  if (
    localStorage.getItem("jokkouid") === null &&
    sessionStorage.getItem("jokkouid") === null
  ) {
    window.location.replace(`/index.html`);
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
        window.location.replace(`/home.html`);
      }
    } else {
      window.location.replace(`/home.html`);
    }
  }
};
